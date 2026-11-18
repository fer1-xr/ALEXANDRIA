import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { sql } from "drizzle-orm";
import { db } from "@/server/db/client";
import { searchSynonyms } from "@/server/db/schema";
import type { EntityType } from "@/server/db/schema";
import { escapeLike, expandWithSynonyms, highlightToHtml, HL_START, HL_STOP } from "./query-utils";

export type SearchHit = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  entityType: EntityType;
  categoryName: string;
  categoryPath: string;
  snippetHtml: string;
  score: number;
};

export type SearchResult = {
  hits: SearchHit[];
  total: number;
  facets: { types: { type: EntityType; count: number }[]; branches: { slug: string; name: string; count: number }[] };
  categories: { name: string; path: string }[];
  events: { slug: string; title: string; displayDate: string }[];
  suggestion: string | null;
  expandedWith: string[];
};

export const PAGE_SIZE = 12;

async function loadSynonyms() {
  "use cache";
  cacheLife("hours");
  cacheTag("synonyms");
  return db.select({ term: searchSynonyms.term, synonyms: searchSynonyms.synonyms }).from(searchSynonyms);
}

/** Búsqueda principal. Cacheada por combinación de parámetros (minutos). */
export async function searchLibrary(params: {
  q: string;
  type?: string;
  branch?: string;
  page?: number;
  locale?: string;
}): Promise<SearchResult> {
  "use cache";
  cacheLife("minutes");
  cacheTag("articles");

  const q = params.q.trim();
  const locale = params.locale ?? "es";
  const page = params.page ?? 1;
  const empty: SearchResult = {
    hits: [],
    total: 0,
    facets: { types: [], branches: [] },
    categories: [],
    events: [],
    suggestion: null,
    expandedWith: [],
  };
  if (!q) return empty;

  const expandedWith = expandWithSynonyms(q, await loadSynonyms());
  const expandedText = [q, ...expandedWith].join(" ");

  // q_and: todos los términos (websearch admite "frases" y -exclusiones).
  // q_or: cualquier término de la consulta ampliada (útil para preguntas naturales).
  const input = sql`
    SELECT websearch_to_tsquery('es_unaccent', ${q}) AS q_and,
           nullif(replace(plainto_tsquery('es_unaccent', ${expandedText})::text, '&', '|'), '')::tsquery AS q_or,
           f_unaccent(lower(${q})) AS q_norm`;

  const typeFilter = params.type ? sql`AND a.entity_type = ${params.type}::entity_type` : sql``;
  const branchFilter = params.branch
    ? sql`AND (c.path = ${params.branch} OR c.path LIKE ${escapeLike(params.branch) + "/%"})`
    : sql``;

  const matchClause = sql`
    a.status = 'published' AND a.locale = ${locale}
    AND ((i.q_or IS NOT NULL AND a.search_vector @@ i.q_or) OR f_unaccent(lower(a.title)) % i.q_norm)`;

  const rows = await db.execute<{
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    entity_type: EntityType;
    category_name: string;
    category_path: string;
    snippet: string;
    score: number;
    total: number;
  }>(sql`
    WITH i AS (${input})
    SELECT a.id, a.slug, a.title, a.subtitle, a.entity_type,
           c.name AS category_name, c.path AS category_path,
           ts_headline('es_unaccent', a.summary, coalesce(i.q_or, i.q_and),
             ${`StartSel=${HL_START},StopSel=${HL_STOP},MaxFragments=2,MaxWords=28,MinWords=12,FragmentDelimiter= … `}) AS snippet,
           (coalesce(ts_rank_cd(a.search_vector, i.q_or, 32), 0)
             + CASE WHEN a.search_vector @@ i.q_and THEN 0.35 ELSE 0 END
             + 0.6 * similarity(f_unaccent(lower(a.title)), i.q_norm)
             + CASE WHEN f_unaccent(lower(a.title)) = i.q_norm THEN 1 ELSE 0 END)::float AS score,
           count(*) OVER ()::int AS total
    FROM articles a
    JOIN categories c ON c.id = a.category_id
    CROSS JOIN i
    WHERE ${matchClause} ${typeFilter} ${branchFilter}
    ORDER BY score DESC, a.title ASC
    LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`);

  const facetRows = await db.execute<{ kind: "type" | "branch"; key: string; name: string | null; count: number }>(sql`
    WITH i AS (${input}),
    m AS (
      SELECT a.entity_type, split_part(c.path, '/', 1) AS branch
      FROM articles a JOIN categories c ON c.id = a.category_id CROSS JOIN i
      WHERE ${matchClause}
    )
    SELECT 'type' AS kind, entity_type::text AS key, NULL AS name, count(*)::int AS count FROM m GROUP BY entity_type
    UNION ALL
    SELECT 'branch', m.branch, b.name, count(*)::int FROM m JOIN categories b ON b.path = m.branch GROUP BY m.branch, b.name
    ORDER BY count DESC`);

  const categoryRows = await db.execute<{ name: string; path: string }>(sql`
    SELECT name, path FROM categories
    WHERE archived_at IS NULL
      AND (f_unaccent(lower(name)) % f_unaccent(lower(${q}))
           OR f_unaccent(lower(name)) LIKE ${"%" + escapeLike(q.toLowerCase()) + "%"})
    ORDER BY similarity(f_unaccent(lower(name)), f_unaccent(lower(${q}))) DESC, depth ASC
    LIMIT 6`);

  const eventRows = await db.execute<{ slug: string; title: string; display_date: string }>(sql`
    WITH i AS (${input})
    SELECT e.slug, e.title, e.display_date FROM timeline_events e CROSS JOIN i
    WHERE e.status = 'published'
      AND (to_tsvector('es_unaccent', e.title || ' ' || e.summary) @@ coalesce(i.q_or, i.q_and)
           OR f_unaccent(lower(e.title)) % i.q_norm)
    ORDER BY e.start_year ASC
    LIMIT 5`);

  const total = rows[0]?.total ?? 0;
  let suggestion: string | null = null;
  if (total < 3) {
    // «¿Quisiste decir…?»: título o palabra clave publicada más parecida.
    const [s] = await db.execute<{ term: string; sim: number }>(sql`
      SELECT term, similarity(f_unaccent(lower(term)), f_unaccent(lower(${q}))) AS sim FROM (
        SELECT title AS term FROM articles WHERE status = 'published'
        UNION SELECT unnest(keywords) FROM articles WHERE status = 'published'
      ) t
      WHERE f_unaccent(lower(term)) <> f_unaccent(lower(${q}))
      ORDER BY sim DESC LIMIT 1`);
    if (s && s.sim >= 0.3) suggestion = s.term;
  }

  return {
    hits: rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      subtitle: r.subtitle,
      entityType: r.entity_type,
      categoryName: r.category_name,
      categoryPath: r.category_path,
      snippetHtml: highlightToHtml(r.snippet),
      score: r.score,
    })),
    total,
    facets: {
      types: facetRows.filter((f) => f.kind === "type").map((f) => ({ type: f.key as EntityType, count: f.count })),
      branches: facetRows
        .filter((f) => f.kind === "branch")
        .map((f) => ({ slug: f.key, name: f.name ?? f.key, count: f.count })),
    },
    categories: [...categoryRows],
    events: eventRows.map((e) => ({ slug: e.slug, title: e.title, displayDate: e.display_date })),
    suggestion,
    expandedWith,
  };
}

export type Suggestion = { kind: "article" | "category"; label: string; href: string; detail: string };

/** Autocompletado: prefijo, palabra interna y similitud por trigramas. */
export async function suggest(qRaw: string, locale = "es"): Promise<Suggestion[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("articles");
  const q = qRaw.trim().slice(0, 100);
  if (q.length < 2) return [];
  const like = escapeLike(q.toLowerCase());
  const rows = await db.execute<{ kind: "article" | "category"; label: string; key: string; detail: string }>(sql`
    (SELECT 'article' AS kind, a.title AS label, a.slug AS key, a.entity_type::text AS detail,
            (f_unaccent(lower(a.title)) LIKE f_unaccent(${like + "%"}))::int * 2
              + word_similarity(f_unaccent(lower(${q})), f_unaccent(lower(a.title))) AS rank
     FROM articles a
     WHERE a.status = 'published' AND a.locale = ${locale}
       AND (f_unaccent(lower(a.title)) LIKE f_unaccent(${like + "%"})
            OR f_unaccent(lower(a.title)) LIKE f_unaccent(${"% " + like + "%"})
            OR f_unaccent(lower(${q})) <% f_unaccent(lower(a.title))
            OR EXISTS (SELECT 1 FROM unnest(a.keywords) k WHERE f_unaccent(lower(k)) LIKE f_unaccent(${like + "%"})))
     ORDER BY rank DESC LIMIT 7)
    UNION ALL
    (SELECT 'category', c.name, c.path, 'Rama del conocimiento',
            word_similarity(f_unaccent(lower(${q})), f_unaccent(lower(c.name))) AS rank
     FROM categories c
     WHERE c.archived_at IS NULL
       AND (f_unaccent(lower(c.name)) LIKE f_unaccent(${like + "%"}) OR f_unaccent(lower(${q})) <% f_unaccent(lower(c.name)))
     ORDER BY rank DESC LIMIT 3)`);
  return rows.map((r) => ({
    kind: r.kind,
    label: r.label,
    href: r.kind === "article" ? `/articulo/${r.key}` : `/explorar/${r.key}`,
    detail: r.detail,
  }));
}
