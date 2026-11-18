import Link from "next/link";
import { Suspense } from "react";
import { z } from "zod";
import { AdminGate } from "@/components/admin/admin-gate";
import { SourceForm } from "@/components/admin/taxonomy-forms";
import { getSource, listSources } from "@/server/queries/admin";
import { Badge, Skeleton } from "@/components/ui/primitives";
import { REUSE_POLICY_LABELS, SOURCE_KIND_LABELS, SOURCE_VERIFICATION_LABELS } from "@/lib/labels";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default function SourcesAdmin({ searchParams }: { searchParams: SP }) {
  return (
    <>
      <h1 className="font-display text-4xl font-semibold">Fuentes</h1>
      <p className="mt-1 max-w-3xl text-sm text-muted">
        Cada fuente registra procedencia, licencia, uso permitido y fecha de consulta. Una fuente solo puede marcarse como
        verificada indicando cuándo se consultó.
      </p>
      <Suspense fallback={<Skeleton className="mt-6 h-96" />}>
        <AdminGate permission="source:manage" next="/admin/fuentes">
          {async () => {
            const sp = await searchParams;
            const editId = typeof sp.editar === "string" && z.uuid().safeParse(sp.editar).success ? sp.editar : null;
            const [rows, editing] = await Promise.all([listSources(), editId ? getSource(editId) : null]);
            return (
              <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_28rem]">
                <ul className="space-y-2">
                  {rows.map(({ source: s, usage }) => (
                    <li key={s.id} className="rounded-xl border border-line bg-surface p-4 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <p><span className="font-medium italic">{s.title}</span> <span className="text-muted">— {[s.authors, s.publisher ?? s.provider, s.year].filter(Boolean).join(", ")}</span></p>
                        <Link href={`/admin/fuentes?editar=${s.id}`} className="shrink-0 text-xs text-link">Editar</Link>
                      </div>
                      <p className="mt-2 flex flex-wrap gap-1.5">
                        <Badge>{SOURCE_KIND_LABELS[s.kind]}</Badge>
                        <Badge tone={s.verification === "verified" ? "ok" : "warn"}>{SOURCE_VERIFICATION_LABELS[s.verification]}</Badge>
                        <Badge>{REUSE_POLICY_LABELS[s.reusePolicy]}</Badge>
                        <Badge>Citada en {usage}</Badge>
                        <Badge>{s.ingestionMethod}</Badge>
                      </p>
                    </li>
                  ))}
                </ul>
                <section className="rounded-[var(--radius-card)] border border-line bg-surface p-5 xl:sticky xl:top-24 xl:self-start">
                  <h2 className="mb-3 font-display text-2xl font-semibold">{editing ? "Editar fuente" : "Registrar fuente"}</h2>
                  {editing && <Link href="/admin/fuentes" className="mb-3 inline-block text-xs text-link">+ Registrar una nueva en su lugar</Link>}
                  <SourceForm key={editing?.id ?? "new"} source={editing ?? undefined} />
                </section>
              </div>
            );
          }}
        </AdminGate>
      </Suspense>
    </>
  );
}
