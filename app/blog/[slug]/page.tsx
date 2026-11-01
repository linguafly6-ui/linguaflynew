import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/blog";
import BlogMarkdown from "./BlogMarkdown";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Artículo no encontrado" };
  return {
    title: article.title,
    description: article.description || article.excerpt || undefined,
    alternates: { canonical: article.canonical || `/blog/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description || article.excerpt || undefined,
      images: article.image ? [article.image] : undefined,
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const publishedDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <main className="article-shell">
      <div className="article-topbar">
        <Link href="/blog" className="article-back-link"><span aria-hidden="true">←</span> Todos los artículos</Link>
        <span className="article-topbar-brand">LINGUAFLY JOURNAL</span>
      </div>

      <header className="article-header">
        <div className="article-category-pill">{(article.category || "Aprender inglés").replace(/-/g, " ")}</div>
        <h1>{article.title}</h1>
        {article.excerpt && <p className="article-deck">{article.excerpt}</p>}
        <div className="article-byline">
          {article.author && <span>Por {article.author}</span>}
          {publishedDate && <time dateTime={article.created_at}>{publishedDate}</time>}
          {article.read_time ? <span>{article.read_time} min de lectura</span> : null}
        </div>
      </header>

      {article.image && (
        <figure className="article-cover">
          <img src={article.image} alt={article.alt || article.title} fetchPriority="high" />
        </figure>
      )}

      <div className="article-reading-layout">
        <BlogMarkdown content={article.content || ""} />
        <div className="article-end">
          <span>LINGUAFLY JOURNAL</span>
          <p>Aprende. Practica. Avanza.</p>
          <Link href="/blog">Descubrir más artículos <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </main>
  );
}
