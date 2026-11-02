import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type Statement = {
  bind(...values: (string | number)[]): Statement;
  first<T>(): Promise<T | null>;
};

type Database = {
  prepare(sql: string): Statement;
};


export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  if (slug !== "mejores-apps-ingles-gratis") {
    return NextResponse.json({ ok: false, error: "Unsupported diagnostic target" }, { status: 400 });
  }

  const checks: Record<string, unknown> = {
    route: "blog-d1-diagnostic",
    slug,
  };

  try {
    const context = await getCloudflareContext({ async: true });
    const db = (context.env as unknown as { DB?: Database }).DB;

    checks.dbBindingPresent = Boolean(db);
    if (!db) {
      return NextResponse.json({ ok: false, checks, stage: "binding" }, { status: 500 });
    }

    const table = await db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'articles' LIMIT 1")
      .first<{ name: string }>();
    checks.articlesTablePresent = Boolean(table);

    if (!table) {
      return NextResponse.json({ ok: false, checks, stage: "schema" }, { status: 500 });
    }

    const article = await db
      .prepare("SELECT id, slug, is_published, length(content) AS content_length FROM articles WHERE slug = ? LIMIT 1")
      .bind(slug)
      .first<{ id: number; slug: string; is_published: number; content_length: number }>();

    checks.articleFound = Boolean(article);
    checks.articleId = article?.id ?? null;
    checks.published = article?.is_published ?? null;
    checks.contentLength = article?.content_length ?? null;

    return NextResponse.json({ ok: true, stage: "query", checks });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      stage: "exception",
      checks,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.split("\n").slice(0, 6) : undefined,
    }, { status: 500 });
  }
}
