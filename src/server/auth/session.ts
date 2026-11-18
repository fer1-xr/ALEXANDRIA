import "server-only";
import { cookies, headers } from "next/headers";
import { connection } from "next/server";
import { cache } from "react";
import { and, eq, gt, isNull, lt, sql } from "drizzle-orm";
import { db } from "@/server/db/client";
import { sessions, users, type UserRole } from "@/server/db/schema";
import { generateToken, hashToken } from "./tokens";

/** Duración fija de la sesión. La caducidad se compara en SQL (now()), no con la hora del renderizado. */
const SESSION_DAYS = 30;
const DAY = 24 * 60 * 60 * 1000;

/** En producción se usa el prefijo __Host- (exige Secure, Path=/ y sin Domain). */
export const SESSION_COOKIE =
  process.env.NODE_ENV === "production" ? "__Host-alexandria_session" : "alexandria_session";

export type SessionUser = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  plan: "free" | "premium";
  locale: string;
};

export async function createSession(userId: string): Promise<void> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * DAY);
  const userAgent = (await headers()).get("user-agent")?.slice(0, 300) ?? null;
  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt, userAgent });
  await setSessionCookie(token, expiresAt);
}

async function setSessionCookie(token: string, expiresAt: Date) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Valida el token de la cookie (sesión existente, no caducada y usuario activo). */
export async function validateSessionToken(token: string): Promise<SessionUser | null> {
  const id = hashToken(token);
  const [row] = await db
    .select({
      expiresAt: sessions.expiresAt,
      user: {
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        role: users.role,
        plan: users.plan,
        locale: users.locale,
      },
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, id), gt(sessions.expiresAt, sql`now()`), isNull(users.disabledAt)))
    .limit(1);
  return row?.user ?? null;
}

/** Usuario de la petición actual (deduplicado por petición). Lee cookies: usar dentro de <Suspense>. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  // Todo lo que depende de la sesión se resuelve en la petición, nunca en un prerender.
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return validateSessionToken(token);
});

export async function destroyCurrentSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  store.delete(SESSION_COOKIE);
}

export async function destroyAllSessionsForUser(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

export async function purgeExpiredSessions(): Promise<void> {
  await db.delete(sessions).where(lt(sessions.expiresAt, sql`now()`));
}
