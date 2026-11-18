"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { and, eq, ne, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/server/db/client";
import { articleCategories, articleRelations, articleRevisions, articleSources, articles, categories, type EditorialStatus } from "@/server/db/schema";
import { authorize } from "@/server/auth/guards";
import { audit } from "@/server/audit";
import { checkTransition } from "@/server/editorial/workflow";
import { renderMarkdown } from "@/server/content/markdown";
import { estimateReadingMinutes } from "@/lib/reading-time";
import { articleInputSchema, fieldErrors } from "@/lib/validation";
import type { FormState } from "../form-state";

const uuid = z.uuid();

function invalidate(slug?: string) {
  updateTag("articles");
  updateTag("categories");
  updateTag("timeline");
  updateTag("experiences");
  updateTag("paths");
  if (slug) updateTag(`article:${slug}`);
}

async function nextVersion(articleId: string) {
  const [r] = await db
    .select({ v: sql<number>`coalesce(max(${articleRevisions.version}), 0)::int` })
    .from(articleRevisions)
    .where(eq(articleRevisions.articleId, articleId));
  return r.v + 1;
}

function parseArticleForm(formData: FormData) {
  return articleInputSchema.safeParse({
    ...Object.fromEntries(formData),
    notices: formData.getAll("notices"),
    sourceIds: formData.getAll("sourceIds"),
  });
}

/** Crea o actualiza un artículo. Cada guardado genera una revisión con instantánea. */
export async function saveArticleAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const idRaw = formData.get("id");
  const isNew = !idRaw;
  const user = await authorize(isNew ? "article:create" : "article:edit");
  const parsed = parseArticleForm(formData);
  const values = Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
  if (!parsed.success) return { errors: fieldErrors(parsed.error), message: "Revisa los campos marcados.", values };
  const d = parsed.data;

  const [cat] = await db.select({ id: categories.id }).from(categories).where(eq(categories.id, d.categoryId)).limit(1);
  if (!cat) return { errors: { categoryId: "La categoría no existe." }, values };

  const id = isNew ? null : uuid.parse(idRaw);
  const [clash] = await db
    .select({ id: articles.id })
    .from(articles)
    .where(and(eq(articles.locale, d.locale), eq(articles.slug, d.slug), id ? ne(articles.id, id) : undefined))
    .limit(1);
  if (clash) return { errors: { slug: "Ya existe otro artículo con este slug en este idioma." }, values };

  const data = {
    title: d.title,
    subtitle: d.subtitle,
    slug: d.slug,
    summary: d.summary,
    content: d.content,
    categoryId: d.categoryId,
    entityType: d.entityType,
    difficulty: d.difficulty,
    keywords: d.keywords,
    facts: d.facts,
    notices: d.notices,
    aiAssisted: d.aiAssisted,
    authorCredit: d.authorCredit,
    locale: d.locale,
    readingMinutes: estimateReadingMinutes(d.content),
  };

  let articleId: string;
  let previousSlug: string | undefined;
  let note = d.changeNote;
  if (isNew) {
    const [row] = await db.insert(articles).values({ ...data, status: "draft", authorId: user.id }).returning({ id: articles.id });
    articleId = row.id;
    await db.insert(articleRevisions).values({ articleId, version: 1, snapshot: data, fromStatus: null, toStatus: "draft", changeNote: note ?? "Creación", changedById: user.id });
    await audit(user.id, "article.create", "article", articleId, { title: d.title });
  } else {
    const [current] = await db.select().from(articles).where(eq(articles.id, id!)).limit(1);
    if (!current) return { message: "El artículo ya no existe." };
    previousSlug = current.slug;
    articleId = current.id;
    // Si cambia el contenido de un artículo verificado, la verificación deja de ser válida.
    const contentChanged = current.content !== d.content || current.summary !== d.summary || current.title !== d.title;
    const resetVerification = contentChanged && current.verification !== "unverified";
    await db
      .update(articles)
      .set({ ...data, ...(resetVerification ? { verification: "unverified" as const, reviewedAt: null, reviewedById: null } : {}) })
      .where(eq(articles.id, articleId));
    if (resetVerification) note = `${note ?? "Edición"} (la verificación humana se restableció por cambios de contenido)`;
    await db.insert(articleRevisions).values({
      articleId, version: await nextVersion(articleId), snapshot: data, fromStatus: current.status, toStatus: current.status, changeNote: note ?? "Edición", changedById: user.id,
    });
    await audit(user.id, "article.update", "article", articleId, { title: d.title, resetVerification });
  }

  await db.delete(articleSources).where(eq(articleSources.articleId, articleId));
  for (const [position, sourceId] of d.sourceIds.entries()) {
    await db.insert(articleSources).values({ articleId, sourceId, position }).onConflictDoNothing();
  }
  const secondary = formData.getAll("secondaryCategoryIds").map(String).filter((v) => uuid.safeParse(v).success && v !== d.categoryId);
  await db.delete(articleCategories).where(eq(articleCategories.articleId, articleId));
  for (const categoryId of secondary) await db.insert(articleCategories).values({ articleId, categoryId }).onConflictDoNothing();

  invalidate(d.slug);
  if (previousSlug && previousSlug !== d.slug) updateTag(`article:${previousSlug}`);
  if (isNew) redirect(`/admin/articulos/${articleId}?creado=1`);
  return { ok: true, message: "Cambios guardados." };
}

export async function transitionArticleAction(articleId: string, to: EditorialStatus, note?: string): Promise<{ ok: boolean; message: string }> {
  const user = await authorize("admin:access");
  const id = uuid.parse(articleId);
  const [a] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  if (!a) return { ok: false, message: "El artículo no existe." };
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(articleSources).where(eq(articleSources.articleId, id));
  const check = checkTransition(user.role, a.status, to, {
    sourceCount: count, summary: a.summary, content: a.content, notices: a.notices, reviewedAt: a.reviewedAt,
  });
  if (!check.ok) return { ok: false, message: check.reason };

  await db
    .update(articles)
    .set({ status: to, ...(to === "published" && !a.publishedAt ? { publishedAt: new Date() } : {}) })
    .where(eq(articles.id, id));
  await db.insert(articleRevisions).values({
    articleId: id, version: await nextVersion(id), snapshot: { status: to }, fromStatus: a.status, toStatus: to,
    changeNote: note?.slice(0, 500) || `Cambio de estado: ${a.status} → ${to}`, changedById: user.id,
  });
  await audit(user.id, "article.transition", "article", id, { from: a.status, to });
  invalidate(a.slug);
  return { ok: true, message: "Estado actualizado." };
}

/** Marca el artículo como revisado por personas (o verificado por especialista). */
export async function verifyArticleAction(articleId: string, level: "editor_reviewed" | "expert_verified" | "unverified"): Promise<{ ok: boolean; message: string }> {
  const user = await authorize("article:verify");
  const id = uuid.parse(articleId);
  const lvl = z.enum(["editor_reviewed", "expert_verified", "unverified"]).parse(level);
  const [a] = await db.select({ slug: articles.slug }).from(articles).where(eq(articles.id, id)).limit(1);
  if (!a) return { ok: false, message: "El artículo no existe." };
  await db
    .update(articles)
    .set(lvl === "unverified" ? { verification: lvl, reviewedAt: null, reviewedById: null } : { verification: lvl, reviewedAt: new Date(), reviewedById: user.id })
    .where(eq(articles.id, id));
  await audit(user.id, "article.verify", "article", id, { level: lvl });
  invalidate(a.slug);
  return { ok: true, message: "Verificación actualizada." };
}

const relationSchema = z.object({
  fromId: z.uuid(),
  toId: z.uuid(),
  type: z.enum(["related", "part_of", "located_in", "influenced", "preceded", "contemporary_of", "created_by", "participated_in", "studied_by", "example_of", "contrasts_with"]),
  description: z.string().trim().max(500).optional(),
});

export async function addRelationAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await authorize("article:edit");
  const parsed = relationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { message: "Relación no válida." };
  const r = parsed.data;
  if (r.fromId === r.toId) return { message: "Un artículo no puede relacionarse consigo mismo." };
  await db
    .insert(articleRelations)
    .values({ fromArticleId: r.fromId, toArticleId: r.toId, type: r.type, description: r.description || null, createdById: user.id })
    .onConflictDoUpdate({
      target: [articleRelations.fromArticleId, articleRelations.toArticleId, articleRelations.type],
      set: { description: r.description || null },
    });
  await audit(user.id, "relation.add", "article", r.fromId, { to: r.toId, type: r.type });
  invalidate();
  return { ok: true, message: "Relación guardada." };
}

export async function removeRelationAction(relationId: string): Promise<void> {
  const user = await authorize("article:edit");
  const id = uuid.parse(relationId);
  const [r] = await db.delete(articleRelations).where(eq(articleRelations.id, id)).returning({ from: articleRelations.fromArticleId });
  if (r) await audit(user.id, "relation.remove", "article", r.from, { relationId: id });
  invalidate();
}

export async function previewMarkdownAction(markdown: string): Promise<string> {
  await authorize("article:edit");
  return (await renderMarkdown(String(markdown).slice(0, 200_000))).html;
}
