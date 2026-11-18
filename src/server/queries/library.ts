/**
 * Lecturas de la biblioteca personal. Cada función obtiene el usuario de la sesión:
 * nunca acepta un userId desde fuera, para que nadie pueda leer datos ajenos.
 */
import "server-only";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/server/db/client";
import {
  articles,
  bookmarks,
  categories,
  collectionItems,
  collections,
  favorites,
  learningPathSteps,
  learningPaths,
  notes,
  readingHistory,
  userPreferences,
} from "@/server/db/schema";
import { getCurrentUser } from "@/server/auth/session";

const card = {
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

async function userId() {
  const user = await getCurrentUser();
  return user?.id ?? null;
}

export async function getRecentHistory(limit = 6) {
  const uid = await userId();
  if (!uid) return null;
  return db
    .select({ ...card, lastReadAt: readingHistory.lastReadAt, progress: readingHistory.progress, readCount: readingHistory.readCount })
    .from(readingHistory)
    .innerJoin(articles, eq(articles.id, readingHistory.articleId))
    .innerJoin(categories, eq(categories.id, articles.categoryId))
    .where(and(eq(readingHistory.userId, uid), eq(articles.status, "published")))
    .orderBy(desc(readingHistory.lastReadAt))
    .limit(limit);
}

export async function getFavorites() {
  const uid = await userId();
  if (!uid) return [];
  return db
    .select({ ...card, favoritedAt: favorites.createdAt })
    .from(favorites)
    .innerJoin(articles, eq(articles.id, favorites.articleId))
    .innerJoin(categories, eq(categories.id, articles.categoryId))
    .where(and(eq(favorites.userId, uid), eq(articles.status, "published")))
    .orderBy(desc(favorites.createdAt));
}

export async function getCollectionsWithCounts() {
  const uid = await userId();
  if (!uid) return [];
  return db
    .select({
      id: collections.id,
      name: collections.name,
      description: collections.description,
      updatedAt: collections.updatedAt,
      itemCount: sql<number>`(SELECT count(*)::int FROM collection_items ci WHERE ci.collection_id = ${collections.id})`,
    })
    .from(collections)
    .where(eq(collections.userId, uid))
    .orderBy(desc(collections.updatedAt));
}

export async function getCollection(id: string) {
  const uid = await userId();
  if (!uid) return null;
  const [col] = await db
    .select()
    .from(collections)
    .where(and(eq(collections.id, id), eq(collections.userId, uid)))
    .limit(1);
  if (!col) return null;
  const items = await db
    .select({ ...card, addedAt: collectionItems.addedAt })
    .from(collectionItems)
    .innerJoin(articles, eq(articles.id, collectionItems.articleId))
    .innerJoin(categories, eq(categories.id, articles.categoryId))
    .where(and(eq(collectionItems.collectionId, col.id), eq(articles.status, "published")))
    .orderBy(desc(collectionItems.addedAt));
  return { ...col, items };
}

export async function getAllNotes() {
  const uid = await userId();
  if (!uid) return [];
  return db
    .select({
      id: notes.id,
      body: notes.body,
      updatedAt: notes.updatedAt,
      articleSlug: articles.slug,
      articleTitle: articles.title,
    })
    .from(notes)
    .innerJoin(articles, eq(articles.id, notes.articleId))
    .where(eq(notes.userId, uid))
    .orderBy(desc(notes.updatedAt));
}

export async function getAllBookmarks() {
  const uid = await userId();
  if (!uid) return [];
  return db
    .select({
      id: bookmarks.id,
      anchor: bookmarks.anchor,
      label: bookmarks.label,
      createdAt: bookmarks.createdAt,
      articleSlug: articles.slug,
      articleTitle: articles.title,
    })
    .from(bookmarks)
    .innerJoin(articles, eq(articles.id, bookmarks.articleId))
    .where(eq(bookmarks.userId, uid))
    .orderBy(desc(bookmarks.createdAt));
}

/** Estado personal de un artículo (favorito, notas, marcadores, colecciones). */
export async function getArticleUserState(articleId: string) {
  const user = await getCurrentUser();
  if (!user) return null;
  const [fav, myNotes, myBookmarks, myCollections, prefs] = await Promise.all([
    db
      .select({ a: favorites.articleId })
      .from(favorites)
      .where(and(eq(favorites.userId, user.id), eq(favorites.articleId, articleId)))
      .limit(1),
    db
      .select({ id: notes.id, body: notes.body, updatedAt: notes.updatedAt })
      .from(notes)
      .where(and(eq(notes.userId, user.id), eq(notes.articleId, articleId)))
      .orderBy(desc(notes.updatedAt)),
    db
      .select({ id: bookmarks.id, anchor: bookmarks.anchor, label: bookmarks.label })
      .from(bookmarks)
      .where(and(eq(bookmarks.userId, user.id), eq(bookmarks.articleId, articleId)))
      .orderBy(asc(bookmarks.createdAt)),
    db
      .select({
        id: collections.id,
        name: collections.name,
        contains: sql<boolean>`EXISTS (SELECT 1 FROM collection_items ci WHERE ci.collection_id = ${collections.id} AND ci.article_id = ${articleId})`,
      })
      .from(collections)
      .where(eq(collections.userId, user.id))
      .orderBy(asc(collections.name)),
    db.select({ historyEnabled: userPreferences.historyEnabled }).from(userPreferences).where(eq(userPreferences.userId, user.id)).limit(1),
  ]);
  return {
    user: { id: user.id, displayName: user.displayName },
    isFavorite: fav.length > 0,
    notes: myNotes,
    bookmarks: myBookmarks,
    collections: myCollections,
    historyEnabled: prefs[0]?.historyEnabled ?? true,
  };
}

export async function getPreferences() {
  const user = await getCurrentUser();
  if (!user) return null;
  const [prefs] = await db.select().from(userPreferences).where(eq(userPreferences.userId, user.id)).limit(1);
  return (
    prefs ?? {
      userId: user.id,
      theme: "system" as const,
      fontScale: 100,
      readingLevel: "intermediate" as const,
      historyEnabled: true,
      analyticsConsent: false,
      updatedAt: new Date(),
    }
  );
}

/** Progreso por ruta: pasos con artículo leído / pasos con artículo publicado. */
export async function getPathProgress() {
  const uid = await userId();
  if (!uid) return [];
  const rows = await db
    .select({
      pathId: learningPaths.id,
      slug: learningPaths.slug,
      title: learningPaths.title,
      articleId: learningPathSteps.articleId,
      read: sql<boolean>`EXISTS (SELECT 1 FROM reading_history rh WHERE rh.user_id = ${uid} AND rh.article_id = ${learningPathSteps.articleId})`,
    })
    .from(learningPaths)
    .innerJoin(learningPathSteps, eq(learningPathSteps.pathId, learningPaths.id))
    .where(eq(learningPaths.status, "published"));
  const byPath = new Map<string, { slug: string; title: string; total: number; done: number }>();
  for (const r of rows) {
    const p = byPath.get(r.pathId) ?? { slug: r.slug, title: r.title, total: 0, done: 0 };
    if (r.articleId) {
      p.total++;
      if (r.read) p.done++;
    }
    byPath.set(r.pathId, p);
  }
  return [...byPath.values()];
}

/** Ids de artículos leídos por el usuario dentro de un conjunto (para marcar pasos de rutas). */
export async function getReadArticleIds(articleIds: string[]) {
  const uid = await userId();
  if (!uid || !articleIds.length) return new Set<string>();
  const rows = await db
    .select({ id: readingHistory.articleId })
    .from(readingHistory)
    .where(and(eq(readingHistory.userId, uid), inArray(readingHistory.articleId, articleIds)));
  return new Set(rows.map((r) => r.id));
}

/**
 * Recomendaciones personales: artículos conectados en el grafo con lo leído o de las
 * mismas ramas principales, excluyendo lo ya leído. Sin historial, devuelve [].
 */
export async function getRecommendationsForUser(limit = 6) {
  const uid = await userId();
  if (!uid) return [];
  const rows = await db.execute<{
    id: string; slug: string; title: string; subtitle: string | null; summary: string;
    entity_type: string; reading_minutes: number; category_name: string; category_path: string; score: number;
  }>(sql`
    WITH read AS (SELECT article_id FROM reading_history WHERE user_id = ${uid}),
    branches AS (
      SELECT split_part(c.path, '/', 1) AS b, count(*) AS n
      FROM read r JOIN articles a ON a.id = r.article_id JOIN categories c ON c.id = a.category_id GROUP BY 1
    ),
    linked AS (
      SELECT to_article_id AS id FROM article_relations WHERE from_article_id IN (SELECT article_id FROM read)
      UNION ALL
      SELECT from_article_id FROM article_relations WHERE to_article_id IN (SELECT article_id FROM read)
    )
    SELECT a.id, a.slug, a.title, a.subtitle, a.summary, a.entity_type, a.reading_minutes,
           c.name AS category_name, c.path AS category_path,
           (coalesce((SELECT count(*) FROM linked l WHERE l.id = a.id), 0) * 3
             + coalesce((SELECT n FROM branches WHERE b = split_part(c.path, '/', 1)), 0))::float AS score
    FROM articles a JOIN categories c ON c.id = a.category_id
    WHERE a.status = 'published' AND a.id NOT IN (SELECT article_id FROM read)
    ORDER BY score DESC, a.published_at DESC
    LIMIT ${limit}`);
  if (!rows.length || rows[0].score === 0) return [];
  return rows.map((r) => ({
    id: r.id, slug: r.slug, title: r.title, subtitle: r.subtitle, summary: r.summary,
    entityType: r.entity_type as (typeof articles.$inferSelect)["entityType"],
    readingMinutes: r.reading_minutes, categoryName: r.category_name, categoryPath: r.category_path,
  }));
}
