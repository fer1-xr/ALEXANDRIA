import { describe, expect, it } from "vitest";
import { slugify, SLUG_PATTERN } from "@/lib/slug";
import { defaultDisplayDate, displayDateRespectsPrecision, formatAstronomicalYear } from "@/lib/historical-date";
import { estimateReadingMinutes } from "@/lib/reading-time";
import { escapeLike, expandWithSynonyms, highlightToHtml, HL_START, HL_STOP, isNaturalQuestion, normalizeQuery } from "@/server/search/query-utils";
import { rateLimit, resetRateLimits } from "@/server/auth/rate-limit";
import { splitIntoPassages } from "@/server/ai/chunking";

describe("slugify", () => {
  it("elimina tildes, eñes y signos", () => {
    expect(slugify("Época del Ñandutí: ¡arte!")).toBe("epoca-del-nanduti-arte");
    expect(SLUG_PATTERN.test(slugify("Pirámides de Giza"))).toBe(true);
  });
});

describe("fechas históricas", () => {
  it("usa numeración astronómica", () => {
    expect(formatAstronomicalYear(-752)).toBe("753 a. C.");
    expect(formatAstronomicalYear(0)).toBe("1 a. C.");
    expect(formatAstronomicalYear(1492)).toBe("1492");
  });
  it("no presenta fechas aproximadas como exactas", () => {
    expect(defaultDisplayDate(-2559, null, "approximate")).toBe("c. 2560 a. C.");
    expect(displayDateRespectsPrecision("2560 a. C.", "approximate")).toBe(false);
    expect(displayDateRespectsPrecision("c. 2560 a. C.", "approximate")).toBe(true);
    expect(displayDateRespectsPrecision("1492", "year")).toBe(true);
  });
});

describe("tiempo de lectura", () => {
  it("estima al menos un minuto", () => {
    expect(estimateReadingMinutes("hola")).toBe(1);
    expect(estimateReadingMinutes("palabra ".repeat(1100))).toBe(5);
  });
});

describe("utilidades de búsqueda", () => {
  it("normaliza preguntas", () => {
    expect(normalizeQuery("¿Quién construyó las PIRÁMIDES?")).toBe("quien construyo las piramides");
    expect(isNaturalQuestion("¿Qué es el ADN?")).toBe(true);
    expect(isNaturalQuestion("ADN")).toBe(false);
  });
  it("escapa comodines de LIKE", () => {
    expect(escapeLike("50%_a\\b")).toBe("50\\%\\_a\\\\b");
  });
  it("resalta sin permitir HTML del contenido (XSS)", () => {
    const html = highlightToHtml(`<script>alert(1)</script> ${HL_START}Egipto${HL_STOP}`);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("<mark>Egipto</mark>");
  });
  it("amplía con sinónimos en ambos sentidos", () => {
    const groups = [{ term: "Gioconda", synonyms: ["Mona Lisa"] }];
    expect(expandWithSynonyms("la mona lisa", groups)).toEqual(["Gioconda"]);
    expect(expandWithSynonyms("Gioconda", groups)).toEqual(["Mona Lisa"]);
    expect(expandWithSynonyms("Egipto", groups)).toEqual([]);
  });
});

describe("limitador de tasa", () => {
  it("bloquea al superar el límite y se recupera tras la ventana", () => {
    resetRateLimits();
    const t0 = 1_000_000;
    for (let i = 0; i < 3; i++) expect(rateLimit("k", 3, 1000, t0 + i).ok).toBe(true);
    const blocked = rateLimit("k", 3, 1000, t0 + 10);
    expect(blocked.ok).toBe(false);
    expect(rateLimit("k", 3, 1000, t0 + 2000).ok).toBe(true);
  });
});

describe("división en pasajes", () => {
  it("genera anclas iguales a las del artículo (github-slugger)", () => {
    const p = splitIntoPassages("Resumen.", "## ¿Por qué Plutón ya no es un planeta?\n\nTexto **importante**.\n\n## Otra\n\nMás.");
    expect(p[0]).toMatchObject({ heading: null, text: "Resumen." });
    expect(p[1].anchor).toBe("por-qué-plutón-ya-no-es-un-planeta");
    expect(p[1].text).toBe("Texto importante.");
    expect(p).toHaveLength(3);
  });
});
