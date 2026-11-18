import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryTree } from "@/server/queries/content";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Explorar el conocimiento",
  description: "Todas las ramas y subramas de la biblioteca ALEXANDRIA.",
};

export default async function ExplorePage() {
  const tree = await getCategoryTree();
  const roots = tree.filter((c) => c.depth === 0);
  return (
    <Container wide className="py-12">
      <Eyebrow>Taxonomía del conocimiento</Eyebrow>
      <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Explorar</h1>
      <p className="mt-3 max-w-2xl text-muted">
        {roots.length} ramas principales y {tree.length - roots.length} subramas. La estructura crece desde el panel
        editorial sin modificar la aplicación; las ramas sin artículos aparecen como «en preparación».
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {roots.map((root) => {
          const children = tree.filter((c) => c.parentId === root.id);
          return (
            <section key={root.id} className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
              <Link href={`/explorar/${root.path}`} className="group flex items-start gap-3">
                <Icon name={root.icon ?? "book"} className="h-8 w-8 shrink-0 text-accent" />
                <span>
                  <span className="block font-display text-2xl font-semibold leading-tight group-hover:text-link">{root.name}</span>
                  <span className="text-xs text-muted">{root.articleCount} artículos</span>
                </span>
              </Link>
              {root.description && <p className="mt-3 text-sm leading-relaxed text-muted">{root.description}</p>}
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {children.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/explorar/${c.path}`}
                      className={`inline-block rounded-full border px-2.5 py-1 text-xs transition hover:border-accent/60 ${c.articleCount ? "border-accent/30 font-medium" : "border-line text-muted"}`}
                    >
                      {c.name}
                      {c.articleCount > 0 && <span className="ml-1 text-accent">{c.articleCount}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </Container>
  );
}
