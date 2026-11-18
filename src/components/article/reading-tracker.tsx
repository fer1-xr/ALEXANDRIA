"use client";

import { useEffect, useRef } from "react";
import { recordReadingAction } from "@/server/actions/library";

/** Registra la visita y el progreso de lectura (25/50/75/100 %) del usuario identificado. */
export function ReadingTracker({ articleId }: { articleId: string }) {
  const reported = useRef(0);
  useEffect(() => {
    recordReadingAction(articleId, 0).catch(() => {});
    const body = document.getElementById("article-body");
    if (!body) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const rect = body.getBoundingClientRect();
        const total = rect.height - window.innerHeight * 0.5;
        const pct = total <= 0 ? 100 : Math.min(100, Math.max(0, ((-rect.top + window.innerHeight * 0.5) / total) * 100));
        const step = Math.floor(pct / 25) * 25;
        if (step > reported.current) {
          reported.current = step;
          recordReadingAction(articleId, step).catch(() => {});
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [articleId]);
  return null;
}
