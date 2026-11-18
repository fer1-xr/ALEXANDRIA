import type { MetadataRoute } from "next";
import { getCategoryTree, getLearningPaths, getPublishedSlugs } from "@/server/queries/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  const [articles, categories, paths] = await Promise.all([getPublishedSlugs(), getCategoryTree(), getLearningPaths()]);
  const staticPages = ["", "/explorar", "/descubrir", "/linea-de-tiempo", "/experiencias", "/atlas", "/aprender", "/ai", "/acerca"];
  return [
    ...staticPages.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...articles.map((a) => ({ url: `${base}/articulo/${a.slug}`, lastModified: a.updatedAt, priority: 0.8 })),
    ...categories.filter((c) => c.articleCount > 0).map((c) => ({ url: `${base}/explorar/${c.path}`, priority: 0.5 })),
    ...paths.map((p) => ({ url: `${base}/aprender/${p.slug}`, priority: 0.6 })),
  ];
}
