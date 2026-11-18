"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/icon";
import { applyTheme } from "@/components/layout/theme-toggle";

const STEPS = [0.85, 0.95, 1, 1.1, 1.2, 1.35, 1.5];

/* Escala de lectura como almacén externo (localStorage + evento propio). */
const SCALE_EVENT = "alx-reading-scale";
const subscribeScale = (cb: () => void) => {
  window.addEventListener(SCALE_EVENT, cb);
  return () => window.removeEventListener(SCALE_EVENT, cb);
};
const getScale = () => parseFloat(localStorage.getItem("alx-reading-scale") ?? "1") || 1;
const noopSubscribe = () => () => {};

/** Herramientas de lectura: tamaño de letra, tema, escuchar (TTS del navegador), compartir e imprimir. */
export function ReadingToolbar({ title, allowDownload, slug }: { title: string; allowDownload: boolean; slug: string }) {
  const scale = useSyncExternalStore(subscribeScale, getScale, () => 1);
  const ttsAvailable = useSyncExternalStore(noopSubscribe, () => "speechSynthesis" in window, () => false);
  const [speaking, setSpeaking] = useState<"idle" | "playing" | "paused">("idle");
  const [copied, setCopied] = useState(false);
  const utterances = useRef<SpeechSynthesisUtterance[]>([]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  function changeScale(dir: 1 | -1) {
    const idx = STEPS.findIndex((s) => s >= scale - 0.001);
    const next = STEPS[Math.max(0, Math.min(STEPS.length - 1, (idx === -1 ? 2 : idx) + dir))];
    localStorage.setItem("alx-reading-scale", String(next));
    window.dispatchEvent(new Event(SCALE_EVENT));
    document.documentElement.style.setProperty("--reading-scale", String(next));
  }

  function speak() {
    const synth = window.speechSynthesis;
    if (speaking === "playing") {
      synth.pause();
      setSpeaking("paused");
      return;
    }
    if (speaking === "paused") {
      synth.resume();
      setSpeaking("playing");
      return;
    }
    const body = document.getElementById("article-body");
    if (!body) return;
    // Lee por bloques (los motores TTS cortan textos largos).
    const blocks = [title, ...Array.from(body.querySelectorAll("h2,h3,p,li,td")).map((n) => n.textContent?.trim() ?? "")].filter(Boolean);
    const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("es"));
    synth.cancel();
    utterances.current = blocks.map((text, i) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "es-ES";
      if (voice) u.voice = voice;
      if (i === blocks.length - 1) u.onend = () => setSpeaking("idle");
      return u;
    });
    utterances.current.forEach((u) => synth.speak(u));
    setSpeaking("playing");
  }

  function stop() {
    window.speechSynthesis.cancel();
    setSpeaking("idle");
  }

  async function share() {
    const url = window.location.href.split("#")[0];
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* el usuario canceló */
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const btn = "inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm hover:border-accent/60 disabled:opacity-40";
  return (
    <div className="no-print flex flex-wrap items-center gap-2" role="toolbar" aria-label="Herramientas de lectura">
      <div className="inline-flex items-center rounded-full border border-line">
        <button type="button" onClick={() => changeScale(-1)} className="rounded-l-full px-3 py-1.5 text-sm hover:bg-surface-2" aria-label="Reducir tamaño de letra">
          A−
        </button>
        <span className="px-1 text-xs tabular-nums text-muted" aria-live="polite">{Math.round(scale * 100)}%</span>
        <button type="button" onClick={() => changeScale(1)} className="rounded-r-full px-3 py-1.5 text-base hover:bg-surface-2" aria-label="Aumentar tamaño de letra">
          A+
        </button>
      </div>
      <button type="button" className={btn} onClick={() => applyTheme(document.documentElement.classList.contains("dark") ? "light" : "dark")}>
        <Icon name="moon" className="h-4 w-4" /> Tema
      </button>
      {ttsAvailable && (
        <>
          <button type="button" className={btn} onClick={speak} aria-pressed={speaking === "playing"}>
            <Icon name="speaker" className="h-4 w-4" />
            {speaking === "idle" ? "Escuchar" : speaking === "playing" ? "Pausar" : "Reanudar"}
          </button>
          {speaking !== "idle" && (
            <button type="button" className={btn} onClick={stop}>
              <Icon name="stop" className="h-4 w-4" /> Detener
            </button>
          )}
        </>
      )}
      <button type="button" className={btn} onClick={share}>
        <Icon name="share" className="h-4 w-4" /> {copied ? "Enlace copiado" : "Compartir"}
      </button>
      <button type="button" className={btn} onClick={() => window.print()}>
        <Icon name="print" className="h-4 w-4" /> Imprimir / PDF
      </button>
      {allowDownload && (
        <a className={btn} href={`/articulo/${slug}/markdown`} download>
          Descargar texto
        </a>
      )}
    </div>
  );
}
