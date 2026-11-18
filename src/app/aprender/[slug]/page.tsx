import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLearningPath, getLearningPaths } from "@/server/queries/content";
import { getReadArticleIds } from "@/server/queries/library";
import { Container, Skeleton } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { DIFFICULTY_LABELS } from "@/lib/labels";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const paths = await getLearningPaths();
  return paths.length ? paths.map((p) => ({ slug: p.slug })) : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getLearningPath((await params).slug);
  return p ? { title: p.title, description: p.description } : { title: "Ruta no encontrada" };
}

export default function PathPage({ params }: Props) {
  return (
    <Suspense fallback={<Container className="py-12"><Skeleton className="h-12 w-2/3" /><Skeleton className="mt-6 h-96" /></Container>}>
      <PathView params={params} />
    </Suspense>
  );
}

async function PathView({ params }: Props) {
  const path = await getLearningPath((await params).slug);
  if (!path) notFound();
  return (
    <Container className="py-12">
      <Link href="/aprender" className="text-sm text-muted hover:text-link">← Rutas de aprendizaje</Link>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-accent">{DIFFICULTY_LABELS[path.difficulty]}</p>
      <h1 className="mt-2 font-display text-5xl font-semibold">{path.title}</h1>
      <p className="mt-3 max-w-2xl text-muted">{path.description}</p>
      <Suspense fallback={<StepList steps={path.steps} read={new Set()} />}>
        <StepsWithProgress steps={path.steps} />
      </Suspense>
    </Container>
  );
}

type Step = Awaited<ReturnType<typeof getLearningPath>> extends infer P ? (P extends { steps: (infer S)[] } ? S : never) : never;

async function StepsWithProgress({ steps }: { steps: Step[] }) {
  const read = await getReadArticleIds(steps.map((s) => s.articleId).filter(Boolean) as string[]);
  return <StepList steps={steps} read={read} />;
}

function StepList({ steps, read }: { steps: Step[]; read: Set<string> }) {
  return (
    <ol className="mt-10 space-y-3">
      {steps.map((s, i) => {
        const done = s.articleId ? read.has(s.articleId) : false;
        const inner = (
          <div className="flex items-start gap-4">
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-semibold ${done ? "border-accent bg-accent text-accent-fg" : "border-accent/40 text-accent"}`}>
              {done ? <Icon name="check" className="h-4 w-4" /> : i + 1}
            </span>
            <div>
              <p className="font-display text-xl font-semibold">{s.title}</p>
              {s.description && <p className="text-sm text-muted">{s.description}</p>}
              <p className="mt-1 text-xs text-muted">
                {s.articleSlug ? `${s.readingMinutes ?? "—"} min de lectura${done ? " · leído" : ""}` : "En preparación: aún no hay un artículo publicado para este paso."}
              </p>
            </div>
          </div>
        );
        return (
          <li key={s.id}>
            {s.articleSlug ? (
              <Link href={`/articulo/${s.articleSlug}`} className="block rounded-[var(--radius-card)] border border-line bg-surface p-5 hover:border-accent/60">{inner}</Link>
            ) : (
              <div className="rounded-[var(--radius-card)] border border-dashed border-line p-5 opacity-75">{inner}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
