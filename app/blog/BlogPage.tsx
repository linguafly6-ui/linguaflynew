"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Article } from "@/lib/blog";
import BlogImage, { normalizeCategory } from "./BlogImage";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const cleanText = (value: string | null | undefined) =>
  (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/\*\*|__|\*|_|~~|`/g, "")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

const articleLevel = (article: Article) => {
  const direct = article.level?.trim().toUpperCase();
  if (direct && LEVELS.includes(direct)) return direct;
  const match = article.category?.trim().toLowerCase().match(/^curso-(a1|a2|b1|b2|c1|c2)$/);
  return match ? match[1].toUpperCase() : null;
};

const readingTime = (article: Article) => {
  const stored = String(article.read_time ?? "").match(/\d+/)?.[0];
  if (stored) return Math.max(1, Number(stored));
  const words = cleanText(article.content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const formattedDate = (value: string | null | undefined) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

export default function BlogPage({ articles }: { articles: Article[] }) {
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");

  const categories = useMemo(
    () => Array.from(new Set(articles.map(article => (article.category || "otros").trim().toLowerCase()))).sort((a, b) =>
      normalizeCategory(a).localeCompare(normalizeCategory(b), "es")
    ),
    [articles]
  );

  const filtered = useMemo(
    () => articles.filter(article => {
      const key = (article.category || "otros").trim().toLowerCase();
      return (category === "all" || key === category) &&
        (level === "all" || articleLevel(article) === level);
    }),
    [articles, category, level]
  );

  return (
    <main className="blog-home">
      <section className="blog-hero">
        <div className="kicker">LINGUAFLY JOURNAL</div>
        <h1>Ideas que te llevan<br />más lejos.</h1>
        <p>Consejos, explicaciones y recursos para aprender inglés con confianza y llevarlo a tu día a día.</p>
      </section>

      <section className="blog-list">
        <div className="blog-browser">
          <div className="blog-browser-heading">
            <div>
              <span className="kicker">EXPLORA EL BLOG</span>
              <h2>Aprende a tu ritmo</h2>
              <p>Encuentra artículos por tema y por nivel de inglés.</p>
            </div>
            <strong className="blog-result-count">{filtered.length} {filtered.length === 1 ? "artículo" : "artículos"}</strong>
          </div>

          <div className="blog-filter-group" aria-label="Filtrar por categoría">
            <span className="blog-filter-label">Categorías</span>
            <div className="blog-filter-options">
              <button type="button" className={category === "all" ? "active" : ""} aria-pressed={category === "all"} onClick={() => setCategory("all")}>Todas</button>
              {categories.map(item => (
                <button key={item} type="button" className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>{normalizeCategory(item)}</button>
              ))}
            </div>
          </div>

          <div className="blog-filter-group" aria-label="Filtrar por nivel">
            <span className="blog-filter-label">Nivel MCER</span>
            <div className="blog-level-options">
              <button type="button" className={level === "all" ? "active" : ""} aria-pressed={level === "all"} onClick={() => setLevel("all")}>Todos</button>
              {LEVELS.map(item => (
                <button key={item} type="button" className={level === item ? "active" : ""} aria-pressed={level === item} onClick={() => setLevel(item)}>{item}</button>
              ))}
              <span className="blog-level-note">Solo artículos con nivel identificado</span>
            </div>
          </div>
          {(category !== "all" || level !== "all") && (
            <button type="button" className="blog-clear-filters" onClick={() => { setCategory("all"); setLevel("all"); }}>Limpiar filtros ×</button>
          )}
        </div>

        {filtered.length ? (
          <div className="article-grid">
            {filtered.map(article => {
              const resolvedLevel = articleLevel(article);
              const excerpt = cleanText(article.excerpt || article.description || article.content);
              const date = formattedDate(article.created_at);
              return (
                <Link className="article-card" href={`/blog/${article.slug}`} key={article.id}>
                  <BlogImage className="article-card-image" src={article.image} alt={article.alt} category={article.category} title={article.title} />
                  <div className="article-card-body">
                    <div className="article-card-meta">
                      <span className="article-category">{normalizeCategory(article.category)}</span>
                      {resolvedLevel && <span className="article-level">{resolvedLevel}</span>}
                    </div>
                    <h2>{cleanText(article.title)}</h2>
                    <p>{excerpt.length > 154 ? `${excerpt.slice(0, 151).trimEnd()}…` : excerpt}</p>
                    <div className="article-card-footer">
                      <span>{readingTime(article)} min de lectura</span>
                      {date && <time dateTime={article.created_at}>{date}</time>}
                      <span className="article-card-read">Leer <span aria-hidden="true">↗</span></span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="empty">No hay artículos en esta combinación. Prueba con otra categoría o nivel.</div>
        )}
      </section>
    </main>
  );
}
