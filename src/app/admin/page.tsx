import Link from "next/link";
import { Suspense } from "react";
import { AdminGate } from "@/components/admin/admin-gate";
import { getDashboardStats, listAudit } from "@/server/queries/admin";
import { Skeleton, buttonClass } from "@/components/ui/primitives";
import { STATUS_LABELS } from "@/lib/labels";

const dt = new Intl.DateTimeFormat("es", { dateStyle: "short", timeStyle: "short", timeZone: "UTC" });

export default function AdminHome() {
  return (
    <>
      <h1 className="font-display text-4xl font-semibold">Panel editorial</h1>
      <Suspense fallback={<Skeleton className="mt-6 h-96" />}>
        <AdminGate permission="admin:access" next="/admin">
          {async (user) => {
            const s = await getDashboardStats();
            const recent = user.role === "admin" ? await listAudit(8) : [];
            const cards: [string, number, string][] = [
              [STATUS_LABELS.draft, s.draft, "/admin/articulos?estado=draft"],
              [STATUS_LABELS.in_review, s.in_review, "/admin/articulos?estado=in_review"],
              [STATUS_LABELS.approved, s.approved, "/admin/articulos?estado=approved"],
              [STATUS_LABELS.published, s.published, "/admin/articulos?estado=published"],
              [STATUS_LABELS.archived, s.archived, "/admin/articulos?estado=archived"],
            ];
            return (
              <div className="mt-6 space-y-8">
                <div className="flex flex-wrap gap-3">
                  <Link href="/admin/articulos/nuevo" className={buttonClass()}>Nuevo artículo</Link>
                  <Link href="/admin/fuentes" className={buttonClass("secondary")}>Registrar fuente</Link>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {cards.map(([label, n, href]) => (
                    <Link key={label} href={href} className="rounded-[var(--radius-card)] border border-line bg-surface p-4 hover:border-accent/60">
                      <p className="font-display text-4xl font-semibold text-accent">{n}</p>
                      <p className="text-sm text-muted">{label}</p>
                    </Link>
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Alert n={s.unverified} text="artículos publicados sin verificación humana" href="/admin/articulos?estado=published" />
                  <Alert n={s.sources_pending} text="fuentes pendientes de verificación" href="/admin/fuentes" />
                  <Alert n={s.media_pending} text="recursos multimedia con derechos pendientes" href="/admin/multimedia" />
                </div>
                {recent.length > 0 && (
                  <section>
                    <h2 className="font-display text-2xl font-semibold">Actividad reciente</h2>
                    <ul className="mt-3 divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface text-sm">
                      {recent.map((r) => (
                        <li key={r.id} className="flex justify-between gap-3 px-4 py-2.5"><span><strong className="font-medium">{r.actor ?? "Sistema"}</strong> · {r.action}</span><span className="text-xs text-muted">{dt.format(r.createdAt)} UTC</span></li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            );
          }}
        </AdminGate>
      </Suspense>
    </>
  );
}

function Alert({ n, text, href }: { n: number; text: string; href: string }) {
  return (
    <Link href={href} className={`rounded-[var(--radius-card)] border p-4 text-sm ${n ? "border-amber-600/40 bg-amber-500/5" : "border-line bg-surface"}`}>
      <span className="font-display text-2xl font-semibold">{n}</span> <span className="text-muted">{text}</span>
    </Link>
  );
}
