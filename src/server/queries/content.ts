/**
 * Lecturas públicas (solo contenido publicado). Cacheadas con `use cache` y etiquetas:
 *   "articles", "article:<slug>", "categories", "timeline", "experiences", "paths".
 * Las Server Actions del CMS invalidan estas etiquetas al publicar o editar.
 */
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { and, asc, desc, eq, inArray, or, sql, like } from "drizzle-orm";
import { db } from "@/server/db/client";
import {
  articleRelations,
  articleSources,
  articles,
  categories,
  experiences,
  learningPathSteps,
  learningPaths,
  sources,
  timelineEvents,
  type EntityType,
} from "@/server/db/schema";
import { escapeLike } from "@/server/search/query-utils";

export type ArticleCard = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string;
  entityType: EntityType;
  readingMinutes: number;
  categoryName: string;
  categoryPath: string;
};

const cardColumns = {
  id: articles.id,
  slug: articles.slug,
  title: articles.title,
  subtitle: articles.subtitle,
  summary: articles.summary,
  entityType: articles.entityType,
  readingMinutes: articles.readingMinutes,
  categoryName: categories.name,
  categoryPath: categories.path,
};

const published = (locale: string) => and(eq(articles.status, "published"), eq(articles.locale, locale));

/* ── Categorías ─────────────────────────────────────────────────────────── */

export type CategoryNode = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  path: string;
  depth: number;
  icon: string | null;
  parentId: string | null;
  articleCount: number;
};

/** Todas las categorías activas con el número de artículos publicados (incluye descendientes). */
export async function getCategoryTree(locale = "es"): Promise<CategoryNode[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("categories", "articles");
  const rows = await db.execute<CategoryNode & { article_count: number; parent_id: string | null }>(sql`
    SELECT c.id, c.slug, c.name, c.description, c.path, c.depth, c.icon, c.parent_id,
      (SELECT count(*)::int FROM articles a JOIN categories ac ON ac.id = a.category_id
        WHERE a.status = 'published' AND a.locale = ${locale}
          AND (ac.path = c.path OR ac.path LIKE replace(replace(c.path, '_', '\\_'), '%', '\\%') || '/%')) AS article_count
    FROM categories c
    WHERE c.archived_at IS NULL
    ORDER BY c.depth, c.sort_order, c.name`);
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    path: r.path,
    depth: r.depth,
    icon: r.icon,
    parentId: r.parent_id,
    articleCount: r.article_count,
  }));
}

export async function getTopCategories(): Promise<CategoryNode[]> {
  return (await getCategoryTree()).filter((c) => c.depth === 0);
}

export async function getCategoryByPath(path: string) {
  const tree = await getCategoryTree();
  const node = tree.find((c) => c.path === path);
  if (!node) return null;
  const segments = path.split("/");
  const breadcrumbs = segments.map((_, i) => {
    const p = segments.slice(0, i + 1).join("/");
    const n = tree.find((c) => c.path === p)!;
    return { name: n?.name ?? p, path: p };
  });
  const children = tree.filter((c) => c.parentId === node.id);
  return { node, breadcrumbs, children };
}

/** Artículos publicados de una rama (incluidas subramas y categorías secundarias). */
export async function getArticlesInBranch(path: string, limit = 24, locale = "es"): Promise<ArticleCard[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("articles", "categories");
  return db
    .select(cardColumns)
    .from(articles)
    .innerJoin(categories, eq(categories.id, articles.categoryId))
    .where(
      and(
        published(locale),
        or(
          eq(categories.path, path),
          like(categories.path, `${escapeLike(path)}/%`),
          sql`EXISTS (SELECT 1 FROM article_categories ac JOIN categories c2 ON c2.id = ac.category_id
                      WHERE ac.article_id = ${articles.id} AND (c2.path = ${path} OR c2.path LIKE ${escapeLike(path) + "/%"}))`,
        ),
      ),
    )
    // Primero los artículos cuya categoría principal está en la rama; después los secundarios.
    .orderBy(
      desc(sql`(${categories.path} = ${path} OR ${categories.path} LIKE ${escapeLike(path) + "/%"})`),
      desc(articles.publishedAt),
      asc(articles.title),
    )
    .limit(limit);
}

export async function getArticlesByEntityType(types: EntityType[], limit = 8, locale = "es"): Promise<ArticleCard[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");
  return db
    .select(cardColumns)
    .from(articles)
    .innerJoin(categories, eq(categories.id, articles.categoryId))
    .where(and(published(locale), inArray(articles.entityType, types)))
    .orderBy(asc(articles.title))
    .limit(limit);
}

export async function getArticleCardsByIds(ids: string[]): Promise<ArticleCard[]> {
  if (!ids.length) return [];
  return db
    .select(cardColumns)
    .from(articles)
    .innerJoin(categories, eq(categories.id, articles.categoryId))
    .where(and(eq(articles.status, "published"), inArray(articles.id, ids)));
}

export async function getLatestArticles(limit = 6, locale = "es"): Promise<ArticleCard[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");
  return db
    .select(cardColumns)
    .from(articles)
    .innerJoin(categories, eq(categories.id, articles.categoryId))
    .where(published(locale))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

/**
 * «Conocimiento del día»: elección determinista según la fecha (UTC), para que todos los
 * lectores vean el mismo artículo durante el día.
 */
export async function getArticleOfTheDay(locale = "es"): Promise<(ArticleCard & { dateKey: string }) | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");
  const dateKey = new Date().toISOString().slice(0, 10);
  const all = await db
    .select(cardColumns)
    .from(articles)
    .innerJoin(categories, eq(categories.id, articles.categoryId))
    .where(published(locale))
    .orderBy(asc(articles.id));
  if (!all.length) return null;
  let h = 0;
  for (const ch of dateKey) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return { ...all[h % all.length], dateKey };
}

/** Selección variada: un artículo por rama principal (para «Descubrimientos recomendados»). */
export async function getDiverseSelection(limit = 6, locale = "es"): Promise<ArticleCard[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");
  const rows = await db.execute<ArticleCard & { reading_minutes: number; entity_type: EntityType; category_name: string; category_path: string }>(sql`
    SELECT DISTINCT ON (split_part(c.path, '/', 1))
      a.id, a.slug, a.title, a.subtitle, a.summary, a.entity_type, a.reading_minutes,
      c.name AS category_name, c.path AS category_path
    FROM articles a JOIN categories c ON c.id = a.category_id
    WHERE a.status = 'published' AND a.locale = ${locale}
    ORDER BY split_part(c.path, '/', 1), a.published_at DESC`);
  return rows.slice(0, limit).map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle,
    summary: r.summary,
    entityType: r.entity_type,
    readingMinutes: r.reading_minutes,
    categoryName: r.category_name,
    categoryPath: r.category_path,
  }));
}

/* ── Artículo ───────────────────────────────────────────────────────────── */

export async function getPublishedArticle(slug: string, locale = "es") {
  "use cache";
  cacheLife("hours");
  cacheTag("articles", `article:${slug}`);

  const [article] = await db
    .select({
      article: articles,
      category: { name: categories.name, path: categories.path },
    })
    .from(articles)
    .innerJoin(categories, eq(categories.id, articles.categoryId))
    .where(and(published(locale), eq(articles.slug, slug)))
    .limit(1);
  if (!article) return null;
  const a = article.article;

  const [articleSourceRows, outgoing, incoming] = await Promise.all([
    db
      .select({ source: sources, locator: articleSources.locator })
      .from(articleSources)
      .innerJoin(sources, eq(sources.id, articleSources.sourceId))
      .where(eq(articleSources.articleId, a.id))
      .orderBy(asc(articleSources.position)),
    db
      .select({ type: articleRelations.type, description: articleRelations.description, ...cardColumns })
      .from(articleRelations)
      .innerJoin(articles, eq(articles.id, articleRelations.toArticleId))
      .innerJoin(categories, eq(categories.id, articles.categoryId))
      .where(and(eq(articleRelations.fromArticleId, a.id), eq(articles.status, "published"))),
    db
      .select({ type: articleRelations.type, description: articleRelations.description, ...cardColumns })
      .from(articleRelations)
      .innerJoin(articles, eq(articles.id, articleRelations.fromArticleId))
      .innerJoin(categories, eq(categories.id, articles.categoryId))
      .where(and(eq(articleRelations.toArticleId, a.id), eq(articles.status, "published"))),
  ]);

  // Una relación es navegable en ambos sentidos; se deduplica por artículo destino.
  const seen = new Set<string>();
  const related = [...outgoing.map((r) => ({ ...r, direction: "out" as const })), ...incoming.map((r) => ({ ...r, direction: "in" as const }))].filter(
    (r) => (seen.has(r.id) ? false : (seen.add(r.id), true)),
  );

  const [translations, events] = await Promise.all([
    db
      .select({ locale: articles.locale, slug: articles.slug, translationKind: articles.translationKind })
      .from(articles)
      .where(and(eq(articles.translationGroupId, a.translationGroupId), eq(articles.status, "published"))),
    db
      .select({ slug: timelineEvents.slug, title: timelineEvents.title, displayDate: timelineEvents.displayDate })
      .from(timelineEvents)
      .where(and(eq(timelineEvents.articleId, a.id), eq(timelineEvents.status, "published")))
      .orderBy(asc(timelineEvents.startYear)),
  ]);

  return {
    ...a,
    category: article.category,
    sources: articleSourceRows,
    related,
    translations: translations.filter((t) => t.locale !== a.locale),
    events,
  };
}

export type PublishedArticle = NonNullable<Awaited<ReturnType<typeof getPublishedArticle>>>;

export async function getPublishedSlugs(locale = "es") {
  "use cache";
  cacheLife("hours");
  cacheTag("articles");
  return db
    .select({ slug: articles.slug, updatedAt: articles.updatedAt })
    .from(articles)
    .where(published(locale));
}

/* ── Línea de tiempo ────────────────────────────────────────────────────── */

export async function getTimeline() {
  "use cache";
  cacheLife("hours");
  cacheTag("timeline", "articles");
  return db
    .select({
      id: timelineEvents.id,
      slug: timelineEvents.slug,
      title: timelineEvents.title,
      summary: timelineEvents.summary,
      startYear: timelineEvents.startYear,
      endYear: timelineEvents.endYear,
      precision: timelineEvents.precision,
      displayDate: timelineEvents.displayDate,
      uncertainty: timelineEvents.uncertainty,
      era: timelineEvents.era,
      region: timelineEvents.region,
      theme: timelineEvents.theme,
      articleSlug: articles.slug,
      articleTitle: articles.title,
      sourceTitle: sources.title,
      sourceUrl: sources.url,
    })
    .from(timelineEvents)
    .leftJoin(articles, and(eq(articles.id, timelineEvents.articleId), eq(articles.status, "published")))
    .leftJoin(sources, eq(sources.id, timelineEvents.sourceId))
    .where(eq(timelineEvents.status, "published"))
    .orderBy(asc(timelineEvents.startYear));
}

export type TimelineEvent = Awaited<ReturnType<typeof getTimeline>>[number];

/* ── Experiencias ───────────────────────────────────────────────────────── */

export async function getExperiences() {
  "use cache";
  cacheLife("hours");
  cacheTag("experiences", "articles");
  return db
    .select({
      id: experiences.id,
      slug: experiences.slug,
      title: experiences.title,
      summary: experiences.summary,
      experienceType: experiences.experienceType,
      availability: experiences.availability,
      country: experiences.country,
      latitude: experiences.latitude,
      longitude: experiences.longitude,
      coordinatesApproximate: experiences.coordinatesApproximate,
      unescoId: experiences.unescoId,
      articleSlug: articles.slug,
    })
    .from(experiences)
    .leftJoin(articles, and(eq(articles.id, experiences.articleId), eq(articles.status, "published")))
    .orderBy(asc(experiences.sortOrder), asc(experiences.title));
}

/* ── Rutas de aprendizaje ───────────────────────────────────────────────── */

export async function getLearningPaths() {
  "use cache";
  cacheLife("hours");
  cacheTag("paths");
  const paths = await db
    .select()
    .from(learningPaths)
    .where(eq(learningPaths.status, "published"))
    .orderBy(asc(learningPaths.title));
  const steps = paths.length
    ? await db
        .select({ pathId: learningPathSteps.pathId, articleId: learningPathSteps.articleId })
        .from(learningPathSteps)
        .where(inArray(learningPathSteps.pathId, paths.map((p) => p.id)))
    : [];
  return paths.map((p) => {
    const own = steps.filter((s) => s.pathId === p.id);
    return { ...p, stepCount: own.length, availableSteps: own.filter((s) => s.articleId).length };
  });
}

export async function getLearningPath(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("paths", "articles");
  const [path] = await db
    .select()
    .from(learningPaths)
    .where(and(eq(learningPaths.slug, slug), eq(learningPaths.status, "published")))
    .limit(1);
  if (!path) return null;
  const steps = await db
    .select({
      id: learningPathSteps.id,
      position: learningPathSteps.position,
      title: learningPathSteps.title,
      description: learningPathSteps.description,
      articleId: learningPathSteps.articleId,
      articleSlug: articles.slug,
      articleStatus: articles.status,
      readingMinutes: articles.readingMinutes,
    })
    .from(learningPathSteps)
    .leftJoin(articles, eq(articles.id, learningPathSteps.articleId))
    .where(eq(learningPathSteps.pathId, path.id))
    .orderBy(asc(learningPathSteps.position));
  return {
    ...path,
    steps: steps.map((s) => ({
      ...s,
      articleSlug: s.articleStatus === "published" ? s.articleSlug : null,
    })),
  };
}

/* ── Estadísticas ───────────────────────────────────────────────────────── */

export async function getLibraryStats() {
  "use cache";
  cacheLife("hours");
  cacheTag("articles", "categories", "timeline");
  const [row] = await db.execute<{ articles: number; categories: number; events: number; sources: number }>(sql`
    SELECT
      (SELECT count(*)::int FROM articles WHERE status = 'published') AS articles,
      (SELECT count(*)::int FROM categories WHERE archived_at IS NULL) AS categories,
      (SELECT count(*)::int FROM timeline_events WHERE status = 'published') AS events,
      (SELECT count(DISTINCT source_id)::int FROM article_sources s JOIN articles a ON a.id = s.article_id WHERE a.status = 'published') AS sources`);
  return row;
}

