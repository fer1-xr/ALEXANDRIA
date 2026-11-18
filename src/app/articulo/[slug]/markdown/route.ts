import { getPublishedArticle } from "@/server/queries/content";

/** Descarga del texto del artículo, solo si su licencia lo permite (allow_download). */
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const a = await getPublishedArticle(slug);
  if (!a || !a.allowDownload) return new Response("No disponible para descarga.", { status: 404 });
  const body = `# ${a.title}\n\n${a.summary}\n\n${a.content}\n\n---\nLicencia: ${a.contentLicense ?? "consultar"}\nFuente: ALEXANDRIA\n`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${a.slug}.md"`,
    },
  });
}
