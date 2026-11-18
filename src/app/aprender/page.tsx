import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getLearningPaths } from "@/server/queries/content";
import { getPathProgress } from "@/server/queries/library";
import { Container } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { DIFFICULTY_LABELS } from "@/lib/labels";

export const metadata: Metadata = { title: "Aprender", description: "Rutas de aprendizaje por niveles." };

export default async function LearnPage() {
  const paths = await getLearningPaths();
  return (
    <Container className="py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Aprender</p>
      <h1 className="mt-2 font-display text-5xl font-semibold">Rutas de aprendizaje</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Itinerarios ordenados para estudiar un tema de principio a fin. Tu progreso se calcula con los artículos que
        leíste. Los cursos con evaluaciones, cuestionarios y certificados llegan en la Fase 5.
      </p>
      <ul className="mt-10 space-y-5">
        {paths.map((p) => (
          <li key={p.id}>
            <Link href={`/aprender/${p.slug}`} className="group block rounded-[var(--radius-card)] border border-line bg-surface p-6 hover:border-accent/60">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                <Icon name="route" className="h-4 w-4" /> {DIFFICULTY_LABELS[p.difficulty]} · {p.stepCount} pasos
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold group-hover:text-link">{p.title}</h2>
              <p className="mt-2 text-muted">{p.description}</p>
              <Suspense fallback={null}>
                <Progress slug={p.slug} />
              </Suspense>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}

async function Progress({ slug }: { slug: string }) {
  const progress = (await getPathProgress()).find((p) => p.slug === slug);
  if (!progress || progress.total === 0) return null;
  const pct = Math.round((progress.done / progress.total) * 100);
  return (
    <div className="mt-4">
      <div className="h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progreso">
        <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-muted">{progress.done} de {progress.total} lecturas completadas</p>
    </div>
  );
}
