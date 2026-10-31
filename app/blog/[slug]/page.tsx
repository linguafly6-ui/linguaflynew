import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/blog";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const article = await getArticle(slug);
  if (!article) return { title: "Artículo no encontrado" };
  return { title: article.title, description: article.description || article.excerpt || undefined, alternates: { canonical: article.canonical || `/blog/${slug}` } };
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params; const article = await getArticle(slug);
  if (!article) notFound();
  return <main className="article-page"><Link href="/blog" className="kicker">← VOLVER AL BLOG</Link><div className="article-category" style={{marginTop:32}}>{article.category || "Linguafly"}{article.level ? " · "+article.level : ""}</div><h1>{article.title}</h1><p className="section-intro">{article.excerpt || article.description}</p><div className="article-content" dangerouslySetInnerHTML={{__html: article.content}} /></main>;
}
