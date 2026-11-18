/** Coherencia del contenido semilla: referencias válidas y fechas honestas. */
import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/slug";
import { displayDateRespectsPrecision } from "@/lib/historical-date";
import { ERAS } from "@/lib/eras";
import { parseTaxonomy, TAXONOMY, TOP_LEVEL_DESCRIPTIONS, type TaxonomyNode } from "../../scripts/seed/taxonomy";
import { SOURCES } from "../../scripts/seed/sources";
import { EVENTS } from "../../scripts/seed/timeline";
import { EXPERIENCES, LEARNING_PATHS } from "../../scripts/seed/catalog";
import { HISTORY_ARTICLES } from "../../scripts/seed/articles-history";
import { SCIENCE_ARTICLES } from "../../scripts/seed/articles-science";
import { WORLD_ARTICLES } from "../../scripts/seed/articles-world";

const ARTICLES = [...HISTORY_ARTICLES, ...SCIENCE_ARTICLES, ...WORLD_ARTICLES];
const paths = new Set<string>();
const walk = (nodes: TaxonomyNode[], prefix = "") =>
  nodes.forEach((n) => {
    const p = prefix ? `${prefix}/${n.slug}` : n.slug;
    expect(paths.has(p), `ruta duplicada ${p}`).toBe(false);
    paths.add(p);
    walk(n.children, p);
  });
const roots = parseTaxonomy(TAXONOMY, slugify);
walk(roots);
const slugs = new Set(ARTICLES.map((a) => a.slug));
const sourceKeys = new Set(SOURCES.map((s) => s.key));

describe("taxonomía", () => {
  it("contiene las 17 ramas principales con descripción", () => {
    expect(roots).toHaveLength(17);
    for (const r of roots) expect(TOP_LEVEL_DESCRIPTIONS[r.slug], r.slug).toBeTruthy();
  });
});

describe("artículos semilla", () => {
  it("tienen slugs únicos y categorías existentes", () => {
    expect(slugs.size).toBe(ARTICLES.length);
    for (const a of ARTICLES) {
      expect(paths.has(a.category), `${a.slug}: ${a.category}`).toBe(true);
      for (const c of a.alsoIn ?? []) expect(paths.has(c), `${a.slug}: ${c}`).toBe(true);
    }
  });
  it("citan al menos una fuente existente", () => {
    for (const a of ARTICLES) {
      expect(a.sources.length, a.slug).toBeGreaterThan(0);
      for (const k of a.sources) expect(sourceKeys.has(k), `${a.slug}: ${k}`).toBe(true);
    }
  });
  it("tienen relaciones hacia artículos existentes", () => {
    for (const a of ARTICLES) for (const r of a.relations ?? []) expect(slugs.has(r.to), `${a.slug} → ${r.to}`).toBe(true);
  });
  it("los temas médicos y esotéricos llevan su aviso", () => {
    expect(ARTICLES.find((a) => a.slug === "cerebro-humano")!.notices).toContain("medical");
    expect(ARTICLES.find((a) => a.slug === "alquimia")!.notices).toContain("esoteric");
    expect(ARTICLES.find((a) => a.slug === "budismo")!.notices).toContain("religious");
  });
});

describe("fuentes", () => {
  it("tienen claves únicas y no fingen fecha de consulta", () => {
    expect(new Set(SOURCES.map((s) => s.key)).size).toBe(SOURCES.length);
    for (const s of SOURCES) expect("accessedAt" in s).toBe(false);
  });
});

describe("línea de tiempo", () => {
  it("las fechas aproximadas se etiquetan como tales", () => {
    for (const e of EVENTS) expect(displayDateRespectsPrecision(e.displayDate, e.precision), `${e.slug}: «${e.displayDate}»`).toBe(true);
  });
  it("usa eras conocidas y artículos existentes", () => {
    const eras = new Set(ERAS.map((e) => e.key));
    for (const e of EVENTS) {
      expect(eras.has(e.era as never), e.slug).toBe(true);
      if (e.article) expect(slugs.has(e.article), e.slug).toBe(true);
      if (e.source) expect(sourceKeys.has(e.source), e.slug).toBe(true);
      if (e.endYear != null) expect(e.endYear).toBeGreaterThanOrEqual(e.startYear);
    }
  });
});

describe("catálogo", () => {
  it("experiencias y rutas apuntan a artículos existentes", () => {
    for (const x of EXPERIENCES) if (x.article) expect(slugs.has(x.article), x.slug).toBe(true);
    for (const p of LEARNING_PATHS) for (const s of p.steps) if (s.article) expect(slugs.has(s.article), s.title).toBe(true);
  });
});
