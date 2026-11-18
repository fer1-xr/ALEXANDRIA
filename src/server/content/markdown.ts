/**
 * Markdown (GFM) → HTML saneado + índice de encabezados.
 * El saneado (rehype-sanitize, esquema de GitHub) elimina scripts, manejadores de
 * eventos y URLs peligrosas: el contenido editorial nunca se inyecta sin filtrar.
 */
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema, type Options as SanitizeSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { Root, Element } from "hast";

export type TocEntry = { id: string; text: string; level: 2 | 3 };
export type RenderedMarkdown = { html: string; toc: TocEntry[]; plainText: string };

const schema: SanitizeSchema = {
  ...defaultSchema,
  // Sin prefijo "user-content-" para que las anclas del índice sean legibles.
  clobberPrefix: "",
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), ["target"], ["rel"]],
  },
};

function collectToc(toc: TocEntry[]) {
  return () => (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if ((node.tagName === "h2" || node.tagName === "h3") && typeof node.properties?.id === "string") {
        toc.push({ id: node.properties.id, text: toString(node), level: node.tagName === "h2" ? 2 : 3 });
      }
    });
  };
}

function externalLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      const href = node.tagName === "a" ? node.properties?.href : undefined;
      if (typeof href === "string" && /^https?:\/\//.test(href)) {
        node.properties.target = "_blank";
        node.properties.rel = ["noopener", "noreferrer", "nofollow"];
      }
    });
  };
}

export async function renderMarkdown(markdown: string): Promise<RenderedMarkdown> {
  const toc: TocEntry[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize, schema)
    .use(rehypeSlug)
    .use(collectToc(toc))
    .use(externalLinks)
    .use(rehypeStringify)
    .process(markdown);
  const html = String(file);
  const plainText = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return { html, toc, plainText };
}
