import type { Metadata } from "next";
import ArticlePageContent, { getArticleMetadata } from "../../ArticlePageContent";

// Render on request so D1 is accessed by the deployed Worker, not during
// Next.js static prerendering (which initialises Miniflare in the build).
export const dynamic = "force-dynamic";

const ARTICLE_SLUG = "mejores-apps-ingles-gratis";

export async function generateMetadata(): Promise<Metadata> {
  return getArticleMetadata(ARTICLE_SLUG);
}

export default function Article765Page() {
  return <ArticlePageContent slug={ARTICLE_SLUG} />;
}
