"use server";

import { refresh } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/server/db/client";
import {
  articles,
  bookmarks,
  collectionItems,
  collections,
  favorites,
  notes,
  readingHistory,
  userPreferences,
} from "@/server/db/schema";
import { authorize } from "@/server/auth/guards";
import { collectionSchema, fieldErrors, noteSchema } from "@/lib/validation";
import type { FormState } from "./form-state";

const uuid = z.uuid();

async function assertPublished(articleId: string) {
  const [a] = await db
    .select({ id: articles.id })
    .from(articles)
    .where(and(eq(articles.id, articleId), eq(articles.status, "published")))
    .limit(1);
  if (!a) throw new Error("Artículo no disponible.");
}

export async function toggleFavoriteAction(articleId: string): Promise<{ isFavorite: boolean }> {
  const user = await authorize("library:use");
  const id = uuid.parse(articleId);
  await assertPublished(id);
  const removed = await db
    .delete(favorites)
    .where(and(eq(favorites.userId, user.id), eq(favorites.articleId, id)))
    .returning({ a: favorites.articleId });
  if (removed.length === 0) await db.insert(favorites).values({ userId: user.id, articleId: id }).onConflictDoNothing();
  refresh();
  return { isFavorite: removed.length === 0 };
}

/** Registra la lectura (respeta la preferencia de no guardar historial). */
export async function recordReadingAction(articleId: string, progress: number): Promise<void> {
  const user = await authorize("library:use");
  const id = uuid.parse(articleId);
  const pct = Math.max(0, Math.min(100, Math.round(Number(progress) || 0)));
  const [prefs] = await db
    .select({ historyEnabled: userPreferences.historyEnabled })
    .from(userPreferences)
    .where(eq(userPreferences.userId, user.id))
    .limit(1);
  if (prefs && !prefs.historyEnabled) return;
  await assertPublished(id);
  await db
    .insert(readingHistory)
    .values({ userId: user.id, articleId: id, progress: pct })
    .onConflictDoUpdate({
      target: [readingHistory.userId, readingHistory.articleId],
      set: {
        lastReadAt: new Date(),
        progress: sql`GREATEST(${readingHistory.progress}, ${pct})`,
        readCount: pct === 0 ? sql`${readingHistory.readCount} + 1` : readingHistory.readCount,
      },
    });
}

export async function clearHistoryAction(): Promise<void> {
  const user = await authorize("library:use");
  await db.delete(readingHistory).where(eq(readingHistory.userId, user.id));
  refresh();
}

export async function addNoteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await authorize("library:use");
  const parsed = noteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  await assertPublished(parsed.data.articleId);
  await db.insert(notes).values({ userId: user.id, articleId: parsed.data.articleId, body: parsed.data.body });
  refresh();
  return { ok: true, message: "Nota guardada." };
}

export async function deleteNoteAction(noteId: string): Promise<void> {
  const user = await authorize("library:use");
  await db.delete(notes).where(and(eq(notes.id, uuid.parse(noteId)), eq(notes.userId, user.id)));
  refresh();
}

export async function toggleBookmarkAction(articleId: string, anchor: string, label: string): Promise<{ bookmarked: boolean }> {
  const user = await authorize("library:use");
  const id = uuid.parse(articleId);
  const safeAnchor = z.string().regex(/^[a-z0-9-]{1,200}$/).parse(anchor);
  const safeLabel = z.string().trim().min(1).max(200).parse(label);
  await assertPublished(id);
  const removed = await db
    .delete(bookmarks)
    .where(and(eq(bookmarks.userId, user.id), eq(bookmarks.articleId, id), eq(bookmarks.anchor, safeAnchor)))
    .returning({ id: bookmarks.id });
  if (!removed.length) {
    await db.insert(bookmarks).values({ userId: user.id, articleId: id, anchor: safeAnchor, label: safeLabel });
  }
  refresh();
  return { bookmarked: removed.length === 0 };
}

export async function deleteBookmarkAction(bookmarkId: string): Promise<void> {
  const user = await authorize("library:use");
  await db.delete(bookmarks).where(and(eq(bookmarks.id, uuid.parse(bookmarkId)), eq(bookmarks.userId, user.id)));
  refresh();
}

export async function createCollectionAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await authorize("library:use");
  const parsed = collectionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(collections)
    .where(eq(collections.userId, user.id));
  if (count >= 200) return { message: "Has alcanzado el máximo de 200 colecciones." };
  const [col] = await db
    .insert(collections)
    .values({ userId: user.id, name: parsed.data.name, description: parsed.data.description })
    .returning({ id: collections.id });
  const articleId = formData.get("articleId");
  if (typeof articleId === "string" && uuid.safeParse(articleId).success) {
    await assertPublished(articleId);
    await db.insert(collectionItems).values({ collectionId: col.id, articleId }).onConflictDoNothing();
  }
  refresh();
  return { ok: true, message: "Colección creada." };
}

async function ownCollection(userId: string, collectionId: string) {
  const [col] = await db
    .select({ id: collections.id })
    .from(collections)
    .where(and(eq(collections.id, uuid.parse(collectionId)), eq(collections.userId, userId)))
    .limit(1);
  if (!col) throw new Error("Colección no encontrada.");
  return col.id;
}

export async function toggleCollectionItemAction(collectionId: string, articleId: string): Promise<{ contains: boolean }> {
  const user = await authorize("library:use");
  const colId = await ownCollection(user.id, collectionId);
  const id = uuid.parse(articleId);
  const removed = await db
    .delete(collectionItems)
    .where(and(eq(collectionItems.collectionId, colId), eq(collectionItems.articleId, id)))
    .returning({ a: collectionItems.articleId });
  if (!removed.length) {
    await assertPublished(id);
    await db.insert(collectionItems).values({ collectionId: colId, articleId: id });
  }
  await db.update(collections).set({ updatedAt: new Date() }).where(eq(collections.id, colId));
  refresh();
  return { contains: removed.length === 0 };
}

export async function deleteCollectionAction(collectionId: string): Promise<void> {
  const user = await authorize("library:use");
  const colId = await ownCollection(user.id, collectionId);
  await db.delete(collections).where(eq(collections.id, colId));
  refresh();
}
