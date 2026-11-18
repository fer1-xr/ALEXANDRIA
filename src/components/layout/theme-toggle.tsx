"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/icon";

type Theme = "light" | "dark";

export function applyTheme(theme: "system" | Theme) {
  localStorage.setItem("alx-theme", theme);
  const dark = theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

/** Observa la clase .dark de <html> (la fija el script de tema antes de hidratar). */
function subscribe(onChange: () => void) {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => obs.disconnect();
}
const getTheme = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");

export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, getTheme, () => null);
}

export function ThemeToggle() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => applyTheme(next)}
      className="rounded-full p-2 text-fg/80 transition hover:bg-surface-2 hover:text-fg"
      aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
      title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} />
    </button>
  );
}
