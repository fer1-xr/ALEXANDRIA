/**
 * División de artículos en pasajes por sección (## …). Función pura; las anclas
 * coinciden con las que genera rehype-slug (github-slugger) en la página del artículo.
 */
import GithubSlugger from "github-slugger";

export type Passage = { heading: string | null; anchor: string | null; text: string };

export function splitIntoPassages(summary: string, markdown: string): Passage[] {
  const slugger = new GithubSlugger();
  const passages: Passage[] = [{ heading: null, anchor: null, text: summary.trim() }];
  let current: Passage | null = null;
  for (const line of markdown.split("\n")) {
    const h = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (h) {
      const heading = h[2].replace(/[*_`]/g, "");
      const anchor = slugger.slug(heading);
      if (h[1] === "##" || !current) {
        if (current?.text.trim()) passages.push(current);
        current = { heading, anchor, text: "" };
        continue;
      }
    }
    if (!current) current = { heading: null, anchor: null, text: "" };
    current.text += `${line}\n`;
  }
  if (current?.text.trim()) passages.push(current);
  return passages.map((p) => ({ ...p, text: toPlain(p.text) })).filter((p) => p.text.length > 0);
}

/** Markdown → texto plano legible para mostrar extractos. */
export function toPlain(md: string): string {
  return md
    .replace(/\|[-: |]+\|/g, " ")
    .replace(/[|]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/^\s*[-+]\s+/gm, "• ")
    .replace(/\s+/g, " ")
    .trim();
}
