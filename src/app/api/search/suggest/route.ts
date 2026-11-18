import { NextResponse, type NextRequest } from "next/server";
import { suggest } from "@/server/search/search";
import { rateLimit } from "@/server/auth/rate-limit";

/** Autocompletado del buscador universal. GET /api/search/suggest?q=… */
export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").slice(0, 100);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const limit = rateLimit(`suggest:${ip}`, 120, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }
  try {
    const suggestions = await suggest(q);
    return NextResponse.json({ suggestions }, { headers: { "Cache-Control": "public, max-age=60" } });
  } catch (err) {
    console.error("[suggest]", err);
    return NextResponse.json({ suggestions: [], error: "No se pudieron obtener sugerencias" }, { status: 500 });
  }
}
