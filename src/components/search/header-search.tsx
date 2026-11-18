"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { SearchBox } from "./search-box";

/** Botón de búsqueda de la cabecera: abre un panel con el buscador (atajo Ctrl/⌘ + K). */
export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full p-2 text-fg/80 hover:bg-surface-2 hover:text-fg md:border md:border-line md:px-3 md:py-1.5"
        aria-label="Buscar (Ctrl + K)"
      >
        <Icon name="search" />
        <span className="hidden text-sm text-muted md:inline">Buscar</span>
        <kbd className="hidden whitespace-nowrap rounded border border-line px-1.5 text-[0.65rem] text-muted 2xl:inline">Ctrl K</kbd>
      </button>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Buscar en ALEXANDRIA">
          <button type="button" aria-label="Cerrar búsqueda" className="absolute inset-0 bg-night/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative mx-auto mt-[12vh] w-[min(42rem,92vw)]">
            <SearchBox size="lg" autoFocus onNavigate={() => setOpen(false)} />
            <p className="mt-3 text-center text-xs text-ivory/70">Intro para buscar · ↑↓ para navegar · Esc para cerrar</p>
          </div>
        </div>
      )}
    </>
  );
}
