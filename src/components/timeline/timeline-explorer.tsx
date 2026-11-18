"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cx } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

export type TLEvent = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  displayDate: string;
  precision: string;
  uncertainty: string | null;
  era: string;
  region: string | null;
  theme: string | null;
  articleSlug: string | null;
  articleTitle: string | null;
  sourceTitle: string | null;
  sourceUrl: string | null;
};

const THEME_LABELS: Record<string, string> = {
  universo: "Universo", geologia: "Geología", biologia: "Biología", "evolucion-humana": "Evolución humana",
  migraciones: "Migraciones", sociedad: "Sociedad", cultura: "Cultura", politica: "Política", arquitectura: "Arquitectura",
  derecho: "Derecho", tecnologia: "Tecnología", exploracion: "Exploración", religion: "Religión", ciencia: "Ciencia", guerras: "Guerras",
};

const APPROX = new Set(["approximate", "century", "millennium", "geological"]);

export function TimelineExplorer({ events, eras }: { events: TLEvent[]; eras: readonly { key: string; label: string; description: string }[] }) {
  const [era, setEra] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [theme, setTheme] = useState<string>("");

  const regions = useMemo(() => [...new Set(events.map((e) => e.region).filter(Boolean))].sort() as string[], [events]);
  const themes = useMemo(() => [...new Set(events.map((e) => e.theme).filter(Boolean))].sort() as string[], [events]);
  const filtered = events.filter((e) => (!era || e.era === era) && (!region || e.region === region) && (!theme || e.theme === theme));

  const select = "rounded-full border border-line bg-surface px-3 py-1.5 text-sm";
  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-b-xl">
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="f-era">Era</label>
          <select id="f-era" className={select} value={era} onChange={(e) => setEra(e.target.value)}>
            <option value="">Todas las eras</option>
            {eras.map((e) => <option key={e.key} value={e.key}>{e.label}</option>)}
          </select>
          <label className="sr-only" htmlFor="f-region">Región</label>
          <select id="f-region" className={select} value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="">Todas las regiones</option>
            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <label className="sr-only" htmlFor="f-tema">Tema</label>
          <select id="f-tema" className={select} value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="">Todos los temas</option>
            {themes.map((t) => <option key={t} value={t}>{THEME_LABELS[t] ?? t}</option>)}
          </select>
          {(era || region || theme) && (
            <button type="button" onClick={() => { setEra(""); setRegion(""); setTheme(""); }} className="text-sm text-link underline">
              Quitar filtros
            </button>
          )}
          <span className="ml-auto text-sm text-muted" role="status">{filtered.length} acontecimientos</span>
        </div>
      </div>

      {eras.map((er) => {
        const items = filtered.filter((e) => e.era === er.key);
        if (!items.length) return null;
        return (
          <section key={er.key} id={`era-${er.key}`} aria-labelledby={`h-${er.key}`} className="mt-12 scroll-mt-32">
            <h2 id={`h-${er.key}`} className="font-display text-3xl font-semibold">{er.label}</h2>
            <p className="text-sm text-muted">{er.description}</p>
            <ol className="relative mt-6 space-y-5 border-l-2 border-accent/30 pl-6 sm:pl-8">
              {items.map((e) => (
                <li key={e.id} id={e.slug} className="relative scroll-mt-32">
                  <span className="absolute -left-[1.95rem] top-2 h-3.5 w-3.5 rounded-full border-2 border-accent bg-bg sm:-left-[2.45rem]" aria-hidden="true" />
                  <article className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-accent">
                      <time>{e.displayDate}</time>
                      {APPROX.has(e.precision) && (
                        <span className="rounded-full border border-accent/30 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider">Fecha aproximada</span>
                      )}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-semibold">{e.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{e.summary}</p>
                    {e.uncertainty && <p className="mt-2 text-xs text-muted"><span className="font-medium text-fg">Incertidumbre:</span> {e.uncertainty}</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                      {e.region && <span className="inline-flex items-center gap-1"><Icon name="map" className="h-3.5 w-3.5" />{e.region}</span>}
                      {e.theme && <span>{THEME_LABELS[e.theme] ?? e.theme}</span>}
                      {e.sourceTitle && (
                        <span>
                          Fuente:{" "}
                          {e.sourceUrl ? <a href={e.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="italic underline">{e.sourceTitle}</a> : <span className="italic">{e.sourceTitle}</span>}
                        </span>
                      )}
                    </div>
                    {e.articleSlug && (
                      <Link href={`/articulo/${e.articleSlug}`} className={cx("mt-3 inline-flex items-center gap-1 text-sm font-medium text-link hover:underline")}>
                        Leer: {e.articleTitle} <Icon name="arrowRight" className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </article>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
      {filtered.length === 0 && <p className="mt-10 text-center text-muted">Ningún acontecimiento coincide con los filtros.</p>}
    </div>
  );
}
