"use client";

import { useState } from "react";
import { normalizeCategory } from "@/lib/blog-category";

export { normalizeCategory };

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
