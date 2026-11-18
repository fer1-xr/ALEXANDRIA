/** Utilidades puras de búsqueda (probadas en tests/unit/search-utils.test.ts). */

/** Normaliza: minúsculas, sin tildes, sin signos de interrogación, espacios simples. */
export function normalizeQuery(q: string): string {
  return q
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[¿?¡!.,;:"'()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Escapa comodines de LIKE (%, _ y \). */
export function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (m) => `\\${m}`);
}

/** Marcadores internos para resaltar coincidencias sin permitir HTML del contenido. */
export const HL_START = "\u0001";
export const HL_STOP = "\u0002";

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escapa el fragmento y convierte los marcadores en <mark>: seguro para dangerouslySetInnerHTML. */
export function highlightToHtml(fragment: string): string {
  return fragment
    .replace(/[&<>"']/g, (c) => ESCAPES[c])
    .replaceAll(HL_START, "<mark>")
    .replaceAll(HL_STOP, "</mark>");
}

/**
 * Amplía la consulta con sinónimos: si la consulta normalizada contiene un término
 * (o uno de sus sinónimos), se añaden todos los del grupo.
 */
export function expandWithSynonyms(q: string, groups: { term: string; synonyms: string[] }[]): string[] {
  const nq = ` ${normalizeQuery(q)} `;
  const extra = new Set<string>();
  for (const g of groups) {
    const all = [g.term, ...g.synonyms];
    if (all.some((t) => nq.includes(` ${normalizeQuery(t)} `))) {
      for (const t of all) if (!nq.includes(` ${normalizeQuery(t)} `)) extra.add(t);
    }
  }
  return [...extra];
}

/** Heurística: ¿parece una pregunta en lenguaje natural? */
export function isNaturalQuestion(q: string): boolean {
  return /[¿?]/.test(q) || /^(que|quien|quienes|como|cuando|donde|por que|cual|cuales|cuanto)\b/.test(normalizeQuery(q));
}
