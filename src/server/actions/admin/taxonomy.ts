"use server";

import { updateTag } from "next/cache";
import { and, eq, like, ne, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/server/db/client";
import { categories, mediaAssets, sources, users } from "@/server/db/schema";
import { authorize } from "@/server/auth/guards";
import { audit } from "@/server/audit";
import { destroyAllSessionsForUser } from "@/server/auth/session";
import { escapeLike } from "@/server/search/query-utils";
import { categoryInputSchema, fieldErrors, mediaInputSchema, sourceInputSchema } from "@/lib/validation";
import type { FormState } from "../form-state";

const uuid = z.uuid();

/* ── Categorías ─────────────────────────────────────────────────────────── */

export async function saveCategoryAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await authorize("category:manage");
  const parsed = categoryInputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const d = parsed.data;
  const idRaw = formData.get("id");
  const id = idRaw ? uuid.parse(idRaw) : null;

  let parentPath: string | null = null;
  let depth = 0;
  if (d.parentId) {
    const [parent] = await db.select({ path: categories.path, depth: categories.depth }).from(categories).where(eq(categories.id, d.parentId)).limit(1);
    if (!parent) return { errors: { parentId: "La categoría superior no existe." } };
    parentPath = parent.path;
    depth = parent.depth + 1;
  }
  const path = parentPath ? `${parentPath}/${d.slug}` : d.slug;

  if (id) {
    const [current] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    if (!current) return { message: "La categoría ya no existe." };
    if (parentPath && (parentPath === current.path || parentPath.startsWith(`${current.path}/`))) {
      return { errors: { parentId: "Una categoría no puede colgar de sí misma ni de sus descendientes." } };
    }
    const [clash] = await db.select({ id: categories.id }).from(categories).where(and(eq(categories.path, path), ne(categories.id, id))).limit(1);
    if (clash) return { errors: { slug: "Ya existe una categoría con esa ruta." } };
    await db.transaction(async (tx) => {
      await tx.update(categories).set({ name: d.name, slug: d.slug, description: d.description, parentId: d.parentId, sortOrder: d.sortOrder, icon: d.icon, path, depth }).where(eq(categories.id, id));
      if (current.path !== path) {
        // Reescribe la ruta materializada de todos los descendientes.
        await tx
          .update(categories)
          .set({
            path: sql`${path} || substr(${categories.path}, ${current.path.length + 1})`,
            depth: sql`${categories.depth} + ${depth - current.depth}`,
          })
          .where(like(categories.path, `${escapeLike(current.path)}/%`));
      }
    });
    await audit(user.id, "category.update", "category", id, { path, previousPath: current.path });
  } else {
    const [clash] = await db.select({ id: categories.id }).from(categories).where(eq(categories.path, path)).limit(1);
    if (clash) return { errors: { slug: "Ya existe una categoría con esa ruta." } };
    const [row] = await db.insert(categories).values({ name: d.name, slug: d.slug, description: d.description, parentId: d.parentId, sortOrder: d.sortOrder, icon: d.icon, path, depth }).returning({ id: categories.id });
    await audit(user.id, "category.create", "category", row.id, { path });
  }
  updateTag("categories");
  updateTag("articles");
  return { ok: true, message: id ? "Categoría actualizada." : "Categoría creada." };
}

export async function setCategoryArchivedAction(categoryId: string, archived: boolean): Promise<{ ok: boolean; message: string }> {
  const user = await authorize("category:archive");
  const id = uuid.parse(categoryId);
  await db.update(categories).set({ archivedAt: archived ? new Date() : null }).where(eq(categories.id, id));
  await audit(user.id, archived ? "category.archive" : "category.restore", "category", id);
  updateTag("categories");
  return { ok: true, message: archived ? "Categoría archivada." : "Categoría restaurada." };
}

/* ── Fuentes ────────────────────────────────────────────────────────────── */

export async function saveSourceAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await authorize("source:manage");
  const parsed = sourceInputSchema.safeParse(Object.fromEntries(formData));
  const values = Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const d = parsed.data;
  if (d.verification === "verified" && !d.accessedAt) {
    return { errors: { accessedAt: "Para marcar una fuente como verificada, indica la fecha en que la consultaste." }, values };
  }
  const idRaw = formData.get("id");
  const externalId = d.doi ? `doi:${d.doi.toLowerCase()}` : (d.url ?? null);
  if (idRaw) {
    const id = uuid.parse(idRaw);
    await db.update(sources).set({ ...d, externalId: externalId ?? undefined }).where(eq(sources.id, id));
    await audit(user.id, "source.update", "source", id, { verification: d.verification });
  } else {
    if (externalId) {
      const [dup] = await db.select({ id: sources.id }).from(sources).where(eq(sources.externalId, externalId)).limit(1);
      if (dup) return { message: "Esta fuente ya existe (mismo DOI o URL).", values };
    }
    const [row] = await db.insert(sources).values({ ...d, externalId, ingestionMethod: "manual" }).returning({ id: sources.id });
    await audit(user.id, "source.create", "source", row.id, { title: d.title });
  }
  updateTag("articles");
  return { ok: true, message: "Fuente guardada." };
}

/* ── Multimedia ─────────────────────────────────────────────────────────── */

export async function saveMediaAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await authorize("media:manage");
  const parsed = mediaInputSchema.safeParse(Object.fromEntries(formData));
  const values = Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const d = parsed.data;
  if (d.rightsStatus === "verified" && (!d.author && !d.credit)) {
    return { errors: { credit: "Un recurso verificado debe indicar autor o créditos." }, values };
  }
  const [row] = await db.insert(mediaAssets).values({ ...d, addedById: user.id }).returning({ id: mediaAssets.id });
  await audit(user.id, "media.create", "media", row.id, { title: d.title, license: d.license, rights: d.rightsStatus });
  return { ok: true, message: "Recurso registrado." };
}

export async function setMediaRightsAction(mediaId: string, status: "pending" | "verified" | "rejected"): Promise<void> {
  const user = await authorize("media:manage");
  const id = uuid.parse(mediaId);
  await db.update(mediaAssets).set({ rightsStatus: z.enum(["pending", "verified", "rejected"]).parse(status) }).where(eq(mediaAssets.id, id));
  await audit(user.id, "media.rights", "media", id, { status });
}

/* ── Usuarios ───────────────────────────────────────────────────────────── */

export async function setUserRoleAction(userId: string, role: "registered" | "student" | "editor" | "admin"): Promise<{ ok: boolean; message: string }> {
  const actor = await authorize("user:manage");
  const id = uuid.parse(userId);
  const newRole = z.enum(["registered", "student", "editor", "admin"]).parse(role);
  if (id === actor.id && newRole !== "admin") return { ok: false, message: "No puedes retirarte el rol de administrador a ti mismo." };
  await db.update(users).set({ role: newRole }).where(eq(users.id, id));
  await audit(actor.id, "user.role", "user", id, { role: newRole });
  return { ok: true, message: "Rol actualizado." };
}

export async function setUserDisabledAction(userId: string, disabled: boolean): Promise<{ ok: boolean; message: string }> {
  const actor = await authorize("user:manage");
  const id = uuid.parse(userId);
  if (id === actor.id) return { ok: false, message: "No puedes desactivar tu propia cuenta." };
  await db.update(users).set({ disabledAt: disabled ? new Date() : null }).where(eq(users.id, id));
  if (disabled) await destroyAllSessionsForUser(id);
  await audit(actor.id, disabled ? "user.disable" : "user.enable", "user", id);
  return { ok: true, message: disabled ? "Cuenta desactivada y sesiones cerradas." : "Cuenta reactivada." };
}

