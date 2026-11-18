import { Suspense } from "react";
import { AdminGate } from "@/components/admin/admin-gate";
import { CategoryForm, CategoryRow } from "@/components/admin/taxonomy-forms";
import { getCategoryOptions } from "@/server/queries/admin";
import { can } from "@/server/auth/permissions";
import { Skeleton } from "@/components/ui/primitives";

export default function CategoriesAdmin() {
  return (
    <>
      <h1 className="font-display text-4xl font-semibold">Categorías</h1>
      <p className="mt-1 text-sm text-muted">La taxonomía es jerárquica: al mover o renombrar una rama se actualizan las rutas de todas sus subramas.</p>
      <Suspense fallback={<Skeleton className="mt-6 h-96" />}>
        <AdminGate permission="category:manage" next="/admin/categorias">
          {async (user) => {
            const cats = await getCategoryOptions();
            const canArchive = can(user.role, "category:archive");
            return (
              <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_24rem]">
                <ul className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface px-4 py-2">
                  {cats.map((c) => <CategoryRow key={c.id} category={c} categories={cats} canArchive={canArchive} archived={Boolean(c.archivedAt)} />)}
                </ul>
                <section className="rounded-[var(--radius-card)] border border-line bg-surface p-5 xl:sticky xl:top-24 xl:self-start">
                  <h2 className="mb-3 font-display text-2xl font-semibold">Nueva rama</h2>
                  <CategoryForm categories={cats} />
                </section>
              </div>
            );
          }}
        </AdminGate>
      </Suspense>
    </>
  );
}
