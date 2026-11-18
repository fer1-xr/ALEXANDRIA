"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  clearHistoryAction,
  createCollectionAction,
  deleteBookmarkAction,
  deleteCollectionAction,
  deleteNoteAction,
  toggleCollectionItemAction,
  toggleFavoriteAction,
} from "@/server/actions/library";
import { initialFormState } from "@/server/actions/form-state";
import { buttonClass } from "@/components/ui/primitives";
import { inputClass } from "@/components/forms/fields";

type Kind = "note" | "bookmark" | "collection" | "favorite" | "history" | "collectionItem";

/** Botón de acción destructiva con confirmación. */
export function RemoveButton({ kind, id, secondId, label = "Quitar", confirmText }: { kind: Kind; id?: string; secondId?: string; label?: string; confirmText?: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirmText && !window.confirm(confirmText)) return;
        start(async () => {
          if (kind === "note") await deleteNoteAction(id!);
          else if (kind === "bookmark") await deleteBookmarkAction(id!);
          else if (kind === "favorite") await toggleFavoriteAction(id!);
          else if (kind === "history") await clearHistoryAction();
          else if (kind === "collectionItem") await toggleCollectionItemAction(id!, secondId!);
          else if (kind === "collection") {
            await deleteCollectionAction(id!);
            router.push("/mi-biblioteca#colecciones");
          }
        });
      }}
      className="text-xs text-muted hover:text-red-600 disabled:opacity-50"
    >
      {pending ? "…" : label}
    </button>
  );
}

export function NewCollectionForm() {
  const [state, action, pending] = useActionState(createCollectionAction, initialFormState);
  return (
    <form action={action} className="flex flex-col gap-2 sm:flex-row">
      <label htmlFor="col-name" className="sr-only">Nombre de la colección</label>
      <input id="col-name" name="name" required maxLength={120} placeholder="Nombre de la nueva colección" className={inputClass} />
      <label htmlFor="col-desc" className="sr-only">Descripción</label>
      <input id="col-desc" name="description" maxLength={500} placeholder="Descripción (opcional)" className={inputClass} />
      <button className={buttonClass("primary", "sm")} disabled={pending}>Crear</button>
      {state.errors?.name && <p className="text-xs text-red-600">{state.errors.name}</p>}
      {state.message && !state.ok && <p className="text-xs text-red-600">{state.message}</p>}
    </form>
  );
}
