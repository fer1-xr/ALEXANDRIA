import { Suspense } from "react";
import { AdminGate } from "@/components/admin/admin-gate";
import { MediaForm, MediaRightsSelect } from "@/components/admin/taxonomy-forms";
import { listMedia } from "@/server/queries/admin";
import { EmptyState, Skeleton } from "@/components/ui/primitives";
import { MEDIA_KIND_LABELS } from "@/lib/labels";

export default function MediaAdmin() {
  return (
    <>
      <h1 className="font-display text-4xl font-semibold">Multimedia</h1>
      <p className="mt-1 max-w-3xl text-sm text-muted">
        Registro centralizado de recursos con procedencia, autor, licencia y condiciones de uso. Un recurso con derechos
        pendientes o rechazados no debe mostrarse al público. La subida directa de archivos a almacenamiento S3 se
        habilitará al configurar el object storage (ver ROADMAP.md); por ahora se registran URLs.
      </p>
      <Suspense fallback={<Skeleton className="mt-6 h-96" />}>
        <AdminGate permission="media:manage" next="/admin/multimedia">
          {async () => {
            const media = await listMedia();
            return (
              <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_28rem]">
                {media.length === 0 ? (
                  <EmptyState title="Aún no hay recursos registrados">Registra imágenes, vídeos, mapas o modelos 3D con su licencia verificada.</EmptyState>
                ) : (
                  <ul className="space-y-2">
                    {media.map((m) => (
                      <li key={m.id} className="rounded-xl border border-line bg-surface p-4 text-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{m.title} <span className="text-xs text-muted">· {MEDIA_KIND_LABELS[m.kind]}</span></p>
                            <p className="text-xs text-muted">{[m.author, m.provider, m.license].filter(Boolean).join(" · ")}</p>
                            {m.originalUrl && <a href={m.originalUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-xs text-link underline">Procedencia ↗</a>}
                          </div>
                          <MediaRightsSelect id={m.id} value={m.rightsStatus} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <section className="rounded-[var(--radius-card)] border border-line bg-surface p-5 xl:sticky xl:top-24 xl:self-start">
                  <h2 className="mb-3 font-display text-2xl font-semibold">Registrar recurso</h2>
                  <MediaForm />
                </section>
              </div>
            );
          }}
        </AdminGate>
      </Suspense>
    </>
  );
}
