import { getCloudflareContext } from "@opennextjs/cloudflare";

export type Article = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  excerpt: string | null;
  content: string;
  category: string | null;
  level: string | null;
  created_at: string;
  updated_at: string | null;
  views: number | null;
  author: string | null;
  read_time: number | string | null;
  featured: number | null;
  image: string | null;
  alt: string | null;
  canonical: string | null;
};

type D1StatementLike = {
  bind(...values: (string | number)[]): D1StatementLike;
  all<T>(): Promise<{ results?: T[] }>;
  first<T>(): Promise<T | null>;
};
type D1DatabaseLike = { prepare(sql: string): D1StatementLike };

async function database(): Promise<D1DatabaseLike> {
  // Use the async context accessor in request-time server components.
  const { env } = await getCloudflareContext({ async: true });
  const db = (env as unknown as { DB?: D1DatabaseLike }).DB;
  if (!db) throw new Error("Cloudflare D1 binding DB is unavailable in this request");
  return db;
}

export async function getArticles(limit = 18): Promise<Article[]> {
  try {
    const db = await database();
    const result = await db.prepare(
      "SELECT id, slug, title, description, excerpt, content, category, level, created_at, updated_at, views, author, read_time, featured, image, alt, canonical FROM articles WHERE is_published = 1 ORDER BY featured DESC, created_at DESC LIMIT ?"
    ).bind(limit).all<Article>();
    return result.results ?? [];
  } catch (error) {
    console.error("Unable to load blog articles from D1", error);
    return [];
  }
}

export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const db = await database();
    return await db.prepare(
      "SELECT id, slug, title, description, excerpt, content, category, level, created_at, updated_at, views, author, read_time, featured, image, alt, canonical FROM articles WHERE slug = ? AND is_published = 1 LIMIT 1"
    ).bind(slug).first<Article>();
  } catch (error) {
    console.error("Unable to load blog article from D1", error);
    return null;
  }
}
