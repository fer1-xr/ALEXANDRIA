/**
 * Carga inicial idempotente: taxonomía, fuentes, artículos de demostración, grafo,
 * línea de tiempo, experiencias, rutas y sinónimos.
 * Uso: `npm run db:seed` (lee DATABASE_URL). Puede ejecutarse varias veces.
 */
import "dotenv/config";
import { eq, sql } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../src/server/db/schema";
import { slugify } from "../../src/lib/slug";
import { estimateReadingMinutes } from "../../src/lib/reading-time";
import { parseTaxonomy, TAXONOMY, TOP_LEVEL_DESCRIPTIONS, type TaxonomyNode } from "./taxonomy";
import { SOURCES } from "./sources";
import { HISTORY_ARTICLES } from "./articles-history";
import { SCIENCE_ARTICLES } from "./articles-science";
import { WORLD_ARTICLES } from "./articles-world";
import { EVENTS } from "./timeline";
import { EXPERIENCES, LEARNING_PATHS, SYNONYMS } from "./catalog";
import type { SeedArticle } from "./types";

type Db = PostgresJsDatabase<typeof schema>;
const {
  categories,
  sources,
  articles,
  articleCategories,
  articleSources,
  articleRelations,
  articleRevisions,
  timelineEvents,
  experiences,
  learningPaths,
  learningPathSteps,
  searchSynonyms,
} = schema;

export const SEED_ARTICLES: SeedArticle[] = [...HISTORY_ARTICLES, ...SCIENCE_ARTICLES, ...WORLD_ARTICLES];
const AUTHOR_CREDIT = "Redacción ALEXANDRIA (borrador asistido por IA)";

async function seedCategories(db: Db) {
  const roots = parseTaxonomy(TAXONOMY, slugify);
  const idByPath = new Map<string, string>();
  async function insert(node: TaxonomyNode, parentPath: string | null, depth: number, order: number) {
    const path = parentPath ? `${parentPath}/${node.slug}` : node.slug;
    const parentId = parentPath ? idByPath.get(parentPath)! : null;
    const [row] = await db
      .insert(categories)
      .values({
        slug: node.slug,
        name: node.name,
        path,
        depth,
        parentId,
        sortOrder: order,
        icon: node.icon,
        description: depth === 0 ? (TOP_LEVEL_DESCRIPTIONS[node.slug] ?? null) : null,
      })
      .onConflictDoUpdate({
        target: categories.path,
        set: { name: node.name, sortOrder: order, icon: node.icon, parentId, depth },
      })
      .returning({ id: categories.id });
    idByPath.set(path, row.id);
    for (const [i, child] of node.children.entries()) await insert(child, path, depth + 1, i);
  }
  for (const [i, root] of roots.entries()) await insert(root, null, 0, i);
  return idByPath;
}

async function seedSources(db: Db) {
  const idByKey = new Map<string, string>();
  for (const s of SOURCES) {
    const externalId = s.doi ? `doi:${s.doi.toLowerCase()}` : s.url ? s.url : `seed:${s.key}`;
    const values = {
      externalId,
      kind: s.kind,
      title: s.title,
      authors: s.authors ?? null,
      publisher: s.publisher ?? null,
      year: s.year ?? null,
      url: s.url ?? (s.doi ? `https://doi.org/${s.doi}` : null),
      doi: s.doi ?? null,
      provider: s.provider ?? null,
      license: s.license ?? null,
      reusePolicy: s.reusePolicy,
      verification: "pending" as const,
      accessedAt: null,
      ingestionMethod: "seed" as const,
      notes: "Referencia aportada durante la redacción asistida por IA. Pendiente de verificación editorial.",
    };
    const [row] = await db
      .insert(sources)
      .values(values)
      .onConflictDoUpdate({
        target: sources.externalId,
        set: { title: values.title, authors: values.authors, publisher: values.publisher, year: values.year, url: values.url },
      })
      .returning({ id: sources.id });
    idByKey.set(s.key, row.id);
  }
  return idByKey;
}

async function seedArticles(db: Db, catIds: Map<string, string>, srcIds: Map<string, string>) {
  const idBySlug = new Map<string, string>();
  for (const a of SEED_ARTICLES) {
    const categoryId = catIds.get(a.category);
    if (!categoryId) throw new Error(`Categoría inexistente «${a.category}» en el artículo ${a.slug}`);
    const content = a.content.trim();
    const values = {
      slug: a.slug,
      locale: "es",
      title: a.title,
      subtitle: a.subtitle ?? null,
      summary: a.summary,
      content,
      entityType: a.entityType,
      categoryId,
      keywords: a.keywords,
      facts: a.facts,
      difficulty: a.difficulty,
      readingMinutes: estimateReadingMinutes(content),
      status: "published" as const,
      verification: "unverified" as const,
      aiAssisted: true,
      notices: a.notices ?? [],
      authorCredit: AUTHOR_CREDIT,
    };
    const [row] = await db
      .insert(articles)
      .values({ ...values, publishedAt: new Date() })
      .onConflictDoUpdate({ target: [articles.locale, articles.slug], set: values })
      .returning({ id: articles.id });
    idBySlug.set(a.slug, row.id);

    await db.delete(articleCategories).where(eq(articleCategories.articleId, row.id));
    for (const path of a.alsoIn ?? []) {
      const cid = catIds.get(path);
      if (!cid) throw new Error(`Categoría secundaria inexistente «${path}» en ${a.slug}`);
      await db.insert(articleCategories).values({ articleId: row.id, categoryId: cid }).onConflictDoNothing();
    }

    await db.delete(articleSources).where(eq(articleSources.articleId, row.id));
    for (const [position, key] of a.sources.entries()) {
      const sid = srcIds.get(key);
      if (!sid) throw new Error(`Fuente inexistente «${key}» en ${a.slug}`);
      await db.insert(articleSources).values({ articleId: row.id, sourceId: sid, position });
    }

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(articleRevisions)
      .where(eq(articleRevisions.articleId, row.id));
    if (count === 0) {
      await db.insert(articleRevisions).values({
        articleId: row.id,
        version: 1,
        snapshot: values,
        fromStatus: null,
        toStatus: "published",
        changeNote: "Carga inicial de demostración (contenido asistido por IA, sin verificación humana).",
      });
    }
  }

  for (const a of SEED_ARTICLES) {
    for (const r of a.relations ?? []) {
      const to = idBySlug.get(r.to);
      if (!to) throw new Error(`Relación hacia artículo inexistente «${r.to}» desde ${a.slug}`);
      await db
        .insert(articleRelations)
        .values({ fromArticleId: idBySlug.get(a.slug)!, toArticleId: to, type: r.type ?? "related", description: r.description ?? null })
        .onConflictDoUpdate({
          target: [articleRelations.fromArticleId, articleRelations.toArticleId, articleRelations.type],
          set: { description: r.description ?? null },
        });
    }
  }
  return idBySlug;
}

async function seedTimeline(db: Db, artIds: Map<string, string>, srcIds: Map<string, string>) {
  for (const e of EVENTS) {
    const values = {
      slug: e.slug,
      title: e.title,
      summary: e.summary,
      startYear: e.startYear,
      endYear: e.endYear ?? null,
      precision: e.precision,
      displayDate: e.displayDate,
      uncertainty: e.uncertainty ?? null,
      era: e.era,
      region: e.region ?? null,
      theme: e.theme,
      articleId: e.article ? (artIds.get(e.article) ?? null) : null,
      sourceId: e.source ? (srcIds.get(e.source) ?? null) : null,
      status: "published" as const,
    };
    if (e.article && !values.articleId) throw new Error(`Evento ${e.slug}: artículo «${e.article}» inexistente`);
    await db.insert(timelineEvents).values(values).onConflictDoUpdate({ target: timelineEvents.slug, set: values });
  }
}

async function seedCatalog(db: Db, artIds: Map<string, string>) {
  for (const [i, x] of EXPERIENCES.entries()) {
    const values = {
      slug: x.slug,
      title: x.title,
      summary: x.summary,
      experienceType: x.experienceType,
      availability: "planned" as const,
      country: x.country,
      latitude: x.latitude,
      longitude: x.longitude,
      coordinatesApproximate: true,
      unescoId: x.unescoId,
      articleId: x.article ? (artIds.get(x.article) ?? null) : null,
      sortOrder: i,
    };
    await db.insert(experiences).values(values).onConflictDoUpdate({ target: experiences.slug, set: values });
  }

  for (const p of LEARNING_PATHS) {
    const [path] = await db
      .insert(learningPaths)
      .values({ slug: p.slug, title: p.title, description: p.description, difficulty: p.difficulty, status: "published" })
      .onConflictDoUpdate({ target: learningPaths.slug, set: { title: p.title, description: p.description, difficulty: p.difficulty } })
      .returning({ id: learningPaths.id });
    await db.delete(learningPathSteps).where(eq(learningPathSteps.pathId, path.id));
    for (const [position, s] of p.steps.entries()) {
      await db.insert(learningPathSteps).values({
        pathId: path.id,
        position,
        title: s.title,
        description: s.description,
        articleId: s.article ? (artIds.get(s.article) ?? null) : null,
      });
    }
  }

  for (const s of SYNONYMS) {
    await db.insert(searchSynonyms).values(s).onConflictDoUpdate({ target: searchSynonyms.term, set: { synonyms: s.synonyms } });
  }
}

export async function seed(db: Db) {
  const catIds = await seedCategories(db);
  const srcIds = await seedSources(db);
  const artIds = await seedArticles(db, catIds, srcIds);
  await seedTimeline(db, artIds, srcIds);
  await seedCatalog(db, artIds);
  return { categories: catIds.size, sources: srcIds.size, articles: artIds.size, events: EVENTS.length };
}

/** Ejecuta el seed completo en una transacción contra la base indicada. */
export async function runSeed(url: string) {
  const client = postgres(url, { max: 1, onnotice: () => {}, prepare: process.env.DATABASE_PREPARE !== "false" });
  try {
    const db = drizzle(client, { schema, casing: "snake_case" });
    return await db.transaction((tx) => seed(tx as unknown as Db));
  } finally {
    await client.end();
  }
}

if (process.argv[1]?.endsWith("index.ts")) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no definida");
  runSeed(url)
    .then((r) => console.log(`✓ Seed: ${r.categories} categorías, ${r.sources} fuentes, ${r.articles} artículos, ${r.events} acontecimientos`))
    .catch((err) => {
      console.error("✗ Error en el seed:", err);
      process.exitCode = 1;
    });
}

