import type { Metadata } from "next";
import ArticlePage, { generateMetadata as generateArticleMetadata } from "../../[slug]/page";

type Props = { params: Promise<{ category: string; slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generateArticleMetadata({ params: Promise.resolve({ slug }) });
}

/**
 * Compatibility route for the original category/slug URLs used by search engines
 * and external links. The article remains stored once in the blog D1 database;
 * the existing slug page owns rendering, metadata and publication checks.
 */
export default async function CategoryArticlePage({ params }: Props) {
  const { slug } = await params;
  return ArticlePage({ params: Promise.resolve({ slug }) });
}
