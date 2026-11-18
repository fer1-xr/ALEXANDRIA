"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import { previewMarkdownAction, saveArticleAction } from "@/server/actions/admin/articles";
import { initialFormState } from "@/server/actions/form-state";
import { Field, FormMessage, inputClass } from "@/components/forms/fields";
import { buttonClass, cx } from "@/components/ui/primitives";
import { DIFFICULTY_LABELS, DIFFICULTY_ORDER, ENTITY_LABELS, NOTICE_TEXT, SOURCE_VERIFICATION_LABELS } from "@/lib/labels";
import { slugify } from "@/lib/slug";

type CategoryOpt = { id: string; name: string; path: string; depth: number; archivedAt: Date | null };
type SourceOpt = { id: string; title: string; authors: string | null; year: number | null; verification: keyof typeof SOURCE_VERIFICATION_LABELS };

export type EditableArticle = {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  summary: string;
  content: string;
  categoryId: string;
  entityType: keyof typeof ENTITY_LABELS;
  difficulty: keyof typeof DIFFICULTY_LABELS;
  keywords: string[];
  facts: { label: string; value: string }[];
  notices: (keyof typeof NOTICE_TEXT)[];
  aiAssisted: boolean;
  authorCredit: string | null;
  locale: string;
  sourceIds: string[];
  secondaryCategoryIds: string[];
};

export function ArticleEditor({
  article,
  categories,
  sources,
}: {
  article?: EditableArticle;
  categories: CategoryOpt[];
  sources: SourceOpt[];
}) {
  const [state, action, pending] = useActionState(saveArticleAction, initialFormState);
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article));
  const [content, setContent] = useState(article?.content ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewing, startPreview] = useTransition();
  const [selectedSources, setSelectedSources] = useState<string[]>(article?.sourceIds ?? []);
  const [sourceFilter, setSourceFilter] = useState("");
  const e = state.errors ?? {};
  /** Tras un error, reponer lo enviado (React restablece el formulario al terminar la acción). */
  const v = (name: string, fallback: string) => state.values?.[name] ?? fallback;

  const filteredSources = useMemo(() => {
    const f = sourceFilter.trim().toLowerCase();
    return f ? sources.filter((s) => `${s.title} ${s.authors ?? ""}`.toLowerCase().includes(f)) : sources;
  }, [sources, sourceFilter]);

  const activeCats = categories.filter((c) => !c.archivedAt);

  return (
    <form action={action} className="space-y-6">
      {article && <input type="hidden" name="id" value={article.id} />}
      <FormMessage message={state.message} ok={state.ok} />

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Título"
          name="title"
          required
          value={title}
          onChange={(ev) => {
            setTitle(ev.target.value);
            if (!slugTouched) setSlug(slugify(ev.target.value));
          }}
          error={e.title}
        />
        <Field
          label="Slug (URL)"
          name="slug"
          required
          value={slug}
          onChange={(ev) => {
            setSlugTouched(true);
            setSlug(ev.target.value);
          }}
          error={e.slug}
          hint={`/articulo/${slug || "…"}`}
        />
      </div>
      <Field label="Subtítulo" name="subtitle" defaultValue={v("subtitle", article?.subtitle ?? "")} error={e.subtitle} />
      <div>
        <label htmlFor="summary" className="mb-1.5 block text-sm font-medium">Resumen</label>
        <textarea id="summary" name="summary" required rows={3} maxLength={1200} defaultValue={v("summary", article?.summary ?? "")} className={inputClass} aria-invalid={e.summary ? true : undefined} />
        {e.summary && <p className="mt-1 text-xs text-red-600">{e.summary}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <label htmlFor="categoryId" className="mb-1.5 block text-sm font-medium">Categoría principal</label>
          <select id="categoryId" name="categoryId" required defaultValue={v("categoryId", article?.categoryId ?? "")} className={inputClass}>
            <option value="" disabled>Selecciona…</option>
            {activeCats.map((c) => (
              <option key={c.id} value={c.id}>{"— ".repeat(c.depth)}{c.name}</option>
            ))}
          </select>
          {e.categoryId && <p className="mt-1 text-xs text-red-600">{e.categoryId}</p>}
        </div>
        <div>
          <label htmlFor="entityType" className="mb-1.5 block text-sm font-medium">Tipo</label>
          <select id="entityType" name="entityType" defaultValue={v("entityType", article?.entityType ?? "article")} className={inputClass}>
            {Object.entries(ENTITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="difficulty" className="mb-1.5 block text-sm font-medium">Nivel</label>
          <select id="difficulty" name="difficulty" defaultValue={v("difficulty", article?.difficulty ?? "intermediate")} className={inputClass}>
            {DIFFICULTY_ORDER.map((d) => <option key={d} value={d}>{DIFFICULTY_LABELS[d]}</option>)}
          </select>
        </div>
      </div>

      <details className="rounded-xl border border-line p-4">
        <summary className="cursor-pointer text-sm font-medium">Categorías secundarias ({article?.secondaryCategoryIds.length ?? 0})</summary>
        <select name="secondaryCategoryIds" multiple defaultValue={article?.secondaryCategoryIds ?? []} className={cx(inputClass, "mt-3 h-56")} aria-label="Categorías secundarias">
          {activeCats.map((c) => <option key={c.id} value={c.id}>{"— ".repeat(c.depth)}{c.name}</option>)}
        </select>
        <p className="mt-1 text-xs text-muted">Ctrl/⌘ + clic para seleccionar varias.</p>
      </details>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="content" className="text-sm font-medium">Contenido (Markdown)</label>
          <div className="flex rounded-full border border-line p-0.5 text-xs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === "write"} onClick={() => setTab("write")} className={cx("rounded-full px-3 py-1", tab === "write" && "bg-surface-2 font-medium")}>Escribir</button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "preview"}
              onClick={() => {
                setTab("preview");
                startPreview(async () => setPreviewHtml(await previewMarkdownAction(content)));
              }}
              className={cx("rounded-full px-3 py-1", tab === "preview" && "bg-surface-2 font-medium")}
            >
              Vista previa
            </button>
          </div>
        </div>
        <textarea
          id="content"
          name="content"
          required
          rows={22}
          value={content}
          onChange={(ev) => setContent(ev.target.value)}
          className={cx(inputClass, "font-mono text-sm", tab === "preview" && "hidden")}
          aria-invalid={e.content ? true : undefined}
        />
        {tab === "preview" && (
          <div className="min-h-64 rounded-xl border border-line bg-bg p-6">
            {previewing ? <p className="text-sm text-muted">Generando vista previa…</p> : <div className="prose-alx" dangerouslySetInnerHTML={{ __html: previewHtml }} />}
          </div>
        )}
        <p className="mt-1 text-xs text-muted">Usa «## Sección» y «### Subsección» para generar el índice. El HTML se sanea al publicar.</p>
        {e.content && <p className="mt-1 text-xs text-red-600">{e.content}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="facts" className="mb-1.5 block text-sm font-medium">Ficha rápida</label>
          <textarea id="facts" name="facts" rows={5} defaultValue={v("facts", article?.facts.map((f) => `${f.label}: ${f.value}`).join("\n") ?? "")} className={cx(inputClass, "text-sm")} placeholder={"Período: c. 3100 – 30 a. C.\nCapital: Menfis"} />
          <p className="mt-1 text-xs text-muted">Una línea por dato: «Etiqueta: valor».</p>
          {e.facts && <p className="mt-1 text-xs text-red-600">{e.facts}</p>}
        </div>
        <div className="space-y-4">
          <Field label="Palabras clave" name="keywords" defaultValue={v("keywords", article?.keywords.join(", ") ?? "")} hint="Separadas por comas." />
          <Field label="Responsable editorial visible" name="authorCredit" defaultValue={v("authorCredit", article?.authorCredit ?? "")} />
          <div>
            <label htmlFor="locale" className="mb-1.5 block text-sm font-medium">Idioma</label>
            <select id="locale" name="locale" defaultValue={v("locale", article?.locale ?? "es")} className={inputClass}>
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>
        </div>
      </div>

      <fieldset className="rounded-xl border border-line p-4">
        <legend className="px-1 text-sm font-medium">Avisos y procedencia</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(NOTICE_TEXT) as (keyof typeof NOTICE_TEXT)[]).map((n) => (
            <label key={n} className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="notices" value={n} defaultChecked={article?.notices.includes(n)} className="mt-1 accent-[var(--accent)]" />
              <span>{NOTICE_TEXT[n].title}</span>
            </label>
          ))}
          <label className="flex items-start gap-2 text-sm sm:col-span-2">
            <input type="checkbox" name="aiAssisted" defaultChecked={article?.aiAssisted ?? false} className="mt-1 accent-[var(--accent)]" />
            <span><strong className="font-medium">Redactado con asistencia de IA.</strong> Se mostrará siempre al lector. El contenido asistido por IA no se considera verificado hasta su revisión humana.</span>
          </label>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-line p-4">
        <legend className="px-1 text-sm font-medium">Fuentes citadas ({selectedSources.length})</legend>
        {selectedSources.map((id) => <input key={id} type="hidden" name="sourceIds" value={id} />)}
        <input type="search" value={sourceFilter} onChange={(ev) => setSourceFilter(ev.target.value)} placeholder="Filtrar fuentes…" aria-label="Filtrar fuentes" className={cx(inputClass, "mb-3 text-sm")} />
        <ul className="max-h-64 space-y-1 overflow-y-auto text-sm">
          {filteredSources.map((s) => {
            const on = selectedSources.includes(s.id);
            return (
              <li key={s.id}>
                <label className="flex items-start gap-2 rounded-lg px-2 py-1 hover:bg-surface-2">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => setSelectedSources(on ? selectedSources.filter((x) => x !== s.id) : [...selectedSources, s.id])}
                    className="mt-1 accent-[var(--accent)]"
                  />
                  <span>
                    <span className="italic">{s.title}</span>
                    <span className="text-muted"> — {[s.authors, s.year].filter(Boolean).join(", ")} · {SOURCE_VERIFICATION_LABELS[s.verification]}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 text-xs text-muted">El orden de selección es el orden de cita. Para publicar hace falta al menos una fuente. ¿Falta alguna? Regístrala en Fuentes.</p>
      </fieldset>

      <Field label="Nota del cambio (para el historial de revisiones)" name="changeNote" placeholder="Qué cambió y por qué" />

      <div className="sticky bottom-0 -mx-1 flex items-center gap-3 border-t border-line bg-bg/95 px-1 py-3 backdrop-blur">
        <button className={buttonClass()} disabled={pending}>{pending ? "Guardando…" : article ? "Guardar cambios" : "Crear borrador"}</button>
        {state.ok && <span className="text-sm text-muted" role="status">{state.message}</span>}
      </div>
    </form>
  );
}
