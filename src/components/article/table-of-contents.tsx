"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/server/content/markdown";
import { cx } from "@/components/ui/primitives";

/** Índice lateral con resaltado de la sección visible. */
export function TableOfContents({ toc }: { toc: TocEntry[] }) {
  const [active, setActive] = useState<string | null>(toc[0]?.id ?? null);
  useEffect(() => {
    const headings = toc.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, [toc]);

  if (!toc.length) return null;
  return (
    <nav aria-label="Índice del artículo">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Índice</p>
      <ol className="space-y-1 border-l border-line text-sm">
        {toc.map((t) => (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              aria-current={active === t.id ? "location" : undefined}
              className={cx(
                "-ml-px block border-l-2 py-1 leading-snug transition",
                t.level === 3 ? "pl-6" : "pl-3",
                active === t.id ? "border-accent font-medium text-fg" : "border-transparent text-muted hover:text-fg",
              )}
            >
              {t.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
