import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";
import { requireUser } from "@/server/auth/guards";
import { getCollection } from "@/server/queries/library";
import { ArticleCard } from "@/components/article/article-card";
import { RemoveButton } from "@/components/library/library-actions";
import { Container, EmptyState, Skeleton } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Colección", robots: { index: false } };
type Props = { params: Promise<{ id: string }> };

export default function CollectionPage({ params }: Props) {
  return (
    <Container className="py-12">
      <Link href="/mi-biblioteca#colecciones" className="text-sm text-muted hover:text-link">← Mi biblioteca</Link>
      <Suspense fallback={<Skeleton className="mt-6 h-64" />}>
        <CollectionView params={params} />
      </Suspense>
    </Container>
  );
}

async function CollectionView({ params }: Props) {
  const { id } = await params;
  await requireUser(`/mi-biblioteca/colecciones/${id}`);
  if (!z.uuid().safeParse(id).success) notFound();
  const col = await getCollection(id);
  if (!col) notFound();
  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold">{col.name}</h1>
          {col.description && <p className="mt-2 text-muted">{col.description}</p>}
        </div>
        <RemoveButton kind="collection" id={col.id} label="Eliminar colección" confirmText="¿Eliminar esta colección? Los artículos no se borran." />
      </div>
      {col.items.length === 0 ? (
        <div className="mt-8"><EmptyState title="Colección vacía">Añade artículos desde el panel lateral de cada artículo.</EmptyState></div>
      ) : (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {col.items.map((a) => (
            <li key={a.id} className="relative">
              <ArticleCard article={a} variant="compact" />
              <div className="absolute right-3 top-2"><RemoveButton kind="collectionItem" id={col.id} secondId={a.id} /></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
