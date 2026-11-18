import { NextResponse, type NextRequest } from "next/server";
import { connection } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/server/db/client";

/** «Sorpréndeme»: redirige a un artículo publicado al azar (evita repetir el actual). */
export async function GET(request: NextRequest) {
  await connection();
  const exclude = request.nextUrl.searchParams.get("excluir") ?? "";
  const [row] = await db.execute<{ slug: string }>(sql`
    SELECT slug FROM articles WHERE status = 'published' AND slug <> ${exclude} ORDER BY random() LIMIT 1`);
  const target = row ? `/articulo/${row.slug}?origen=sorpresa` : "/explorar";
  return NextResponse.redirect(new URL(target, request.url), { status: 307, headers: { "Cache-Control": "no-store" } });
}
