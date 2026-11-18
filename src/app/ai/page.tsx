import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { retrievePassages } from "@/server/ai/retrieval";
import { getLanguageModel } from "@/server/ai/providers";
import { Container, Skeleton, Badge } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { SOURCE_VERIFICATION_LABELS } from "@/lib/labels";

export const metadata: Metadata = {
  title: "ALEXANDRIA AI",
  description: "Pregunta a la biblioteca: respuestas apoyadas en pasajes de los artículos, con sus fuentes.",
};

type SP = Promise<Record<string, string | string[] | undefined>>;

const EXAMPLES = [
  "¿Quién construyó las pirámides de Giza?",
  "¿Por qué Plutón no es un planeta?",
  "¿Qué aportó Rosalind Franklin al descubrimiento del ADN?",
  "¿Qué lenguas son oficiales en Paraguay?",
];

export default function AiPage({ searchParams }: { searchParams: SP }) {
  const modelReady = getLanguageModel() !== null;
  return (
    <>
      <section className="relative overflow-hidden bg-night text-ivory">
        <div className="atlas-grid absolute inset-0" aria-hidden="true" />
        <Container className="relative py-14">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            <Icon name="spark" className="h-4 w-4" /> Asistente
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold">ALEXANDRIA AI</h1>
          <p className="mt-3 max-w-2xl text-ivory/75">
            Pregunta lo que quieras saber. El asistente busca en la biblioteca y te muestra los pasajes exactos que
            responden a tu pregunta, con enlace a la sección y a sus fuentes. Si la biblioteca no tiene información
            suficiente, te lo dice.
          </p>
          <Suspense fallback={<Skeleton className="mt-8 h-14 max-w-3xl rounded-full" />}>
            <AskForm searchParams={searchParams} />
          </Suspense>
        </Container>
      </section>
      <Container className="py-10">
        {!modelReady && (
          <div className="mb-8 flex gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-4 text-sm">
            <Icon name="info" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <p className="text-muted">
              <strong className="font-medium text-fg">Modo recuperación.</strong> Todavía no hay un modelo de lenguaje
              conectado, así que ALEXANDRIA AI no redacta respuestas: muestra los pasajes más pertinentes de la
              biblioteca. Las explicaciones por niveles, los resúmenes y los cuestionarios llegarán con la Fase 4.
            </p>
          </div>
        )}
        <Suspense fallback={<div className="space-y-4"><Skeleton className="h-28" /><Skeleton className="h-28" /></div>}>
          <Answer searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function getQuestion(searchParams: SP) {
  const raw = (await searchParams).q;
  return (Array.isArray(raw) ? raw[0] : raw)?.trim().slice(0, 300) ?? "";
}

async function AskForm({ searchParams }: { searchParams: SP }) {
  const q = await getQuestion(searchParams);
  return (
    <form action="/ai" method="get" className="mt-8 flex max-w-3xl items-center gap-3 rounded-full border border-ivory/20 bg-ivory px-5 py-3 text-night">
      <Icon name="spark" className="h-5 w-5 shrink-0 text-gold-deep" />
      <label htmlFor="ai-q" className="sr-only">Tu pregunta</label>
      <input id="ai-q" name="q" defaultValue={q} required maxLength={300} placeholder="Escribe tu pregunta…" className="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-night/50" />
      <button className="rounded-full bg-night px-4 py-1.5 text-sm font-medium text-ivory">Preguntar</button>
    </form>
  );
}

async function Answer({ searchParams }: { searchParams: SP }) {
  const q = await getQuestion(searchParams);
  if (!q) {
    return (
      <div>
        <p className="text-sm font-medium">Prueba con alguna de estas preguntas:</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {EXAMPLES.map((e) => (
            <li key={e}>
              <Link href={`/ai?q=${encodeURIComponent(e)}`} className="block rounded-xl border border-line bg-surface px-4 py-3 hover:border-accent/60">{e}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  let result;
  try {
    result = await retrievePassages(q);
  } catch (err) {
    console.error("[ai]", err);
    return <p className="rounded-xl border border-red-600/30 p-4 text-sm">El asistente no está disponible en este momento. Inténtalo de nuevo en unos minutos.</p>;
  }

  if (!result.sufficient) {
    return (
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
        <p className="font-display text-2xl font-semibold">La biblioteca aún no tiene información suficiente</p>
        <p className="mt-2 text-muted">
          No encontramos pasajes que respondan a «{q}» con suficiente fiabilidad. Preferimos decirlo antes que
          inventar una respuesta. Prueba a <Link href={`/buscar?q=${encodeURIComponent(q)}`} className="text-link underline">buscar términos relacionados</Link> o explora las ramas del conocimiento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section aria-labelledby="pasajes">
        <h2 id="pasajes" className="font-display text-3xl font-semibold">Lo que dice la biblioteca</h2>
        <p className="mt-1 text-sm text-muted">Pasajes ordenados por pertinencia para «{q}».</p>
        <ol className="mt-6 space-y-4">
          {result.passages.map((p, i) => (
            <li key={`${p.articleSlug}-${p.anchor ?? i}`} className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
              <p className="flex flex-wrap items-center gap-2 text-xs">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-[0.7rem] font-semibold text-accent-fg">{i + 1}</span>
                <Link href={`/articulo/${p.articleSlug}${p.anchor ? `#${p.anchor}` : ""}`} className="font-semibold text-link hover:underline">
                  {p.articleTitle}{p.heading ? ` › ${p.heading}` : " › Resumen"}
                </Link>
                {p.aiAssisted && p.verification === "unverified" && <Badge tone="warn">Sin verificación humana</Badge>}
              </p>
              <blockquote className="mt-3 border-l-2 border-accent/50 pl-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: `…${p.excerptHtml}…` }} />
            </li>
          ))}
        </ol>
      </section>
      <aside aria-labelledby="fuentes-ai">
        <h2 id="fuentes-ai" className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Fuentes de esos artículos</h2>
        <ul className="mt-3 space-y-3 text-sm">
          {result.sources.map((s) => (
            <li key={s.id} className="rounded-lg border border-line bg-surface p-3">
              {s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="font-medium italic text-link underline">{s.title}</a> : <span className="font-medium italic">{s.title}</span>}
              <p className="text-xs text-muted">{[s.authors, s.year].filter(Boolean).join(", ")}</p>
              <p className="mt-1 text-xs text-muted">{SOURCE_VERIFICATION_LABELS[s.verification as keyof typeof SOURCE_VERIFICATION_LABELS]} · citada en {s.usedBy.join(", ")}</p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
