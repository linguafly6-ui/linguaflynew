"use client";

import { useState } from "react";

const LABELS: Record<string, string> = {
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

export function normalizeCategory(value: string | null | undefined): string {
  const key = (value || "").trim().toLowerCase().replace(/\s+/g, "-");
  return LABELS[key] || (key ? key.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Otros");
}

export default function BlogImage({
  src,
  alt,
  category,
  title,
  className = "",
}: {
  src?: string | null;
  alt?: string | null;
  category?: string | null;
  title: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const validSrc = src && /^(https?:\/\/|\/)/i.test(src.trim()) ? src.trim() : null;
  const showImage = Boolean(validSrc && !failed);

  return (
    <div className={`blog-image-frame ${className} ${showImage ? "has-image" : "is-fallback"}`} role="img" aria-label={alt || title}>
      {showImage ? (
        <img src={validSrc!} alt={alt || title} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <div className="blog-image-fallback" aria-hidden="true">
          <span className="blog-image-orbit blog-image-orbit-one" />
          <span className="blog-image-orbit blog-image-orbit-two" />
          <span className="blog-image-monogram">LF</span>
          <span className="blog-image-category">{normalizeCategory(category)}</span>
          <span className="blog-image-title">{title}</span>
        </div>
      )}
    </div>
  );
}
