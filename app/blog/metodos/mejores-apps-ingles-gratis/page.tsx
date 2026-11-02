import type { Metadata } from "next";
import ArticlePageContent, { getArticleMetadata } from "../../ArticlePageContent";

// Only this known failing URL is generated as a static page.
// The general category/slug route remains dynamic for every other article.
export const dynamic = "force-static";
export const revalidate = 3600;

const ARTICLE_SLUG = "mejores-apps-ingles-gratis";

export async function generateMetadata(): Promise<Metadata> {
  return getArticleMetadata(ARTICLE_SLUG);
}

export default function StaticArticle765Page() {
  return <ArticlePageContent slug={ARTICLE_SLUG} />;
}
