import Link from "next/link";
export default function NotFound(){return <main className="article-page"><div className="kicker">404 · PÁGINA NO ENCONTRADA</div><h1>Esta página ha tomado otro camino.</h1><p className="section-intro">Vuelve al inicio o descubre los artículos del blog.</p><p><Link className="button-primary" href="/">Ir al inicio ↗</Link></p></main>}
