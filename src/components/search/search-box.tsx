"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cx } from "@/components/ui/primitives";
import { ENTITY_LABELS } from "@/lib/labels";

type Suggestion = { kind: "article" | "category"; label: string; href: string; detail: string };

const EXAMPLES = ["Antiguo Egipto", "¿Qué es un agujero negro?", "Paraguay", "ADN", "Alan Turing"];

export function SearchBox({
  size = "lg",
  autoFocus,
  defaultValue = "",
  onNavigate,
}: {
  size?: "lg" | "md";
  autoFocus?: boolean;
  defaultValue?: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { suggestions: Suggestion[] };
        setItems(data.suggestions);
        setActive(-1);
        setOpen(true);
        setError(false);
      } catch (e) {
        if ((e as Error).name !== "AbortError") setError(true);
      }
    }, 150);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  function go(href: string) {
    setOpen(false);
    onNavigate?.();
    router.push(href);
  }

  function submit() {
    if (active >= 0 && visible[active]) return go(visible[active].href);
    const term = q.trim();
    if (term) go(`/buscar?q=${encodeURIComponent(term)}`);
  }

  // Con menos de 2 caracteres no se muestran sugerencias (estado derivado, sin efecto).
  const visible = q.trim().length >= 2 ? items : [];
  const big = size === "lg";
  return (
    <div className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className={cx(
          "flex items-center gap-3 rounded-full border border-line bg-surface shadow-[var(--shadow-card)] focus-within:border-accent",
          big ? "px-5 py-3.5" : "px-4 py-2.5",
        )}
      >
        <Icon name="search" className={cx("shrink-0 text-accent", big ? "h-6 w-6" : "h-5 w-5")} />
        <input
          ref={inputRef}
          type="search"
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => items.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((a) => Math.min(a + 1, items.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, -1));
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder="Busca personajes, lugares, épocas, especies, teorías…"
          aria-label="Buscar en ALEXANDRIA"
          role="combobox"
          aria-expanded={open && visible.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          enterKeyHint="search"
          maxLength={200}
          className={cx("min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted", big ? "text-lg" : "text-base")}
        />
        <button type="submit" className="hidden rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-fg sm:block">
          Buscar
        </button>
      </form>
      {open && visible.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Sugerencias"
          className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-line bg-surface py-1.5 text-left shadow-[var(--shadow-card)]"
        >
          {visible.map((s, i) => (
            <li
              key={s.href}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                go(s.href);
              }}
              onMouseEnter={() => setActive(i)}
              className={cx("flex cursor-pointer items-center justify-between gap-3 px-5 py-2.5", i === active && "bg-surface-2")}
            >
              <span className="flex items-center gap-3">
                <Icon name={s.kind === "category" ? "layers" : "book"} className="h-4 w-4 text-accent" />
                <span className="font-medium">{s.label}</span>
              </span>
              <span className="text-xs text-muted">
                {s.kind === "article" ? (ENTITY_LABELS[s.detail as keyof typeof ENTITY_LABELS] ?? "Artículo") : s.detail}
              </span>
            </li>
          ))}
          <li
            role="option"
            aria-selected={false}
            onMouseDown={(e) => {
              e.preventDefault();
              go(`/buscar?q=${encodeURIComponent(q.trim())}`);
            }}
            className="cursor-pointer border-t border-line px-5 py-2.5 text-sm text-link hover:bg-surface-2"
          >
            Ver todos los resultados de «{q.trim()}»
          </li>
        </ul>
      )}
      {error && <p className="mt-2 text-sm text-muted">Las sugerencias no están disponibles; pulsa Intro para buscar.</p>}
    </div>
  );
}

export function SearchExamples() {
  return (
    <p className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-ivory/70">
      <span>Prueba:</span>
      {EXAMPLES.map((e) => (
        <a key={e} href={`/buscar?q=${encodeURIComponent(e)}`} className="rounded-full border border-ivory/20 px-3 py-1 hover:border-gold hover:text-gold">
          {e}
        </a>
      ))}
    </p>
  );
}
