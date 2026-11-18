import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PAGE_SIZE, searchLibrary } from "@/server/search/search";
import { isNaturalQuestion } from "@/server/search/query-utils";
import { SearchBox } from "@/components/search/search-box";
import { Container, EmptyState, Skeleton, cx } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { ENTITY_LABELS } from "@/lib/labels";
import { searchQuerySchema } from "@/lib/validation";

export const metadata: Metadata = { title: "Buscar", robots: { index: false, follow: true } };

type SP = Promise<Record<string, string | string[] | undefined>>;

export default function SearchPage({ searchParams }: { searchParams: SP }) {
  return (
    <Container wide className="py-10">
      <h1 className="font-display text-4xl font-semibold">Buscar en la biblioteca</h1>
      <Suspense fallback={<Skeleton className="mt-6 h-14 max-w-3xl rounded-full" />}>
        <SearchHeader searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<div className="mt-10 space-y-4"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></div>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

function parse(sp: Record<string, string | string[] | undefined>) {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const parsed = searchQuerySchema.safeParse({ q: one(sp.q), type: one(sp.tipo), category: one(sp.rama), page: one(sp.pagina) });
  return parsed.success ? parsed.data : { q: "", page: 1, type: undefined, category: undefined };
}

async function SearchHeader({ searchParams }: { searchParams: SP }) {
  const { q } = parse(await searchParams);
  return (
    <div className="mt-6 max-w-3xl">
      <SearchBox size="md" defaultValue={q} key={q} />
    </div>
  );
}

function href(base: { q: string; type?: string; category?: string }, patch: Record<string, string | undefined>) {
  const p = new URLSearchParams();
  const merged = { q: base.q, tipo: base.type, rama: base.category, ...patch };
  for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
  return `/buscar?${p.toString()}`;
}

async function Results({ searchParams }: { searchParams: SP }) {
  const params = parse(await searchParams);
  if (!params.q) {
    return (
      <div className="mt-10">
        <EmptyState title="¿Qué quieres descubrir hoy?">
          Busca personajes, lugares, civilizaciones, especies, teorías o escribe una pregunta, por ejemplo «¿quién
          construyó las pirámides?».
        </EmptyState>
      </div>
    );
  }
  let result;
  try {
    result = await searchLibrary({ q: params.q, type: params.type, branch: params.category, page: params.page });
  } catch (err) {
    console.error("[buscar]", err);
    return <p className="mt-10 rounded-xl border border-red-600/30 p-4 text-sm">La búsqueda no está disponible en este momento. Inténtalo de nuevo en unos minutos.</p>;
  }
  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));
  const question = isNaturalQuestion(params.q);

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside aria-label="Filtros" className="space-y-6 text-sm">
        <FacetGroup title="Tipo">
          <FacetLink active={!params.type} href={href(params, { tipo: undefined, pagina: undefined })} label="Todos" />
          {result.facets.types.map((f) => (
            <FacetLink key={f.type} active={params.type === f.type} href={href(params, { tipo: f.type, pagina: undefined })} label={ENTITY_LABELS[f.type]} count={f.count} />
          ))}
        </FacetGroup>
        <FacetGroup title="Rama">
          <FacetLink active={!params.category} href={href(params, { rama: undefined, pagina: undefined })} label="Todas" />
          {result.facets.branches.map((f) => (
            <FacetLink key={f.slug} active={params.category === f.slug} href={href(params, { rama: f.slug, pagina: undefined })} label={f.name} count={f.count} />
          ))}
        </FacetGroup>
      </aside>

      <div className="min-w-0">
        <p className="text-sm text-muted" role="status">
          {result.total === 0 ? "Sin resultados" : `${result.total} ${result.total === 1 ? "resultado" : "resultados"}`} para «{params.q}»
          {result.expandedWith.length > 0 && <> · también se buscó: {result.expandedWith.join(", ")}</>}
        </p>
        {result.suggestion && (
          <p className="mt-2 text-sm">
            ¿Quisiste decir{" "}
            <Link href={href({ q: result.suggestion }, {})} className="font-medium text-link underline">{result.suggestion}</Link>?
          </p>
        )}
        {question && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-accent/30 bg-surface p-4 text-sm">
            <Icon name="spark" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <p>
              Parece una pregunta. <Link href={`/ai?q=${encodeURIComponent(params.q)}`} className="font-medium text-link underline">Pregúntasela a ALEXANDRIA AI</Link>{" "}
              para ver los pasajes de la biblioteca que la responden, con sus fuentes.
            </p>
          </div>
        )}

        {result.categories.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Ramas del conocimiento</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {result.categories.map((c) => (
                <li key={c.path}><Link href={`/explorar/${c.path}`} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-sm hover:border-accent/60"><Icon name="layers" className="h-3.5 w-3.5 text-accent" />{c.name}</Link></li>
              ))}
            </ul>
          </div>
        )}

        <ol className="mt-6 space-y-4">
          {result.hits.map((h) => (
            <li key={h.id}>
              <Link href={`/articulo/${h.slug}`} className="group block rounded-[var(--radius-card)] border border-line bg-surface p-5 transition hover:border-accent/60">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">{ENTITY_LABELS[h.entityType]} · {h.categoryName}</p>
                <h2 className="mt-1 font-display text-2xl font-semibold group-hover:text-link">{h.title}</h2>
                {h.subtitle && <p className="text-sm text-muted">{h.subtitle}</p>}
                <p className="mt-2 text-sm leading-relaxed text-muted" dangerouslySetInnerHTML={{ __html: h.snippetHtml }} />
              </Link>
            </li>
          ))}
        </ol>

        {result.total === 0 && (
          <div className="mt-6">
            <EmptyState title="No encontramos artículos">
              Prueba con otras palabras, revisa la ortografía o <Link href="/explorar" className="text-link underline">explora por ramas</Link>.
            </EmptyState>
          </div>
        )}

        {result.events.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">En la línea de tiempo</p>
            <ul className="mt-2 space-y-2">
              {result.events.map((e) => (
                <li key={e.slug}>
                  <Link href={`/linea-de-tiempo#${e.slug}`} className="flex gap-3 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm hover:border-accent/60">
                    <span className="w-44 shrink-0 font-medium text-accent">{e.displayDate}</span>
                    <span>{e.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label="Paginación" className="mt-8 flex items-center justify-between text-sm">
            {params.page > 1 ? <Link href={href(params, { pagina: String(params.page - 1) })} className="text-link">← Anterior</Link> : <span />}
            <span className="text-muted">Página {params.page} de {totalPages}</span>
            {params.page < totalPages ? <Link href={href(params, { pagina: String(params.page + 1) })} className="text-link">Siguiente →</Link> : <span />}
          </nav>
        )}
      </div>
    </div>
  );
}

function FacetGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{title}</p>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function FacetLink({ href, label, count, active }: { href: string; label: string; count?: number; active: boolean }) {
  return (
    <li>
      <Link href={href} aria-current={active ? "true" : undefined} className={cx("flex justify-between rounded-lg px-2.5 py-1.5", active ? "bg-surface-2 font-medium" : "text-muted hover:bg-surface-2 hover:text-fg")}>
        <span>{label}</span>
        {count !== undefined && <span className="tabular-nums">{count}</span>}
      </Link>
    </li>
  );
}
