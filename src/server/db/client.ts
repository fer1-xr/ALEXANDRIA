import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL no está definida. Copia .env.example a .env y configúrala.");
}

// Reutiliza la conexión entre recargas en desarrollo para no agotar el pool.
const globalForDb = globalThis as unknown as { __alexandriaSql?: ReturnType<typeof postgres> };
const client =
  globalForDb.__alexandriaSql ??
  postgres(url, {
    // En serverless (Vercel) conviene 1–3 conexiones por instancia.
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idle_timeout: 20,
    connect_timeout: 15,
    // Los poolers en modo transacción (Supabase :6543, PgBouncer) no admiten sentencias preparadas.
    prepare: process.env.DATABASE_PREPARE !== "false",
  });
if (process.env.NODE_ENV !== "production") globalForDb.__alexandriaSql = client;

export const db = drizzle(client, { schema, casing: "snake_case" });
export type Db = typeof db;
