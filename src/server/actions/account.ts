"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/server/db/client";
import { userPreferences, users } from "@/server/db/schema";
import { getCurrentUser, destroyAllSessionsForUser, createSession } from "@/server/auth/session";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { rateLimit } from "@/server/auth/rate-limit";
import { changePasswordSchema, fieldErrors, preferencesSchema, profileSchema } from "@/lib/validation";
import type { FormState } from "./form-state";

async function requireSessionUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/cuenta/ingresar?next=/cuenta/perfil");
  return user;
}

export async function updateProfileAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireSessionUser();
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  await db.update(users).set(parsed.data).where(eq(users.id, user.id));
  refresh();
  return { ok: true, message: "Perfil actualizado." };
}

export async function updatePreferencesAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireSessionUser();
  const parsed = preferencesSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  await db
    .insert(userPreferences)
    .values({ userId: user.id, ...parsed.data })
    .onConflictDoUpdate({ target: userPreferences.userId, set: parsed.data });
  refresh();
  return { ok: true, message: "Preferencias guardadas." };
}

export async function changePasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireSessionUser();
  if (!rateLimit(`chpw:${user.id}`, 5, 15 * 60_000).ok) return { message: "Demasiados intentos. Espera unos minutos." };
  const parsed = changePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const [row] = await db.select({ hash: users.passwordHash }).from(users).where(eq(users.id, user.id)).limit(1);
  if (!row || !(await verifyPassword(row.hash, parsed.data.currentPassword))) {
    return { errors: { currentPassword: "La contraseña actual no es correcta." } };
  }
  await db.update(users).set({ passwordHash: await hashPassword(parsed.data.password) }).where(eq(users.id, user.id));
  await destroyAllSessionsForUser(user.id);
  await createSession(user.id);
  return { ok: true, message: "Contraseña cambiada. Se cerraron las demás sesiones abiertas." };
}

/** Elimina la cuenta y todos sus datos personales (cascada en la base de datos). */
export async function deleteAccountAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireSessionUser();
  if (formData.get("confirm") !== "ELIMINAR") return { errors: { confirm: "Escribe ELIMINAR para confirmar." } };
  const [row] = await db.select({ hash: users.passwordHash }).from(users).where(eq(users.id, user.id)).limit(1);
  if (!row || !(await verifyPassword(row.hash, String(formData.get("password") ?? "")))) {
    return { errors: { password: "Contraseña incorrecta." } };
  }
  await db.delete(users).where(eq(users.id, user.id));
  redirect("/?cuenta=eliminada");
}
