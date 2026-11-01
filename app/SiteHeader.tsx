"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/#metodo", label: "Método" },
  { href: "/academia", label: "Academia" },
  { href: "/mi-aprendizaje", label: "Mi aprendizaje" },
  { href: "/blog", label: "Blog" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <Link className="brand" href="/" onClick={() => setMenuOpen(false)} aria-label="Linguafly, inicio">
        <span className="brand-mark">L</span>lingua<span>fly</span>
      </Link>

      <nav id="site-navigation" className={`site-nav ${menuOpen ? "is-open" : ""}`} aria-label="Navegación principal">
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="site-header-actions">
        <Link className="nav-cta" href="/acceso" onClick={() => setMenuOpen(false)}>
          Acceder <span>↗</span>
        </Link>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
