"use client";

import { useActionState, useState, useTransition } from "react";
import { addRelationAction, removeRelationAction, transitionArticleAction, verifyArticleAction } from "@/server/actions/admin/articles";
import { initialFormState } from "@/server/actions/form-state";
import { buttonClass } from "@/components/ui/primitives";
import { inputClass } from "@/components/forms/fields";
import { RELATION_LABELS, STATUS_LABELS, VERIFICATION_LABELS } from "@/lib/labels";
import type { EditorialStatus } from "@/server/db/schema";

export function WorkflowPanel({
  articleId,
  status,
  transitions,
  verification,
  canVerify,
  blockers,
}: {
  articleId: string;
  status: EditorialStatus;
  transitions: { to: EditorialStatus; label: string }[];
  verification: keyof typeof VERIFICATION_LABELS;
  canVerify: boolean;
  blockers: string[];
}) {
  const [pending, start] = useTransition();
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted">Estado editorial</p>
        <p className="mt-1 font-display text-2xl font-semibold">{STATUS_LABELS[status]}</p>
        <ol className="mt-2 flex flex-wrap items-center gap-1 text-[0.7rem] text-muted" aria-label="Flujo editorial">
          {(["draft", "in_review", "approved", "published", "archived"] as const).map((s, i) => (
            <li key={s} className={s === status ? "font-semibold text-accent" : ""}>{i > 0 && "→ "}{STATUS_LABELS[s]}</li>
          ))}
        </ol>
      </div>
      {transitions.length > 0 && (
        <div className="space-y-2">
          <label htmlFor="tnote" className="sr-only">Nota de la transición</label>
          <input id="tnote" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nota (opcional)" className={`${inputClass} text-sm`} maxLength={500} />
          <div className="flex flex-wrap gap-2">
            {transitions.map((t) => (
              <button
                key={t.to}
                type="button"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    const r = await transitionArticleAction(articleId, t.to, note);
                    setMessage({ ok: r.ok, text: r.message });
                    if (r.ok) setNote("");
                  })
                }
                className={buttonClass(t.to === "published" ? "primary" : "secondary", "sm")}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {status === "approved" && blockers.length > 0 && (
        <ul className="list-disc space-y-1 rounded-lg border border-amber-600/30 bg-amber-500/5 p-3 pl-6 text-xs">
          {blockers.map((b) => <li key={b}>{b}</li>)}
        </ul>
      )}
      <div className="border-t border-line pt-4">
        <p className="text-xs uppercase tracking-wider text-muted">Verificación humana</p>
        <p className="mt-1 text-sm font-medium">{VERIFICATION_LABELS[verification]}</p>
        {canVerify && (
          <div className="mt-2 flex flex-wrap gap-2">
            {(["editor_reviewed", "expert_verified", "unverified"] as const)
              .filter((l) => l !== verification)
              .map((l) => (
                <button
                  key={l}
                  type="button"
                  disabled={pending}
                  onClick={() => start(async () => {
                    const r = await verifyArticleAction(articleId, l);
                    setMessage({ ok: r.ok, text: r.message });
                  })}
                  className={buttonClass("ghost", "sm")}
                >
                  Marcar: {VERIFICATION_LABELS[l]}
                </button>
              ))}
          </div>
        )}
        <p className="mt-2 text-xs text-muted">Márcalo solo tras contrastar el texto con sus fuentes. Cualquier cambio posterior del contenido restablece la verificación.</p>
      </div>
      {message && <p role="status" className={`text-sm ${message.ok ? "text-emerald-700 dark:text-emerald-300" : "text-red-600"}`}>{message.text}</p>}
    </div>
  );
}

export function RelationsPanel({
  articleId,
  relations,
  options,
}: {
  articleId: string;
  relations: { id: string; type: keyof typeof RELATION_LABELS; description: string | null; toTitle: string; toSlug: string }[];
  options: { id: string; title: string }[];
}) {
  const [state, action, saving] = useActionState(addRelationAction, initialFormState);
  const [pending, start] = useTransition();
  return (
    <div className="space-y-3 text-sm">
      {relations.length === 0 ? (
        <p className="text-muted">Sin relaciones salientes.</p>
      ) : (
        <ul className="space-y-1.5">
          {relations.map((r) => (
            <li key={r.id} className="flex items-start justify-between gap-2">
              <span><span className="text-muted">{RELATION_LABELS[r.type]}</span> <strong className="font-medium">{r.toTitle}</strong>{r.description && <span className="block text-xs text-muted">{r.description}</span>}</span>
              <button type="button" disabled={pending} onClick={() => start(() => removeRelationAction(r.id))} className="text-xs text-muted hover:text-red-600">Quitar</button>
            </li>
          ))}
        </ul>
      )}
      <form action={action} className="space-y-2 border-t border-line pt-3">
        <input type="hidden" name="fromId" value={articleId} />
        <label htmlFor="rel-type" className="sr-only">Tipo de relación</label>
        <select id="rel-type" name="type" className={`${inputClass} text-sm`} defaultValue="related">
          {Object.entries(RELATION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}…</option>)}
        </select>
        <label htmlFor="rel-to" className="sr-only">Artículo relacionado</label>
        <select id="rel-to" name="toId" required className={`${inputClass} text-sm`} defaultValue="">
          <option value="" disabled>Artículo destino…</option>
          {options.filter((o) => o.id !== articleId).map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
        </select>
        <input name="description" maxLength={500} placeholder="Justificación (opcional)" className={`${inputClass} text-sm`} aria-label="Justificación" />
        <button className={buttonClass("secondary", "sm")} disabled={saving}>Añadir relación</button>
        {state.message && <p className="text-xs text-muted" role="status">{state.message}</p>}
      </form>
    </div>
  );
}
