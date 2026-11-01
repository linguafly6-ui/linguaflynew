"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Article } from "@/lib/blog";

const CATEGORY_LABELS: Record<string, string> = {
  gramatica: "Gramática",
  metodos: "Métodos de aprendizaje",
  trabajo: "Inglés profesional",
  examenes: "Exámenes y certificaciones",
  viajes: "Viajes y vida diaria",
  actualidad: "Actualidad",
  habilidades: "Habilidades lingüísticas",
  idiomas: "Idiomas",
  "curso-a1": "Curso A1",
  "curso-a2": "Curso A2",
  "curso-b1": "Curso B1",
  "curso-b2": "Curso B2",
  "curso-c1": "Curso C1",
  "curso-c2": "Curso C2",
};
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const categoryLabel = (category: string | null) =>
  category ? CATEGORY_LABELS[category] || category.replace(/-/g, " ") : "Otros";
const articleLevel = (article: Article) => {
  const direct = article.level?.trim().toUpperCase();
  if (direct && LEVELS.includes(direct)) return direct;
  const match = article.category?.match(/^curso-(a1|a2|b1|b2|c1|c2)$/i);
  return match ? match[1].toUpperCase() : null;
};

export default function BlogPage({ articles }: { articles: Article[] }) {
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");

  const categories = useMemo(
    () => Array.from(new Set(articles.map((article) => article.category || "otros"))).sort((a, b) =>
      categoryLabel(a).localeCompare(categoryLabel(b), "es")
    ),
    [articles]
  );

  const filtered = useMemo(
    () =>
      articles.filter((article) => {
        const articleCategory = article.category || "otros";
        const matchesCategory = category === "all" || articleCategory === category;
        const matchesLevel = level === "all" || articleLevel(article) === level;
        return matchesCategory && matchesLevel;
      }),
    [articles, category, level]
  );

  return (
    <main>
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
            <strong className="blog-result-count">{filtered.length} artículos</strong>
          </div>

          <div className="blog-filter-group" aria-label="Filtrar por categoría">
            <span className="blog-filter-label">Categorías</span>
            <div className="blog-filter-options">
              <button type="button" className={category === "all" ? "active" : ""} aria-pressed={category === "all"} onClick={() => setCategory("all")}>Todas</button>
              {categories.map((item) => (
                <button key={item} type="button" className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>{categoryLabel(item)}</button>
              ))}
            </div>
          </div>

          <div className="blog-filter-group" aria-label="Filtrar por nivel">
            <span className="blog-filter-label">Nivel CEFR</span>
            <div className="blog-level-options">
              <button type="button" className={level === "all" ? "active" : ""} aria-pressed={level === "all"} onClick={() => setLevel("all")}>Todos</button>
              {LEVELS.map((item) => (
                <button key={item} type="button" className={level === item ? "active" : ""} aria-pressed={level === item} onClick={() => setLevel(item)}>{item}</button>
              ))}
              <span className="blog-level-note">A1 principiante · C2 maestría</span>
            </div>
          </div>
          {(category !== "all" || level !== "all") && (
            <button type="button" className="blog-clear-filters" onClick={() => { setCategory("all"); setLevel("all"); }}>Limpiar filtros ×</button>
          )}
        </div>

        {filtered.length ? (
          <div className="article-grid">
            {filtered.map((article) => {
              const resolvedLevel = articleLevel(article);
              return (
                <Link className="article-card" href={`/blog/${article.slug}`} key={article.id}>
                  <div className="article-card-meta">
                    <span className="article-category">{categoryLabel(article.category)}</span>
                    {resolvedLevel && <span className="article-level">{resolvedLevel}</span>}
                  </div>
                  <h2>{article.title}</h2>
                  <p>{article.excerpt || article.description || ""}</p>
                  <small>{article.read_time ? article.read_time + " min de lectura" : "Linguafly"} · Leer artículo ↗</small>
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
