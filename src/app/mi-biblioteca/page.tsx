import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireUser } from "@/server/auth/guards";
import {
  getAllBookmarks,
  getAllNotes,
  getCollectionsWithCounts,
  getFavorites,
  getPathProgress,
  getPreferences,
  getRecentHistory,
} from "@/server/queries/library";
import { ArticleCard } from "@/components/article/article-card";
import { NewCollectionForm, RemoveButton } from "@/components/library/library-actions";
import { Container, EmptyState, Skeleton } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = { title: "Mi biblioteca", robots: { index: false } };

const SECTIONS = [
  ["progreso", "Progreso", "route"],
  ["favoritos", "Favoritos", "heart"],
  ["colecciones", "Colecciones", "folder"],
  ["notas", "Notas", "note"],
  ["marcadores", "Marcadores", "bookmark"],
  ["historial", "Historial", "history"],
] as const;

const dt = new Intl.DateTimeFormat("es", { dateStyle: "medium", timeZone: "UTC" });

export default function LibraryPage() {
  return (
    <Container wide className="py-12">
      <h1 className="font-display text-5xl font-semibold">Mi biblioteca</h1>
      <nav aria-label="Secciones de Mi biblioteca" className="mt-6 flex flex-wrap gap-2">
        {SECTIONS.map(([id, label, icon]) => (
          <a key={id} href={`#${id}`} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm hover:border-accent/60">
            <Icon name={icon} className="h-4 w-4 text-accent" /> {label}
          </a>
        ))}
      </nav>
      <Suspense fallback={<div className="mt-10 space-y-6"><Skeleton className="h-40" /><Skeleton className="h-40" /></div>}>
        <Library />
      </Suspense>
    </Container>
  );
}

function Section({ id, title, children, action }: { id: string; title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`h-${id}`} className="scroll-mt-24 border-t border-line pt-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 id={`h-${id}`} className="font-display text-3xl font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

async function Library() {
  const user = await requireUser("/mi-biblioteca");
  const [progress, favorites, collections, notes, bookmarks, history, prefs] = await Promise.all([
    getPathProgress(),
    getFavorites(),
    getCollectionsWithCounts(),
    getAllNotes(),
    getAllBookmarks(),
    getRecentHistory(50),
    getPreferences(),
  ]);
  return (
    <div className="mt-10 space-y-14">
      <p className="text-muted">Hola, {user.displayName}. Todo lo que guardes aquí es privado.</p>

      <Section id="progreso" title="Progreso">
        <div className="grid gap-4 md:grid-cols-2">
          {progress.map((p) => {
            const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
            return (
              <Link key={p.slug} href={`/aprender/${p.slug}`} className="rounded-[var(--radius-card)] border border-line bg-surface p-5 hover:border-accent/60">
                <p className="font-display text-xl font-semibold">{p.title}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Progreso en ${p.title}`}>
                  <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-1 text-xs text-muted">{p.done} de {p.total} lecturas · {pct} %</p>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section id="favoritos" title="Favoritos">
        {favorites.length === 0 ? (
          <EmptyState title="Aún no tienes favoritos">Usa «Guardar en favoritos» en cualquier artículo.</EmptyState>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((f) => (
              <li key={f.id} className="relative">
                <ArticleCard article={f} variant="compact" />
                <div className="absolute right-3 top-2"><RemoveButton kind="favorite" id={f.id} /></div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section id="colecciones" title="Colecciones">
        <div className="mb-5"><NewCollectionForm /></div>
        {collections.length === 0 ? (
          <EmptyState title="Sin colecciones">Agrupa artículos por temas, proyectos o cursos.</EmptyState>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c) => (
              <li key={c.id}>
                <Link href={`/mi-biblioteca/colecciones/${c.id}`} className="block rounded-[var(--radius-card)] border border-line bg-surface p-5 hover:border-accent/60">
                  <Icon name="folder" className="h-6 w-6 text-accent" />
                  <p className="mt-2 font-display text-xl font-semibold">{c.name}</p>
                  {c.description && <p className="text-sm text-muted">{c.description}</p>}
                  <p className="mt-2 text-xs text-muted">{c.itemCount} {c.itemCount === 1 ? "artículo" : "artículos"}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section id="notas" title="Notas privadas">
        {notes.length === 0 ? (
          <EmptyState title="Sin notas">Puedes escribir notas privadas desde el panel lateral de cada artículo.</EmptyState>
        ) : (
          <ul className="space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="rounded-[var(--radius-card)] border border-line bg-surface p-4">
                <div className="flex items-center justify-between gap-3 text-xs text-muted">
                  <Link href={`/articulo/${n.articleSlug}`} className="font-medium text-link">{n.articleTitle}</Link>
                  <span className="flex items-center gap-3">{dt.format(n.updatedAt)} <RemoveButton kind="note" id={n.id} label="Eliminar" confirmText="¿Eliminar esta nota?" /></span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm">{n.body}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section id="marcadores" title="Marcadores">
        {bookmarks.length === 0 ? (
          <EmptyState title="Sin marcadores">Marca secciones de los artículos para volver a ellas.</EmptyState>
        ) : (
          <ul className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface">
            {bookmarks.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <Link href={`/articulo/${b.articleSlug}#${b.anchor}`} className="hover:text-link">
                  <span className="font-medium">{b.articleTitle}</span> <span className="text-muted">› {b.label}</span>
                </Link>
                <RemoveButton kind="bookmark" id={b.id} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        id="historial"
        title="Historial"
        action={history && history.length > 0 ? <RemoveButton kind="history" label="Borrar todo el historial" confirmText="¿Borrar todo tu historial de lectura? También se reiniciará el progreso de las rutas." /> : undefined}
      >
        {prefs && !prefs.historyEnabled && (
          <p className="mb-4 text-sm text-muted">El registro del historial está desactivado. Puedes activarlo en <Link href="/cuenta/perfil" className="text-link underline">tus preferencias</Link>.</p>
        )}
        {!history || history.length === 0 ? (
          <EmptyState title="Historial vacío">Los artículos que leas aparecerán aquí.</EmptyState>
        ) : (
          <ul className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface">
            {history.map((h) => (
              <li key={h.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <Link href={`/articulo/${h.slug}`} className="font-medium hover:text-link">{h.title}</Link>
                <span className="text-xs text-muted">{dt.format(h.lastReadAt)} · {h.progress} % leído · {h.readCount} {h.readCount === 1 ? "visita" : "visitas"}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
