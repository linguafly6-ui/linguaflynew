import type { Metadata } from "next";
import "./globals.css";
import "./student.css";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL("https://linguafly.app"),
  title: { default: "Linguafly — Aprende inglés para comunicarte", template: "%s | Linguafly" },
  description: "Aprende inglés con un método práctico, recursos reales y acompañamiento para avanzar con confianza.",
  openGraph: { type: "website", locale: "es_ES", siteName: "Linguafly" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>
    <header className="site-header"><Link className="brand" href="/"><span className="brand-mark">L</span>lingua<span>fly</span></Link>
      <nav><Link href="/#metodo">Método</Link><Link href="/academia">Academia</Link><Link href="/mi-aprendizaje">Mi aprendizaje</Link><Link href="/blog">Blog</Link></nav>
      <Link className="nav-cta" href="/acceso">Acceder <span>↗</span></Link>
    </header>
    {children}
    <footer className="footer"><div className="footer-main"><Link className="brand" href="/"><span className="brand-mark">L</span>lingua<span>fly</span></Link><p>El inglés que te lleva más lejos.</p></div><div className="footer-links"><Link href="/academia">Academia A1–C2</Link><Link href="/blog">Ideas para aprender</Link><a href="mailto:hola@linguafly.app">Contacto</a></div><small>© {new Date().getFullYear()} Linguafly. Aprende a tu ritmo, llega más lejos.</small></footer>
  </body></html>;
}
