import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/lib/blog";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog de inglés", description: "Artículos, guías y recursos para mejorar tu inglés con Linguafly." };
export default async function BlogPage() {
  const articles = await getArticles(60);
  return <main><section className="blog-hero"><div className="kicker">LINGUAFLY JOURNAL</div><h1>Ideas que te llevan<br/>más lejos.</h1><p>Consejos, explicaciones y recursos para aprender inglés con confianza y llevarlo a tu día a día.</p></section>
    <section className="blog-list">{articles.length ? <div className="article-grid">{articles.map((article) => <Link className="article-card" href={`/blog/${article.slug}`} key={article.id}><div className="article-category">{article.category || "Aprender inglés"}{article.level ? " · "+article.level : ""}</div><h2>{article.title}</h2><p>{article.excerpt || article.description || ""}</p><small>{article.read_time ? article.read_time+" min de lectura" : "Linguafly"} · Leer artículo ↗</small></Link>)}</div> : <div className="empty">No se han podido cargar los artículos en este momento. Vuelve a intentarlo más tarde.</div>}</section>
  </main>;
}
