import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/blog";
import BlogMarkdown from "./BlogMarkdown";
import BlogImage from "../BlogImage";
import { normalizeCategory } from "@/lib/blog-category";

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

  const minutes = String(article.read_time ?? "").match(/\d+/)?.[0] || String(Math.max(1, Math.ceil((article.content || "").split(/\s+/).filter(Boolean).length / 200)));
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
        <div className="article-category-pill">{normalizeCategory(article.category)}</div>
        <h1>{article.title}</h1>
        {article.excerpt && <p className="article-deck">{article.excerpt}</p>}
        <div className="article-byline">
          {article.author && <span>Por {article.author}</span>}
          {publishedDate && <time dateTime={article.created_at}>{publishedDate}</time>}
          <span>{minutes} min de lectura</span>
        </div>
      </header>

      <BlogImage className="article-cover" src={article.image} alt={article.alt} category={article.category} title={article.title} />

      <div className="article-reading-layout">
        <BlogMarkdown content={article.content || ""} />
        <aside className="article-course-promo" aria-label="Cursos de inglés Linguafly Academy">
          <div className="article-course-promo-copy">
            <span className="article-course-promo-kicker">LINGUAFLY ACADEMY · A1–C2</span>
            <h2>Convierte lo que lees en inglés que sabes utilizar.</h2>
            <p>Elige tu nivel y accede a un curso estructurado con prácticas ilimitadas mediante tu suscripción. Aprende, repasa y vuelve a practicar a tu ritmo.</p>
            <div className="article-course-levels" aria-label="Niveles disponibles"><span>A1</span><span>A2</span><span>B1</span><span>B2</span><span>C1</span><span>C2</span></div>
            <Link href="/suscripcion" className="article-course-promo-link">Descubre los cursos y suscripciones <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="article-course-promo-mark" aria-hidden="true">Aa</div>
        </aside>
        <div className="article-end">
          <span>LINGUAFLY JOURNAL</span>
          <p>Aprende. Practica. Avanza.</p>
          <Link href="/blog">Descubrir más artículos <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </main>
  );
}
