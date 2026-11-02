import type { Metadata } from "next";
import ArticlePageContent, { getArticleMetadata } from "../ArticlePageContent";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return getArticleMetadata(slug);
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  return <ArticlePageContent slug={slug} />;
}
