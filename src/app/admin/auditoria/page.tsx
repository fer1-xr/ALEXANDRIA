import { Suspense } from "react";
import { AdminGate } from "@/components/admin/admin-gate";
import { listAudit } from "@/server/queries/admin";
import { Skeleton } from "@/components/ui/primitives";

const dt = new Intl.DateTimeFormat("es", { dateStyle: "short", timeStyle: "medium", timeZone: "UTC" });

export default function AuditAdmin() {
  return (
    <>
      <h1 className="font-display text-4xl font-semibold">Registro de auditoría</h1>
      <p className="mt-1 text-sm text-muted">Toda acción administrativa queda registrada. La aplicación no permite modificar ni borrar este registro.</p>
      <Suspense fallback={<Skeleton className="mt-6 h-96" />}>
        <AdminGate permission="audit:read" next="/admin/auditoria">
          {async () => {
            const rows = await listAudit(200);
            return (
              <div className="mt-6 overflow-x-auto rounded-[var(--radius-card)] border border-line">
                <table className="w-full text-sm">
                  <thead className="bg-surface-2 text-left text-xs uppercase tracking-wider text-muted">
                    <tr><th className="px-4 py-2.5">Fecha (UTC)</th><th className="px-4 py-2.5">Quién</th><th className="px-4 py-2.5">Acción</th><th className="px-4 py-2.5">Entidad</th><th className="px-4 py-2.5">Detalles</th></tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-surface">
                    {rows.map((r) => (
                      <tr key={r.id}>
                        <td className="whitespace-nowrap px-4 py-2 text-xs">{dt.format(r.createdAt)}</td>
                        <td className="px-4 py-2">{r.actor ?? "—"}</td>
                        <td className="px-4 py-2 font-mono text-xs">{r.action}</td>
                        <td className="px-4 py-2 text-xs">{r.entityType} <span className="text-muted">{r.entityId?.slice(0, 8)}</span></td>
                        <td className="max-w-xs truncate px-4 py-2 font-mono text-xs text-muted" title={JSON.stringify(r.details)}>{JSON.stringify(r.details)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }}
        </AdminGate>
      </Suspense>
    </>
  );
}
