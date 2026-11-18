/** Lecturas del panel de administración (sin caché: el CMS siempre ve el estado actual). */
import "server-only";
import { and, asc, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/server/db/client";
import {
  articleRelations,
  articleRevisions,
  articleSources,
  articles,
  auditLog,
  categories,
  experiences,
  mediaAssets,
  sources,
  timelineEvents,
  users,
  type EditorialStatus,
} from "@/server/db/schema";
import { escapeLike } from "@/server/search/query-utils";

export async function getDashboardStats() {
  const [row] = await db.execute<{
    draft: number; in_review: number; approved: number; published: number; archived: number;
    unverified: number; sources_pending: number; media_pending: number; users: number;
  }>(sql`
    SELECT
      count(*) FILTER (WHERE status = 'draft')::int AS draft,
      count(*) FILTER (WHERE status = 'in_review')::int AS in_review,
      count(*) FILTER (WHERE status = 'approved')::int AS approved,
      count(*) FILTER (WHERE status = 'published')::int AS published,
      count(*) FILTER (WHERE status = 'archived')::int AS archived,
      count(*) FILTER (WHERE status = 'published' AND verification = 'unverified')::int AS unverified,
      (SELECT count(*)::int FROM sources WHERE verification = 'pending') AS sources_pending,
      (SELECT count(*)::int FROM media_assets WHERE rights_status = 'pending') AS media_pending,
      (SELECT count(*)::int FROM users) AS users
    FROM articles`);
  return row;
}

export async function listArticlesForAdmin(filter: { q?: string; status?: EditorialStatus; page?: number }) {
  const pageSize = 30;
  const conds: SQL[] = [];
  if (filter.status) conds.push(eq(articles.status, filter.status));
  if (filter.q) {
    const like = `%${escapeLike(filter.q)}%`;
    conds.push(or(ilike(articles.title, like), ilike(articles.slug, like))!);
  }
  const where = conds.length ? and(...conds) : undefined;
  const rows = await db
    .select({
      id: articles.id, slug: articles.slug, title: articles.title, status: articles.status,
      verification: articles.verification, aiAssisted: articles.aiAssisted, updatedAt: articles.updatedAt,
      locale: articles.locale, categoryName: categories.name,
      sourceCount: sql<number>`(SELECT count(*)::int FROM article_sources s WHERE s.article_id = ${articles.id})`,
    })
    .from(articles)
    .innerJoin(categories, eq(categories.id, articles.categoryId))
    .where(where)
    .orderBy(desc(articles.updatedAt))
    .limit(pageSize)
    .offset(((filter.page ?? 1) - 1) * pageSize);
  const [{ total }] = await db.select({ total: sql<number>`count(*)::int` }).from(articles).where(where);
  return { rows, total, pageSize };
}

export async function getArticleForEdit(id: string) {
  const [a] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  if (!a) return null;
  const [srcs, relations, revisions] = await Promise.all([
    db.select({ sourceId: articleSources.sourceId }).from(articleSources).where(eq(articleSources.articleId, id)).orderBy(asc(articleSources.position)),
    db
      .select({ id: articleRelations.id, type: articleRelations.type, description: articleRelations.description, toTitle: articles.title, toSlug: articles.slug })
      .from(articleRelations)
      .innerJoin(articles, eq(articles.id, articleRelations.toArticleId))
      .where(eq(articleRelations.fromArticleId, id)),
    db
      .select({
        id: articleRevisions.id, version: articleRevisions.version, fromStatus: articleRevisions.fromStatus, toStatus: articleRevisions.toStatus,
        changeNote: articleRevisions.changeNote, createdAt: articleRevisions.createdAt, author: users.displayName,
      })
      .from(articleRevisions)
      .leftJoin(users, eq(users.id, articleRevisions.changedById))
      .where(eq(articleRevisions.articleId, id))
      .orderBy(desc(articleRevisions.version))
      .limit(30),
  ]);
  return { ...a, sourceIds: srcs.map((s) => s.sourceId), relations, revisions };
}

export async function getCategoryOptions() {
  return db
    .select({ id: categories.id, name: categories.name, path: categories.path, depth: categories.depth, parentId: categories.parentId, archivedAt: categories.archivedAt, sortOrder: categories.sortOrder, slug: categories.slug, description: categories.description, icon: categories.icon })
    .from(categories)
    .orderBy(asc(categories.path));
}

export async function getSourceOptions() {
  return db
    .select({ id: sources.id, title: sources.title, authors: sources.authors, year: sources.year, verification: sources.verification })
    .from(sources)
    .orderBy(asc(sources.title));
}

export async function getArticleOptions() {
  return db.select({ id: articles.id, title: articles.title, slug: articles.slug }).from(articles).orderBy(asc(articles.title));
}

export async function listSources() {
  return db
    .select({
      source: sources,
      usage: sql<number>`(SELECT count(*)::int FROM article_sources a WHERE a.source_id = ${sources.id})`,
    })
    .from(sources)
    .orderBy(asc(sources.verification), asc(sources.title));
}

export async function getSource(id: string) {
  const [s] = await db.select().from(sources).where(eq(sources.id, id)).limit(1);
  return s ?? null;
}

export async function listMedia() {
  return db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)).limit(200);
}

export async function listUsers(q?: string) {
  return db
    .select({ id: users.id, email: users.email, displayName: users.displayName, role: users.role, plan: users.plan, createdAt: users.createdAt, lastLoginAt: users.lastLoginAt, disabledAt: users.disabledAt })
    .from(users)
    .where(q ? or(ilike(users.email, `%${escapeLike(q)}%`), ilike(users.displayName, `%${escapeLike(q)}%`)) : undefined)
    .orderBy(desc(users.createdAt))
    .limit(200);
}

export async function listAudit(limit = 100) {
  return db
    .select({ id: auditLog.id, action: auditLog.action, entityType: auditLog.entityType, entityId: auditLog.entityId, details: auditLog.details, createdAt: auditLog.createdAt, actor: users.displayName })
    .from(auditLog)
    .leftJoin(users, eq(users.id, auditLog.actorId))
    .orderBy(desc(auditLog.createdAt))
    .limit(limit);
}

export async function listExperiencesAdmin() {
  return db
    .select({ x: experiences, articleTitle: articles.title })
    .from(experiences)
    .leftJoin(articles, eq(articles.id, experiences.articleId))
    .orderBy(asc(experiences.sortOrder));
}

export async function countTimeline() {
  const [r] = await db.select({ n: sql<number>`count(*)::int` }).from(timelineEvents);
  return r.n;
}
