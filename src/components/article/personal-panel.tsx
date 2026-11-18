"use client";

import Link from "next/link";
import { useActionState, useOptimistic, useState, useTransition } from "react";
import {
  addNoteAction,
  createCollectionAction,
  deleteNoteAction,
  toggleBookmarkAction,
  toggleCollectionItemAction,
  toggleFavoriteAction,
} from "@/server/actions/library";
import { initialFormState } from "@/server/actions/form-state";
import type { TocEntry } from "@/server/content/markdown";
import { Icon } from "@/components/ui/icon";
import { buttonClass, cx } from "@/components/ui/primitives";

export type ArticleUserState = {
  isFavorite: boolean;
  notes: { id: string; body: string; updatedAt: Date }[];
  bookmarks: { id: string; anchor: string; label: string }[];
  collections: { id: string; name: string; contains: boolean }[];
};

/** Invitación para visitantes sin cuenta. */
export function GuestPanel({ next }: { next: string }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-4 text-sm">
      <p className="font-medium">Tu biblioteca personal</p>
      <p className="mt-1 text-muted">Guarda favoritos, marcadores, notas privadas y colecciones.</p>
      <div className="mt-3 flex gap-2">
        <Link href={`/cuenta/ingresar?next=${encodeURIComponent(next)}`} className={buttonClass("primary", "sm")}>Ingresar</Link>
        <Link href={`/cuenta/registro?next=${encodeURIComponent(next)}`} className={buttonClass("secondary", "sm")}>Crear cuenta</Link>
      </div>
    </div>
  );
}

export function FavoriteButton({ articleId, initial }: { articleId: string; initial: boolean }) {
  const [fav, setFav] = useOptimistic(initial);
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      aria-pressed={fav}
      onClick={() =>
        start(async () => {
          setFav(!fav);
          await toggleFavoriteAction(articleId);
        })
      }
      className={cx(buttonClass(fav ? "primary" : "secondary", "sm"), "w-full")}
    >
      <Icon name="heart" className="h-4 w-4" /> {fav ? "En favoritos" : "Guardar en favoritos"}
    </button>
  );
}

export function PersonalPanel({ articleId, toc, state }: { articleId: string; toc: TocEntry[]; state: ArticleUserState }) {
  return (
    <div className="space-y-4">
      <FavoriteButton articleId={articleId} initial={state.isFavorite} />
      <CollectionsPicker articleId={articleId} collections={state.collections} />
      <Bookmarks articleId={articleId} toc={toc} bookmarks={state.bookmarks} />
      <Notes articleId={articleId} notes={state.notes} />
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-[var(--radius-card)] border border-line bg-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium">
        <span className="flex items-center gap-2">
          <Icon name={icon} className="h-4 w-4 text-accent" /> {title}
        </span>
        <Icon name="chevronDown" className="h-4 w-4 transition group-open:rotate-180" />
      </summary>
      <div className="border-t border-line px-4 py-3 text-sm">{children}</div>
    </details>
  );
}

function CollectionsPicker({ articleId, collections }: { articleId: string; collections: ArticleUserState["collections"] }) {
  const [pending, start] = useTransition();
  const [state, formAction, creating] = useActionState(createCollectionAction, initialFormState);
  const count = collections.filter((c) => c.contains).length;
  return (
    <Panel title={count ? `En ${count} ${count === 1 ? "colección" : "colecciones"}` : "Añadir a una colección"} icon="folder">
      {collections.length > 0 && (
        <ul className="mb-3 space-y-1.5">
          {collections.map((c) => (
            <li key={c.id}>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked={c.contains}
                  disabled={pending}
                  onChange={() => start(async () => void (await toggleCollectionItemAction(c.id, articleId)))}
                  className="accent-[var(--accent)]"
                />
                {c.name}
              </label>
            </li>
          ))}
        </ul>
      )}
      <form action={formAction} className="flex gap-2">
        <input type="hidden" name="articleId" value={articleId} />
        <input
          name="name"
          required
          maxLength={120}
          placeholder="Nueva colección"
          aria-label="Nombre de la nueva colección"
          className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-2.5 py-1.5"
        />
        <button className={buttonClass("secondary", "sm")} disabled={creating}>Crear</button>
      </form>
      {state.errors?.name && <p className="mt-1 text-xs text-red-600">{state.errors.name}</p>}
      {state.message && <p className="mt-1 text-xs text-muted" role="status">{state.message}</p>}
    </Panel>
  );
}

function Bookmarks({ articleId, toc, bookmarks }: { articleId: string; toc: TocEntry[]; bookmarks: ArticleUserState["bookmarks"] }) {
  const [pending, start] = useTransition();
  const [marked, setMarked] = useState(() => new Set(bookmarks.map((b) => b.anchor)));
  if (!toc.length) return null;
  return (
    <Panel title={marked.size ? `${marked.size} marcadores` : "Marcadores"} icon="bookmark">
      <p className="mb-2 text-xs text-muted">Marca secciones para volver a ellas desde Mi biblioteca.</p>
      <ul className="space-y-1">
        {toc
          .filter((t) => t.level === 2)
          .map((t) => {
            const on = marked.has(t.id);
            return (
              <li key={t.id} className="flex items-center justify-between gap-2">
                <a href={`#${t.id}`} className="truncate hover:text-link">{t.text}</a>
                <button
                  type="button"
                  disabled={pending}
                  aria-pressed={on}
                  aria-label={on ? `Quitar marcador de ${t.text}` : `Marcar ${t.text}`}
                  onClick={() =>
                    start(async () => {
                      const r = await toggleBookmarkAction(articleId, t.id, t.text);
                      setMarked((prev) => {
                        const n = new Set(prev);
                        if (r.bookmarked) n.add(t.id);
                        else n.delete(t.id);
                        return n;
                      });
                    })
                  }
                  className={cx("shrink-0 rounded p-1", on ? "text-accent" : "text-muted hover:text-fg")}
                >
                  <Icon name="bookmark" className="h-4 w-4" />
                </button>
              </li>
            );
          })}
      </ul>
    </Panel>
  );
}

function Notes({ articleId, notes }: { articleId: string; notes: ArticleUserState["notes"] }) {
  const [state, formAction, saving] = useActionState(addNoteAction, initialFormState);
  const [pending, start] = useTransition();
  return (
    <Panel title={notes.length ? `Mis notas (${notes.length})` : "Notas privadas"} icon="note">
      <form action={formAction} className="space-y-2">
        <input type="hidden" name="articleId" value={articleId} />
        <label htmlFor="note-body" className="sr-only">Nueva nota</label>
        <textarea
          id="note-body"
          name="body"
          required
          maxLength={5000}
          rows={3}
          placeholder="Escribe una nota privada sobre este artículo…"
          className="w-full rounded-lg border border-line bg-bg px-2.5 py-2"
        />
        <button className={buttonClass("secondary", "sm")} disabled={saving}>{saving ? "Guardando…" : "Guardar nota"}</button>
        {state.errors?.body && <p className="text-xs text-red-600">{state.errors.body}</p>}
      </form>
      {notes.length > 0 && (
        <ul className="mt-3 space-y-2">
          {notes.map((n) => (
            <li key={n.id} className="rounded-lg bg-surface-2 p-2.5">
              <p className="whitespace-pre-wrap">{n.body}</p>
              <div className="mt-1 flex items-center justify-between text-xs text-muted">
                <time dateTime={new Date(n.updatedAt).toISOString()}>{new Date(n.updatedAt).toLocaleDateString("es")}</time>
                <button type="button" disabled={pending} onClick={() => start(() => deleteNoteAction(n.id))} className="hover:text-red-600">
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
