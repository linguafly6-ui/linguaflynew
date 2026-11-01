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
  return <main className="article-page"><Link href="/blog" className="kicker">← VOLVER AL BLOG</Link><div className="article-category" style={{marginTop:32}}>{article.category || "Linguafly"}{article.level ? " · "+article.level : ""}</div><h1>{article.title}</h1><p className="section-intro">{article.excerpt || article.description}</p><div className="article-content" dangerouslySetInnerHTML={{__html: article.content}} />
    <aside className="article-course-promo" aria-label="Cursos de inglés A2 a B2">
      <div className="article-course-promo-kicker">LINGUAFLY ACADEMY · A2 — B2</div>
      <h2>¿Quieres llevar tu inglés al siguiente nivel?</h2>
      <p>Practica inglés con nuestros cursos A2, B1 y B2 y refuerza lo aprendido con ejercicios ilimitados a tu ritmo.</p>
      <Link href="/academia" className="article-course-promo-cta">Descubre los cursos A2–B2 <span aria-hidden="true">↗</span></Link>
      <span className="article-course-promo-note">Aprende. Practica. Avanza.</span>
    </aside>
  </main>;
}
