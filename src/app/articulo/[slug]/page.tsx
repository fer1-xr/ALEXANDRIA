import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCategoryByPath, getPublishedArticle, getPublishedSlugs, type PublishedArticle } from "@/server/queries/content";
import { getArticleUserState } from "@/server/queries/library";
import { renderMarkdown } from "@/server/content/markdown";
import { ReadingToolbar } from "@/components/article/reading-toolbar";
import { TableOfContents } from "@/components/article/table-of-contents";
import { ReadingTracker } from "@/components/article/reading-tracker";
import { GuestPanel, PersonalPanel } from "@/components/article/personal-panel";
import { SourceList } from "@/components/article/source-list";
import { Badge, Container, Skeleton } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import {
  DIFFICULTY_LABELS,
  ENTITY_LABELS,
  INVERSE_RELATION_LABELS,
  NOTICE_TEXT,
  RELATION_LABELS,
  VERIFICATION_LABELS,
} from "@/lib/labels";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.length ? slugs.map((s) => ({ slug: s.slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await getPublishedArticle(slug);
  if (!a) return { title: "Artículo no encontrado" };
  return {
    title: a.title,
    description: a.summary,
    keywords: a.keywords,
    alternates: { canonical: `/articulo/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.summary, modifiedTime: a.updatedAt.toISOString() },
  };
}

export default function ArticlePage({ params }: Props) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <ArticleView params={params} />
    </Suspense>
  );
}

function ArticleSkeleton() {
  return (
    <Container className="py-12">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="mt-6 h-14 w-3/4" />
      <Skeleton className="mt-4 h-24 w-full" />
      <Skeleton className="mt-8 h-96 w-full" />
    </Container>
  );
}

const dateFmt = new Intl.DateTimeFormat("es", { dateStyle: "long", timeZone: "UTC" });

async function ArticleView({ params }: Props) {
  const { slug } = await params;
  const a = await getPublishedArticle(slug);
  if (!a) notFound();
  const { html, toc } = await renderMarkdown(a.content);
  const crumbs = (await getCategoryByPath(a.category.path))?.breadcrumbs ?? [{ name: a.category.name, path: a.category.path }];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.summary,
    inLanguage: a.locale,
    dateModified: a.updatedAt.toISOString(),
    datePublished: a.publishedAt?.toISOString(),
    keywords: a.keywords.join(", "),
    citation: a.sources.map((s) => s.source.title),
  };

  return (
    <article className="pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="border-b border-line bg-surface/50">
        <Container className="py-10 sm:py-14">
          <nav aria-label="Ruta de navegación" className="text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/explorar" className="hover:text-link">Explorar</Link></li>
              {crumbs.map((c) => (
                <li key={c.path} className="flex items-center gap-1.5">
                  <Icon name="chevronRight" className="h-3.5 w-3.5" />
                  <Link href={`/explorar/${c.path}`} className="hover:text-link">{c.name}</Link>
                </li>
              ))}
            </ol>
          </nav>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-accent">{ENTITY_LABELS[a.entityType]}</p>
          <h1 className="mt-2 max-w-4xl font-display text-4xl font-semibold leading-[1.05] sm:text-6xl">{a.title}</h1>
          {a.subtitle && <p className="mt-3 max-w-3xl text-lg text-muted sm:text-xl">{a.subtitle}</p>}
          <p className="mt-6 max-w-3xl text-lg leading-relaxed">{a.summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted">
            <Badge tone="gold">{DIFFICULTY_LABELS[a.difficulty]}</Badge>
            <Badge tone={a.verification === "unverified" ? "warn" : "ok"}>{VERIFICATION_LABELS[a.verification]}</Badge>
            <span className="inline-flex items-center gap-1"><Icon name="clock" className="h-4 w-4" /> {a.readingMinutes} min</span>
            <span aria-hidden="true">·</span>
            <span>Actualizado el <time dateTime={a.updatedAt.toISOString()}>{dateFmt.format(a.updatedAt)}</time></span>
            {a.authorCredit && (<><span aria-hidden="true">·</span><span>{a.authorCredit}</span></>)}
          </div>
          <div className="mt-6">
            <ReadingToolbar title={a.title} allowDownload={a.allowDownload} slug={a.slug} />
          </div>
        </Container>
      </header>

      <Container className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <EditorialNotices article={a} />
          {toc.length > 0 && (
            <details className="mb-8 rounded-[var(--radius-card)] border border-line bg-surface p-4 lg:hidden">
              <summary className="cursor-pointer text-sm font-medium">Índice del artículo</summary>
              <div className="mt-3"><TableOfContents toc={toc} /></div>
            </details>
          )}
          <div id="article-body" className="prose-alx max-w-[44rem]" dangerouslySetInnerHTML={{ __html: html }} />

          {a.events.length > 0 && (
            <section aria-labelledby="cronologia" className="mt-14 max-w-[44rem]">
              <h2 id="cronologia" className="font-display text-2xl font-semibold">En la línea de tiempo</h2>
              <ul className="mt-4 space-y-2">
                {a.events.map((e) => (
                  <li key={e.slug}>
                    <Link href={`/linea-de-tiempo#${e.slug}`} className="flex gap-3 rounded-lg border border-line bg-surface px-4 py-2.5 hover:border-accent/60">
                      <span className="w-40 shrink-0 text-sm font-medium text-accent">{e.displayDate}</span>
                      <span className="text-sm">{e.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <SourceList sources={a.sources} />

          {a.related.length > 0 && (
            <section aria-labelledby="relacionados" className="mt-14">
              <h2 id="relacionados" className="font-display text-2xl font-semibold">Conocimiento conectado</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {a.related.map((r) => (
                  <li key={r.id}>
                    <Link href={`/articulo/${r.slug}`} className="block h-full rounded-[var(--radius-card)] border border-line bg-surface p-4 hover:border-accent/60">
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                        {r.direction === "out" ? RELATION_LABELS[r.type] : INVERSE_RELATION_LABELS[r.type]} · {ENTITY_LABELS[r.entityType]}
                      </span>
                      <span className="mt-1 block font-display text-xl font-semibold">{r.title}</span>
                      {r.description && <span className="mt-1 block text-sm text-muted">{r.description}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto lg:pb-6">
          {a.facts.length > 0 && (
            <section aria-label="Ficha rápida" className="rounded-[var(--radius-card)] border border-line bg-surface p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Ficha</p>
              <dl className="space-y-2.5 text-sm">
                {a.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs text-muted">{f.label}</dt>
                    <dd className="font-medium leading-snug">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          <div className="no-print">
            <Suspense fallback={<Skeleton className="h-28" />}>
              <PersonalArea articleId={a.id} slug={a.slug} toc={toc} />
            </Suspense>
          </div>
          <div className="hidden lg:block"><TableOfContents toc={toc} /></div>
          {a.keywords.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Palabras clave</p>
              <ul className="flex flex-wrap gap-1.5">
                {a.keywords.map((k) => (
                  <li key={k}><Link href={`/buscar?q=${encodeURIComponent(k)}`} className="inline-block rounded-full border border-line px-2.5 py-0.5 text-xs hover:border-accent/60">{k}</Link></li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </Container>
    </article>
  );
}

async function PersonalArea({ articleId, slug, toc }: { articleId: string; slug: string; toc: Awaited<ReturnType<typeof renderMarkdown>>["toc"] }) {
  const state = await getArticleUserState(articleId);
  if (!state) return <GuestPanel next={`/articulo/${slug}`} />;
  return (
    <>
      {state.historyEnabled && <ReadingTracker articleId={articleId} />}
      <PersonalPanel articleId={articleId} toc={toc} state={state} />
    </>
  );
}

function EditorialNotices({ article: a }: { article: PublishedArticle }) {
  const medical = a.notices.includes("medical");
  return (
    <div className="mb-8 max-w-[44rem] space-y-3">
      {(a.aiAssisted || a.verification === "unverified") && (
        <div className="flex gap-3 rounded-[var(--radius-card)] border border-amber-600/30 bg-amber-500/5 p-4 text-sm">
          <Icon name="info" className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />
          <div>
            <p className="font-medium">
              {a.aiAssisted ? "Redactado con asistencia de IA" : "Contenido"} · {VERIFICATION_LABELS[a.verification]}
            </p>
            <p className="mt-1 text-muted">
              {a.verification === "unverified"
                ? "Este artículo aún no ha sido revisado por el equipo editorial. Contrasta los datos con las fuentes citadas, que también están pendientes de verificación."
                : "Este artículo fue revisado por personas antes de su publicación."}
            </p>
          </div>
        </div>
      )}
      {a.notices.map((n) => (
        <div key={n} className="flex gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-4 text-sm">
          <Icon name={n === "medical" ? "pulse" : "alert"} className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="font-medium">{NOTICE_TEXT[n].title}</p>
            <p className="mt-1 text-muted">{NOTICE_TEXT[n].body}</p>
            {n === "medical" && (
              <p className="mt-1 text-muted">
                <strong className="font-medium text-fg">Revisión médica:</strong>{" "}
                {medical && a.reviewedAt ? dateFmt.format(a.reviewedAt) : "pendiente de revisión por un profesional sanitario."}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
