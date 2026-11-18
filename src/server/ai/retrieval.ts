import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/server/db/client";
import { articleSources, articles, sources } from "@/server/db/schema";
import { searchLibrary } from "@/server/search/search";
import { splitIntoPassages } from "./chunking";
import { HL_START, HL_STOP, highlightToHtml } from "@/server/search/query-utils";

export type RetrievedPassage = {
  articleSlug: string;
  articleTitle: string;
  heading: string | null;
  anchor: string | null;
  excerptHtml: string;
  score: number;
  verification: string;
  aiAssisted: boolean;
};

export type RetrievalResult = {
  passages: RetrievedPassage[];
  sources: { id: string; title: string; authors: string | null; year: number | null; url: string | null; verification: string; usedBy: string[] }[];
  sufficient: boolean;
};

/**
 * Recuperación de pasajes (primera etapa del futuro RAG):
 *  1. búsqueda híbrida de artículos (texto completo + trigramas + sinónimos);
 *  2. división en secciones;
 *  3. puntuación de cada sección con ts_rank_cd en PostgreSQL.
 * La Fase 4 añadirá embeddings (pgvector), reranking y generación con citas.
 */
export async function retrievePassages(question: string, maxPassages = 5): Promise<RetrievalResult> {
  "use cache";
  cacheLife("minutes");
  cacheTag("articles");

  const search = await searchLibrary({ q: question });
  const ids = search.hits.slice(0, 6).map((h) => h.id);
  if (!ids.length) return { passages: [], sources: [], sufficient: false };

  const docs = await db
    .select({
      id: articles.id, slug: articles.slug, title: articles.title, summary: articles.summary, content: articles.content,
      verification: articles.verification, aiAssisted: articles.aiAssisted,
    })
    .from(articles)
    .where(and(inArray(articles.id, ids), eq(articles.status, "published")));

  const candidates = docs.flatMap((d) =>
    splitIntoPassages(d.summary, d.content).map((p) => ({ doc: d, ...p })),
  );
  if (!candidates.length) return { passages: [], sources: [], sufficient: false };

  const texts = candidates.map((c) => c.text);
  const scored = await db.execute<{ idx: number; score: number; excerpt: string }>(sql`
    WITH q AS (
      SELECT nullif(replace(plainto_tsquery('es_unaccent', ${question})::text, '&', '|'), '')::tsquery AS q
    )
    SELECT (t.ord - 1)::int AS idx,
           ts_rank_cd(to_tsvector('es_unaccent', t.txt), q.q, 32)::float AS score,
           ts_headline('es_unaccent', t.txt, q.q, ${`StartSel=${HL_START},StopSel=${HL_STOP},MaxWords=55,MinWords=30,MaxFragments=1`}) AS excerpt
    FROM unnest(${sql.param(texts)}::text[]) WITH ORDINALITY AS t(txt, ord), q
    WHERE q.q IS NOT NULL AND to_tsvector('es_unaccent', t.txt) @@ q.q
    ORDER BY score DESC
    LIMIT ${maxPassages}`);

  const passages = scored.map((s) => {
    const c = candidates[s.idx];
    return {
      articleSlug: c.doc.slug,
      articleTitle: c.doc.title,
      heading: c.heading,
      anchor: c.anchor,
      excerptHtml: highlightToHtml(s.excerpt),
      score: s.score,
      verification: c.doc.verification,
      aiAssisted: c.doc.aiAssisted,
    };
  });

  const usedIds = [...new Set(passages.map((p) => docs.find((d) => d.slug === p.articleSlug)!.id))];
  const srcRows = usedIds.length
    ? await db
        .select({ id: sources.id, title: sources.title, authors: sources.authors, year: sources.year, url: sources.url, verification: sources.verification, articleId: articleSources.articleId })
        .from(articleSources)
        .innerJoin(sources, eq(sources.id, articleSources.sourceId))
        .where(inArray(articleSources.articleId, usedIds))
    : [];
  const byId = new Map<string, RetrievalResult["sources"][number]>();
  for (const r of srcRows) {
    const title = docs.find((d) => d.id === r.articleId)!.title;
    const entry = byId.get(r.id) ?? { id: r.id, title: r.title, authors: r.authors, year: r.year, url: r.url, verification: r.verification, usedBy: [] };
    if (!entry.usedBy.includes(title)) entry.usedBy.push(title);
    byId.set(r.id, entry);
  }

  // Umbral conservador: con puntuaciones muy bajas se declara información insuficiente.
  const sufficient = passages.length > 0 && passages[0].score >= 0.05;
  return { passages, sources: [...byId.values()], sufficient };
}
