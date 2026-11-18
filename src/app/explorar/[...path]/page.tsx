import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getArticlesInBranch, getCategoryByPath } from "@/server/queries/content";
import { ArticleCard } from "@/components/article/article-card";
import { Container, EmptyState, Eyebrow, Skeleton } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { branchStyle } from "@/components/ui/branch-style";

type Props = { params: Promise<{ path: string[] }> };

const toPath = (segments: string[]) => segments.map((s) => decodeURIComponent(s)).join("/").toLowerCase();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = await getCategoryByPath(toPath((await params).path));
  if (!cat) return { title: "Rama no encontrada" };
  return {
    title: cat.node.name,
    description: cat.node.description ?? `Artículos y subramas de ${cat.node.name} en ALEXANDRIA.`,
    alternates: { canonical: `/explorar/${cat.node.path}` },
  };
}

export default function CategoryPage({ params }: Props) {
  return (
    <Suspense fallback={<Container className="py-12"><Skeleton className="h-12 w-1/2" /><Skeleton className="mt-8 h-64" /></Container>}>
      <CategoryView params={params} />
    </Suspense>
  );
}

async function CategoryView({ params }: Props) {
  const path = toPath((await params).path);
  const cat = await getCategoryByPath(path);
  if (!cat) notFound();
  const articles = await getArticlesInBranch(path, 48);
  const { icon } = branchStyle(path);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-night text-ivory">
        <div className="atlas-grid absolute inset-0" aria-hidden="true" />
        <Container wide className="relative py-12">
          <nav aria-label="Ruta de navegación" className="text-sm text-ivory/60">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/explorar" className="hover:text-gold">Explorar</Link></li>
              {cat.breadcrumbs.map((b, i) => (
                <li key={b.path} className="flex items-center gap-1.5">
                  <Icon name="chevronRight" className="h-3.5 w-3.5" />
                  {i === cat.breadcrumbs.length - 1 ? (
                    <span aria-current="page" className="text-ivory">{b.name}</span>
                  ) : (
                    <Link href={`/explorar/${b.path}`} className="hover:text-gold">{b.name}</Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <div className="mt-6 flex items-start gap-4">
            <Icon name={cat.node.icon ?? icon} className="mt-1 h-10 w-10 shrink-0 text-gold" />
            <div>
              <h1 className="font-display text-4xl font-semibold sm:text-5xl">{cat.node.name}</h1>
              {cat.node.description && <p className="mt-3 max-w-2xl text-ivory/75">{cat.node.description}</p>}
              <p className="mt-3 text-sm text-ivory/60">
                {cat.node.articleCount} {cat.node.articleCount === 1 ? "artículo publicado" : "artículos publicados"}
                {cat.children.length > 0 && ` · ${cat.children.length} subramas`}
              </p>
            </div>
          </div>
        </Container>
      </section>
      <Container wide className="py-10">
        {cat.children.length > 0 && (
          <section aria-labelledby="subramas" className="mb-12">
            <Eyebrow>Subramas</Eyebrow>
            <h2 id="subramas" className="sr-only">Subramas</h2>
            <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {cat.children.map((c) => (
                <li key={c.id}>
                  <Link href={`/explorar/${c.path}`} className="flex h-full items-center justify-between gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-sm transition hover:border-accent/60">
                    <span className="font-medium">{c.name}</span>
                    <span className={c.articleCount ? "text-accent" : "text-xs text-muted"}>{c.articleCount || "—"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section aria-labelledby="articulos">
          <Eyebrow>Artículos</Eyebrow>
          <h2 id="articulos" className="sr-only">Artículos</h2>
          {articles.length === 0 ? (
            <div className="mt-4">
              <EmptyState title="Esta rama está en preparación">
                Todavía no hay artículos publicados en «{cat.node.name}». El equipo editorial incorpora contenido
                verificado de forma progresiva. Mientras tanto, prueba el <Link href="/buscar" className="text-link underline">buscador</Link> o{" "}
                <Link href="/descubrir/sorprendeme" prefetch={false} className="text-link underline">descubre algo al azar</Link>.
              </EmptyState>
            </div>
          ) : (
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          )}
        </section>
      </Container>
    </>
  );
}
