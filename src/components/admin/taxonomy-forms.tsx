"use client";

import { useActionState, useTransition, useState } from "react";
import {
  saveCategoryAction,
  saveMediaAction,
  saveSourceAction,
  setCategoryArchivedAction,
  setMediaRightsAction,
  setUserDisabledAction,
  setUserRoleAction,
} from "@/server/actions/admin/taxonomy";
import { initialFormState } from "@/server/actions/form-state";
import { Field, FormMessage, inputClass } from "@/components/forms/fields";
import { buttonClass } from "@/components/ui/primitives";
import { MEDIA_KIND_LABELS, REUSE_POLICY_LABELS, ROLE_LABELS, SOURCE_KIND_LABELS, SOURCE_VERIFICATION_LABELS } from "@/lib/labels";
import type { Source } from "@/server/db/schema";

type Cat = { id: string; name: string; slug: string; path: string; depth: number; parentId: string | null; sortOrder: number; description: string | null; icon: string | null };

export function CategoryForm({ categories, category, onDone }: { categories: Cat[]; category?: Cat; onDone?: () => void }) {
  const [state, action, pending] = useActionState(saveCategoryAction, initialFormState);
  const e = state.errors ?? {};
  return (
    <form action={action} className="space-y-3">
      {category && <input type="hidden" name="id" value={category.id} />}
      <FormMessage message={state.message} ok={state.ok} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nombre" name="name" required defaultValue={category?.name} error={e.name} />
        <Field label="Slug" name="slug" required defaultValue={category?.slug} error={e.slug} hint="Minúsculas y guiones." />
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_7rem_8rem]">
        <div>
          <label htmlFor={`parent-${category?.id ?? "new"}`} className="mb-1.5 block text-sm font-medium">Rama superior</label>
          <select id={`parent-${category?.id ?? "new"}`} name="parentId" defaultValue={category?.parentId ?? ""} className={inputClass}>
            <option value="">(Rama principal)</option>
            {categories.filter((c) => c.id !== category?.id && !(category && c.path.startsWith(`${category.path}/`))).map((c) => (
              <option key={c.id} value={c.id}>{"— ".repeat(c.depth)}{c.name}</option>
            ))}
          </select>
          {e.parentId && <p className="mt-1 text-xs text-red-600">{e.parentId}</p>}
        </div>
        <Field label="Orden" name="sortOrder" type="number" min={0} defaultValue={category?.sortOrder ?? 0} />
        <Field label="Icono" name="icon" defaultValue={category?.icon ?? ""} />
      </div>
      <div>
        <label htmlFor={`desc-${category?.id ?? "new"}`} className="mb-1.5 block text-sm font-medium">Descripción</label>
        <textarea id={`desc-${category?.id ?? "new"}`} name="description" rows={2} maxLength={1000} defaultValue={category?.description ?? ""} className={inputClass} />
      </div>
      <div className="flex gap-2">
        <button className={buttonClass("primary", "sm")} disabled={pending}>{category ? "Guardar" : "Crear rama"}</button>
        {onDone && <button type="button" onClick={onDone} className={buttonClass("ghost", "sm")}>Cerrar</button>}
      </div>
    </form>
  );
}

export function CategoryRow({ category, categories, canArchive, archived }: { category: Cat; categories: Cat[]; canArchive: boolean; archived: boolean }) {
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  return (
    <li className="py-1.5" style={{ paddingLeft: `${category.depth * 1.25}rem` }}>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className={archived ? "text-muted line-through" : ""}>
          {category.name} <span className="text-xs text-muted">/{category.path}</span>
        </span>
        <span className="flex shrink-0 gap-3 text-xs">
          <button type="button" onClick={() => setEditing(!editing)} className="text-link">Editar</button>
          {canArchive && (
            <button type="button" disabled={pending} onClick={() => start(async () => void (await setCategoryArchivedAction(category.id, !archived)))} className="text-muted hover:text-red-600">
              {archived ? "Restaurar" : "Archivar"}
            </button>
          )}
        </span>
      </div>
      {editing && <div className="mt-2 rounded-xl border border-line bg-surface p-4"><CategoryForm categories={categories} category={category} onDone={() => setEditing(false)} /></div>}
    </li>
  );
}

export function SourceForm({ source }: { source?: Source }) {
  const [state, action, pending] = useActionState(saveSourceAction, initialFormState);
  const e = state.errors ?? {};
  const v = (k: string, f: string | number | null | undefined) => state.values?.[k] ?? (f == null ? "" : String(f));
  return (
    <form action={action} className="space-y-3">
      {source && <input type="hidden" name="id" value={source.id} />}
      <FormMessage message={state.message} ok={state.ok} />
      <div className="grid gap-3 sm:grid-cols-[12rem_1fr]">
        <div>
          <label htmlFor="kind" className="mb-1.5 block text-sm font-medium">Tipo</label>
          <select id="kind" name="kind" defaultValue={v("kind", source?.kind ?? "book")} className={inputClass}>
            {Object.entries(SOURCE_KIND_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </div>
        <Field label="Título" name="title" required defaultValue={v("title", source?.title)} error={e.title} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Autoría" name="authors" defaultValue={v("authors", source?.authors)} />
        <Field label="Editorial / revista" name="publisher" defaultValue={v("publisher", source?.publisher)} />
        <Field label="Año" name="year" type="number" defaultValue={v("year", source?.year)} error={e.year} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="URL" name="url" type="url" defaultValue={v("url", source?.url)} error={e.url} />
        <Field label="DOI" name="doi" defaultValue={v("doi", source?.doi)} />
        <Field label="ISBN" name="isbn" defaultValue={v("isbn", source?.isbn)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Proveedor o institución" name="provider" defaultValue={v("provider", source?.provider)} />
        <Field label="Licencia" name="license" defaultValue={v("license", source?.license)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="reusePolicy" className="mb-1.5 block text-sm font-medium">Uso permitido</label>
          <select id="reusePolicy" name="reusePolicy" defaultValue={v("reusePolicy", source?.reusePolicy ?? "external_link")} className={inputClass}>
            {Object.entries(REUSE_POLICY_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="verification" className="mb-1.5 block text-sm font-medium">Verificación</label>
          <select id="verification" name="verification" defaultValue={v("verification", source?.verification ?? "pending")} className={inputClass}>
            {Object.entries(SOURCE_VERIFICATION_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </div>
        <Field label="Fecha de consulta" name="accessedAt" type="date" defaultValue={v("accessedAt", source?.accessedAt)} error={e.accessedAt} />
      </div>
      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">Notas</label>
        <textarea id="notes" name="notes" rows={2} defaultValue={v("notes", source?.notes)} className={inputClass} />
      </div>
      <button className={buttonClass("primary", "sm")} disabled={pending}>{source ? "Guardar fuente" : "Registrar fuente"}</button>
    </form>
  );
}

export function MediaForm() {
  const [state, action, pending] = useActionState(saveMediaAction, initialFormState);
  const e = state.errors ?? {};
  const v = (k: string) => state.values?.[k] ?? "";
  return (
    <form action={action} className="space-y-3">
      <FormMessage message={state.message} ok={state.ok} />
      <div className="grid gap-3 sm:grid-cols-[12rem_1fr]">
        <div>
          <label htmlFor="mkind" className="mb-1.5 block text-sm font-medium">Tipo</label>
          <select id="mkind" name="kind" defaultValue={v("kind") || "image"} className={inputClass}>
            {Object.entries(MEDIA_KIND_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </div>
        <Field label="Título" name="title" required defaultValue={v("title")} error={e.title} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="URL del recurso" name="url" type="url" required defaultValue={v("url")} error={e.url} hint="Object storage/CDN de ALEXANDRIA o URL oficial del proveedor." />
        <Field label="URL original (procedencia)" name="originalUrl" type="url" defaultValue={v("originalUrl")} error={e.originalUrl} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Autor" name="author" defaultValue={v("author")} />
        <Field label="Proveedor" name="provider" defaultValue={v("provider")} />
        <Field label="Licencia" name="license" required defaultValue={v("license")} error={e.license} hint="p. ej. CC BY-SA 4.0, dominio público" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="URL de la licencia" name="licenseUrl" type="url" defaultValue={v("licenseUrl")} error={e.licenseUrl} />
        <Field label="Créditos" name="credit" defaultValue={v("credit")} error={e.credit} />
      </div>
      <Field label="Condiciones de uso" name="usageConditions" defaultValue={v("usageConditions")} />
      <Field label="Texto alternativo (accesibilidad)" name="altText" defaultValue={v("altText")} />
      <div>
        <label htmlFor="rightsStatus" className="mb-1.5 block text-sm font-medium">Estado de los derechos</label>
        <select id="rightsStatus" name="rightsStatus" defaultValue={v("rightsStatus") || "pending"} className={inputClass}>
          <option value="pending">Pendiente de verificar</option>
          <option value="verified">Verificados (se puede publicar)</option>
          <option value="rejected">Rechazado (no usar)</option>
        </select>
      </div>
      <button className={buttonClass("primary", "sm")} disabled={pending}>Registrar recurso</button>
    </form>
  );
}

export function MediaRightsSelect({ id, value }: { id: string; value: "pending" | "verified" | "rejected" }) {
  const [pending, start] = useTransition();
  return (
    <select aria-label="Estado de los derechos" defaultValue={value} disabled={pending} onChange={(e) => start(() => setMediaRightsAction(id, e.target.value as typeof value))} className="rounded-lg border border-line bg-surface px-2 py-1 text-xs">
      <option value="pending">Pendiente</option>
      <option value="verified">Verificados</option>
      <option value="rejected">Rechazado</option>
    </select>
  );
}

export function UserControls({ id, role, disabled, isSelf }: { id: string; role: keyof typeof ROLE_LABELS; disabled: boolean; isSelf: boolean }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Rol"
        defaultValue={role}
        disabled={pending || isSelf}
        onChange={(e) => start(async () => setMsg((await setUserRoleAction(id, e.target.value as "registered")).message))}
        className="rounded-lg border border-line bg-surface px-2 py-1 text-xs"
      >
        {(["registered", "student", "editor", "admin"] as const).map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
      </select>
      {!isSelf && (
        <button type="button" disabled={pending} onClick={() => start(async () => setMsg((await setUserDisabledAction(id, !disabled)).message))} className="text-xs text-muted hover:text-red-600">
          {disabled ? "Reactivar" : "Desactivar"}
        </button>
      )}
      {msg && <span className="text-xs text-muted" role="status">{msg}</span>}
    </div>
  );
}
