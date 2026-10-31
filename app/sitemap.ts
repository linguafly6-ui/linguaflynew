import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/blog";
import { getAcademyLevels, getAcademyUnits } from "@/lib/academy";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://linguafly.app";
  const [articles, levels] = await Promise.all([getArticles(2000), getAcademyLevels()]);
  const academyUrls: MetadataRoute.Sitemap = [{ url: `${base}/academia`, changeFrequency: "weekly", priority: 0.9 }];
  for (const item of levels) {
    academyUrls.push({ url: `${base}/academia/${item.level.toLowerCase()}`, changeFrequency: "weekly", priority: 0.8 });
    const units = await getAcademyUnits(item.level);
    academyUrls.push(...units.map(unit => ({
      url: `${base}/academia/${item.level.toLowerCase()}/${unit.unit_number}`,
      changeFrequency: "monthly" as const,
      priority: 0.6
    })));
  }
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, changeFrequency: "daily", priority: 0.8 },
    ...academyUrls,
    ...articles.map(article => ({
      url: article.canonical ? new URL(article.canonical, base).toString() : `${base}/blog/${article.slug}`,
      lastModified: article.updated_at || article.created_at,
      changeFrequency: "monthly" as const,
      priority: article.featured ? 0.8 : 0.6
    }))
  ];
}
