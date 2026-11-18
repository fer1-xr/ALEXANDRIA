import Link from "next/link";
import { Suspense } from "react";
import { AdminGate } from "@/components/admin/admin-gate";
import { listArticlesForAdmin } from "@/server/queries/admin";
import { Badge, Skeleton, buttonClass } from "@/components/ui/primitives";
import { inputClass } from "@/components/forms/fields";
import { STATUS_LABELS, VERIFICATION_LABELS } from "@/lib/labels";
import type { EditorialStatus } from "@/server/db/schema";

type SP = Promise<Record<string, string | string[] | undefined>>;
const dt = new Intl.DateTimeFormat("es", { dateStyle: "short", timeZone: "UTC" });
const STATUSES = Object.keys(STATUS_LABELS) as EditorialStatus[];

export default function ArticlesAdmin({ searchParams }: { searchParams: SP }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl font-semibold">Artículos</h1>
        <Link href="/admin/articulos/nuevo" className={buttonClass("primary", "sm")}>Nuevo artículo</Link>
      </div>
      <Suspense fallback={<Skeleton className="mt-6 h-96" />}>
        <AdminGate permission="article:edit" next="/admin/articulos">
          {async () => {
            const sp = await searchParams;
            const q = typeof sp.q === "string" ? sp.q.slice(0, 100) : "";
            const status = STATUSES.includes(sp.estado as EditorialStatus) ? (sp.estado as EditorialStatus) : undefined;
            const page = Math.max(1, Number(sp.pagina) || 1);
            const { rows, total, pageSize } = await listArticlesForAdmin({ q, status, page });
            return (
              <div className="mt-6">
                <form className="mb-4 flex flex-wrap gap-2" action="/admin/articulos">
                  <input name="q" defaultValue={q} placeholder="Buscar por título o slug" aria-label="Buscar" className={`${inputClass} max-w-xs`} />
                  <select name="estado" defaultValue={status ?? ""} aria-label="Estado" className={`${inputClass} max-w-[12rem]`}>
                    <option value="">Todos los estados</option>
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                  <button className={buttonClass("secondary", "sm")}>Filtrar</button>
                </form>
                <p className="mb-2 text-sm text-muted">{total} artículos</p>
                <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-2 text-left text-xs uppercase tracking-wider text-muted">
                      <tr><th className="px-4 py-2.5">Título</th><th className="px-4 py-2.5">Estado</th><th className="px-4 py-2.5">Verificación</th><th className="px-4 py-2.5">Fuentes</th><th className="px-4 py-2.5">Actualizado</th></tr>
                    </thead>
                    <tbody className="divide-y divide-line bg-surface">
                      {rows.map((r) => (
                        <tr key={r.id}>
                          <td className="px-4 py-2.5">
                            <Link href={`/admin/articulos/${r.id}`} className="font-medium text-link hover:underline">{r.title}</Link>
                            <span className="block text-xs text-muted">{r.categoryName} · {r.locale}{r.aiAssisted && " · asistido por IA"}</span>
                          </td>
                          <td className="px-4 py-2.5"><Badge tone={r.status === "published" ? "ok" : "neutral"}>{STATUS_LABELS[r.status]}</Badge></td>
                          <td className="px-4 py-2.5 text-xs">{VERIFICATION_LABELS[r.verification]}</td>
                          <td className="px-4 py-2.5 tabular-nums">{r.sourceCount}</td>
                          <td className="px-4 py-2.5 text-xs text-muted">{dt.format(r.updatedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {total > pageSize && (
                  <nav className="mt-4 flex justify-between text-sm" aria-label="Paginación">
                    {page > 1 ? <Link href={`/admin/articulos?q=${encodeURIComponent(q)}&estado=${status ?? ""}&pagina=${page - 1}`}>← Anterior</Link> : <span />}
                    {page * pageSize < total && <Link href={`/admin/articulos?q=${encodeURIComponent(q)}&estado=${status ?? ""}&pagina=${page + 1}`}>Siguiente →</Link>}
                  </nav>
                )}
              </div>
            );
          }}
        </AdminGate>
      </Suspense>
    </>
  );
}
