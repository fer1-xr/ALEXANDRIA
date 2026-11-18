import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/server/db/client";
import { getTopCategories } from "@/server/queries/content";
import { getRecommendationsForUser } from "@/server/queries/library";
import { ArticleCard } from "@/components/article/article-card";
import { Container, Eyebrow, SectionHeading, Skeleton } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import type { EntityType } from "@/server/db/schema";

export const metadata: Metadata = { title: "Descubrir", description: "Exploración libre por la biblioteca: azar, preguntas, mapas y cronologías." };

const QUESTIONS = [
  "¿Quién construyó las pirámides de Giza?",
  "¿Qué es un agujero negro?",
  "¿Cómo se descubrió la estructura del ADN?",
  "¿Por qué Plutón ya no es un planeta?",
  "¿Qué fueron las misiones jesuíticas?",
  "¿Cómo surgió Internet?",
  "¿Qué dice la teoría del Big Bang?",
  "¿Qué es la alquimia?",
];

const WAYS = [
  { href: "/explorar", icon: "layers", title: "Por ramas", text: "Recorre la taxonomía completa del conocimiento." },
  { href: "/atlas", icon: "map", title: "Por mapa", text: "Lugares y monumentos situados en el mundo." },
  { href: "/linea-de-tiempo", icon: "timeline", title: "Por época", text: "Del Big Bang al siglo XXI." },
  { href: "/aprender", icon: "route", title: "Por rutas", text: "Itinerarios ordenados para aprender paso a paso." },
];

export default function DiscoverPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-night text-ivory">
        <div className="atlas-grid absolute inset-0" aria-hidden="true" />
        <Container className="relative py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Exploración libre</p>
          <h1 className="mt-3 font-display text-5xl font-semibold">Descubrir</h1>
          <p className="mx-auto mt-3 max-w-xl text-ivory/75">Entra sin saber qué buscas. Deja que la biblioteca te lleve a un conocimiento nuevo.</p>
          <Link href="/descubrir/sorprendeme" prefetch={false} className="mt-8 inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-lg font-semibold text-night shadow-lg transition hover:brightness-110">
            <Icon name="shuffle" className="h-6 w-6" /> Sorpréndeme
          </Link>
        </Container>
      </section>
      <Container wide className="space-y-20 py-14">
        <Suspense fallback={null}>
          <ForYou />
        </Suspense>
        <section>
          <SectionHeading eyebrow="Al azar" title="Hoy podrías descubrir…" description="Una selección distinta en cada visita." />
          <Suspense fallback={<div className="grid gap-5 md:grid-cols-3"><Skeleton className="h-72" /><Skeleton className="h-72" /><Skeleton className="h-72" /></div>}>
            <RandomPicks />
          </Suspense>
        </section>
        <section>
          <SectionHeading eyebrow="Curiosidad" title="Preguntas sugeridas" />
          <ul className="grid gap-3 sm:grid-cols-2">
            {QUESTIONS.map((q) => (
              <li key={q}>
                <Link href={`/buscar?q=${encodeURIComponent(q)}`} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-5 py-4 hover:border-accent/60">
                  <span className="font-display text-lg">{q}</span>
                  <Icon name="arrowRight" className="h-4 w-4 shrink-0 text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <SectionHeading eyebrow="Caminos" title="Otras formas de explorar" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WAYS.map((w) => (
              <Link key={w.href} href={w.href} className="rounded-[var(--radius-card)] border border-line bg-surface p-5 hover:border-accent/60">
                <Icon name={w.icon} className="h-7 w-7 text-accent" />
                <p className="mt-3 font-display text-xl font-semibold">{w.title}</p>
                <p className="mt-1 text-sm text-muted">{w.text}</p>
              </Link>
            ))}
          </div>
        </section>
        <BranchStrip />
      </Container>
    </>
  );
}

async function ForYou() {
  const recs = await getRecommendationsForUser(6);
  if (!recs.length) return null;
  return (
    <section>
      <SectionHeading eyebrow="Según tus lecturas" title="Recomendado para ti" description="Artículos conectados con lo que ya leíste y que todavía no has abierto." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recs.map((a) => <ArticleCard key={a.id} article={a} variant="compact" />)}
      </div>
    </section>
  );
}

async function RandomPicks() {
  await connection();
  const rows = await db.execute<{ id: string; slug: string; title: string; subtitle: string | null; summary: string; entity_type: EntityType; reading_minutes: number; category_name: string; category_path: string }>(sql`
    SELECT a.id, a.slug, a.title, a.subtitle, a.summary, a.entity_type, a.reading_minutes, c.name AS category_name, c.path AS category_path
    FROM articles a JOIN categories c ON c.id = a.category_id
    WHERE a.status = 'published' ORDER BY random() LIMIT 3`);
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {rows.map((r) => (
        <ArticleCard key={r.id} article={{ id: r.id, slug: r.slug, title: r.title, subtitle: r.subtitle, summary: r.summary, entityType: r.entity_type, readingMinutes: r.reading_minutes, categoryName: r.category_name, categoryPath: r.category_path }} />
      ))}
    </div>
  );
}

async function BranchStrip() {
  const cats = await getTopCategories();
  return (
    <section>
      <Eyebrow>Todas las ramas</Eyebrow>
      <ul className="mt-4 flex flex-wrap gap-2">
        {cats.map((c) => (
          <li key={c.id}>
            <Link href={`/explorar/${c.path}`} className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-sm hover:border-accent/60">
              <Icon name={c.icon ?? "book"} className="h-4 w-4 text-accent" /> {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
