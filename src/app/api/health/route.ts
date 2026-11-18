import { connection } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/server/db/client";

/** Comprobación de salud para balanceadores y monitorización. */
export async function GET() {
  await connection();
  try {
    await db.execute(sql`SELECT 1`);
    return Response.json({ status: "ok", database: "ok" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ status: "degraded", database: "unreachable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
