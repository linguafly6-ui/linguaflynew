import type { Metadata } from "next";
import ArticlePageContent, { getArticleMetadata } from "../../ArticlePageContent";

type Props = { params: Promise<{ category: string; slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return getArticleMetadata(slug);
}

/**
 * Compatibility route for the original category/slug URLs used by search engines
 * and external links. Both URL shapes share the same article renderer and D1 lookup.
 */
export default async function CategoryArticlePage({ params }: Props) {
  const { slug } = await params;
  return <ArticlePageContent slug={slug} />;
}
