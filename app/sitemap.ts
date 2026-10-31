import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://linguafly.app";
  const articles = await getArticles(2000);
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, changeFrequency: "daily", priority: 0.8 },
    ...articles.map(article => ({
      url: article.canonical
        ? new URL(article.canonical, base).toString()
        : `${base}/blog/${article.slug}`,
      lastModified: article.updated_at || article.created_at,
      changeFrequency: "monthly" as const,
      priority: article.featured ? 0.8 : 0.6
    }))
  ];
}
