import { Suspense } from "react";
import { AdminGate } from "@/components/admin/admin-gate";
import { ArticleEditor } from "@/components/admin/article-editor";
import { getCategoryOptions, getSourceOptions } from "@/server/queries/admin";
import { Skeleton } from "@/components/ui/primitives";

export default function NewArticle() {
  return (
    <>
      <h1 className="font-display text-4xl font-semibold">Nuevo artículo</h1>
      <p className="mt-1 text-sm text-muted">Se crea como borrador. Para publicarlo debe pasar por revisión y aprobación.</p>
      <Suspense fallback={<Skeleton className="mt-6 h-[40rem]" />}>
        <AdminGate permission="article:create" next="/admin/articulos/nuevo">
          {async () => {
            const [categories, sources] = await Promise.all([getCategoryOptions(), getSourceOptions()]);
            return <div className="mt-6"><ArticleEditor categories={categories} sources={sources} /></div>;
          }}
        </AdminGate>
      </Suspense>
    </>
  );
}
