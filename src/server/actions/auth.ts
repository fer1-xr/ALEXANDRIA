"use server";

import { redirect } from "next/navigation";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { db } from "@/server/db/client";
import { passwordResetTokens, userPreferences, users } from "@/server/db/schema";
import { burnPasswordCheck, hashPassword, verifyPassword } from "@/server/auth/password";
import { createSession, destroyAllSessionsForUser, destroyCurrentSession } from "@/server/auth/session";
import { generateToken, hashToken } from "@/server/auth/tokens";
import { rateLimit } from "@/server/auth/rate-limit";
import { clientIp } from "@/server/request";
import { sendMail } from "@/server/mail/mailer";
import {
  fieldErrors,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  resetRequestSchema,
} from "@/lib/validation";
import type { FormState } from "./form-state";

const MINUTE = 60_000;

/** Solo se permiten redirecciones internas tras iniciar sesión (evita open redirects). */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/mi-biblioteca";
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const ip = await clientIp();
  const limit = rateLimit(`register:${ip}`, 5, 60 * MINUTE);
  if (!limit.ok) return { message: `Demasiados intentos. Vuelve a intentarlo en ${Math.ceil(limit.retryAfterSeconds / 60)} min.` };

  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  const values = { displayName: String(formData.get("displayName") ?? ""), email: String(formData.get("email") ?? "") };
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const { email, password, displayName } = parsed.data;

  const [existing] = await db.select({ id: users.id }).from(users).where(sql`lower(${users.email}) = ${email}`).limit(1);
  if (existing) {
    return { errors: { email: "Ya existe una cuenta con este correo. ¿Quieres iniciar sesión?" }, values };
  }
  const passwordHash = await hashPassword(password);
  const [user] = await db.insert(users).values({ email, displayName, passwordHash }).returning({ id: users.id });
  await db.insert(userPreferences).values({ userId: user.id }).onConflictDoNothing();
  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const ip = await clientIp();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const byIp = rateLimit(`login-ip:${ip}`, 20, 15 * MINUTE);
  const byAccount = rateLimit(`login-acct:${email}`, 8, 15 * MINUTE);
  if (!byIp.ok || !byAccount.ok) {
    return { message: "Demasiados intentos de inicio de sesión. Espera unos minutos.", values: { email } };
  }

  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values: { email } };

  const [user] = await db
    .select({ id: users.id, passwordHash: users.passwordHash, disabledAt: users.disabledAt })
    .from(users)
    .where(sql`lower(${users.email}) = ${parsed.data.email}`)
    .limit(1);

  if (!user) {
    await burnPasswordCheck(parsed.data.password);
    return { message: "Correo o contraseña incorrectos.", values: { email } };
  }
  const valid = await verifyPassword(user.passwordHash, parsed.data.password);
  if (!valid || user.disabledAt) return { message: "Correo o contraseña incorrectos.", values: { email } };

  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function logoutAction(): Promise<void> {
  await destroyCurrentSession();
  redirect("/");
}

const RESET_TTL_MINUTES = 60;

export async function requestPasswordResetAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const ip = await clientIp();
  const limit = rateLimit(`reset:${ip}`, 5, 60 * MINUTE);
  if (!limit.ok) return { message: "Demasiadas solicitudes. Inténtalo más tarde." };

  const parsed = resetRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  // La respuesta es idéntica exista o no la cuenta (no revela qué correos están registrados).
  const generic: FormState = {
    ok: true,
    message: "Si existe una cuenta con ese correo, recibirás un enlace para restablecer la contraseña. Caduca en 60 minutos.",
  };
  const [user] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(and(sql`lower(${users.email}) = ${parsed.data.email}`, isNull(users.disabledAt)))
    .limit(1);
  if (!user) return generic;

  const token = generateToken();
  await db.insert(passwordResetTokens).values({
    id: hashToken(token),
    userId: user.id,
    expiresAt: new Date(Date.now() + RESET_TTL_MINUTES * MINUTE),
  });
  const url = `${process.env.APP_URL ?? "http://localhost:3000"}/cuenta/restablecer?token=${encodeURIComponent(token)}`;
  const sent = await sendMail({
    to: user.email,
    subject: "Restablece tu contraseña de ALEXANDRIA",
    text: `Hemos recibido una solicitud para restablecer tu contraseña.\n\nAbre este enlace (válido durante ${RESET_TTL_MINUTES} minutos):\n${url}\n\nSi no fuiste tú, ignora este mensaje: tu contraseña no cambiará.`,
  });
  if (!sent) {
    return { message: "No pudimos enviar el correo en este momento. Inténtalo más tarde o contacta con el equipo." };
  }
  return generic;
}

export async function resetPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const id = hashToken(parsed.data.token);
  const [row] = await db
    .select({ userId: passwordResetTokens.userId })
    .from(passwordResetTokens)
    .where(and(eq(passwordResetTokens.id, id), isNull(passwordResetTokens.usedAt), gt(passwordResetTokens.expiresAt, new Date())))
    .limit(1);
  if (!row) return { message: "El enlace no es válido o ha caducado. Solicita uno nuevo." };

  const passwordHash = await hashPassword(parsed.data.password);
  await db.transaction(async (tx) => {
    await tx.update(users).set({ passwordHash }).where(eq(users.id, row.userId));
    await tx.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.userId, row.userId));
  });
  // Cierra todas las sesiones abiertas: si alguien tenía acceso, lo pierde.
  await destroyAllSessionsForUser(row.userId);
  await createSession(row.userId);
  redirect("/mi-biblioteca?bienvenida=contrasena");
}
