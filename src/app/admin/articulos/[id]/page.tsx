import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { AdminGate } from "@/components/admin/admin-gate";
import { ArticleEditor } from "@/components/admin/article-editor";
import { RelationsPanel, WorkflowPanel } from "@/components/admin/workflow-panel";
import { getArticleForEdit, getArticleOptions, getCategoryOptions, getSourceOptions } from "@/server/queries/admin";
import { availableTransitions, publishBlockers } from "@/server/editorial/workflow";
import { can } from "@/server/auth/permissions";
import { db } from "@/server/db/client";
import { articleCategories } from "@/server/db/schema";
import { Skeleton } from "@/components/ui/primitives";
import { STATUS_LABELS } from "@/lib/labels";

type Props = { params: Promise<{ id: string }> };
const dt = new Intl.DateTimeFormat("es", { dateStyle: "short", timeStyle: "short", timeZone: "UTC" });

export default function EditArticle({ params }: Props) {
  return (
    <Suspense fallback={<Skeleton className="h-[40rem]" />}>
      <EditView params={params} />
    </Suspense>
  );
}

async function EditView({ params }: Props) {
  const { id } = await params;
  return (
    <AdminGate permission="article:edit" next={`/admin/articulos/${id}`}>
      {async (user) => {
        if (!z.uuid().safeParse(id).success) notFound();
        const a = await getArticleForEdit(id);
        if (!a) notFound();
        const [categories, sources, options, secondary] = await Promise.all([
          getCategoryOptions(),
          getSourceOptions(),
          getArticleOptions(),
          db.select({ id: articleCategories.categoryId }).from(articleCategories).where(eq(articleCategories.articleId, id)),
        ]);
        const blockers = publishBlockers({ sourceCount: a.sourceIds.length, summary: a.summary, content: a.content, notices: a.notices, reviewedAt: a.reviewedAt });
        return (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Link href="/admin/articulos" className="text-sm text-muted hover:text-link">← Artículos</Link>
                <h1 className="mt-2 font-display text-4xl font-semibold">{a.title}</h1>
              </div>
              {a.status === "published" && <Link href={`/articulo/${a.slug}`} className="text-sm text-link underline">Ver como lector ↗</Link>}
            </div>
            <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
              <ArticleEditor
                categories={categories}
                sources={sources}
                article={{ ...a, sourceIds: a.sourceIds, secondaryCategoryIds: secondary.map((s) => s.id) }}
              />
              <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
                <section className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
                  <WorkflowPanel
                    articleId={a.id}
                    status={a.status}
                    transitions={availableTransitions(user.role, a.status).map((t) => ({ to: t.to, label: t.label }))}
                    verification={a.verification}
                    canVerify={can(user.role, "article:verify")}
                    blockers={blockers}
                  />
                </section>
                <section className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Grafo de conocimiento</h2>
                  <RelationsPanel articleId={a.id} relations={a.relations} options={options} />
                </section>
                <section className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Historial de revisiones</h2>
                  <ol className="space-y-2 text-xs">
                    {a.revisions.map((r) => (
                      <li key={r.id}>
                        <span className="font-medium">v{r.version}</span> · {dt.format(r.createdAt)} · {r.author ?? "Sistema"}
                        {r.fromStatus !== r.toStatus && <span className="text-accent"> · {r.fromStatus ? STATUS_LABELS[r.fromStatus] : "—"} → {STATUS_LABELS[r.toStatus]}</span>}
                        {r.changeNote && <span className="block text-muted">{r.changeNote}</span>}
                      </li>
                    ))}
                  </ol>
                </section>
              </aside>
            </div>
          </>
        );
      }}
    </AdminGate>
  );
}
