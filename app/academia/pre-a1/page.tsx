import Link from "next/link";

export const metadata = {
  title: "Inglés Pre-A1 · Linguafly Academy",
  description: "Primeras palabras e instrucciones cotidianas en inglés para empezar desde cero."
};

export default function PreA1Page() {
  return <main>
    <section className="level-hero">
      <Link href="/academia" className="back-link">← Todos los niveles</Link>
      <div className="kicker">LINGUAFLY ACADEMY · STARTER</div>
      <div className="level-hero-code">PRE-A1</div>
      <h1>Inglés Pre-A1<br/><em>Empieza desde cero</em></h1>
      <p>Un primer recorrido por palabras, expresiones e instrucciones muy sencillas. Practica a tu ritmo y escucha inglés británico.</p>
      <div className="academy-hero-meta"><span>Primeros pasos</span><span>Inglés británico</span><span>Misiones prácticas</span></div>
    </section>
    <section className="unit-section">
      <div className="academy-heading"><div><div className="kicker">TU PRIMERA MISIÓN</div><h2>Misiones Pre-A1</h2></div><p>Empieza con las instrucciones habituales del aula.</p></div>
      <div className="unit-list">
        <Link href="/academia/pre-a1/058" className="unit-row"><span className="unit-number">058</span><span className="unit-title">Classroom English</span><span className="unit-type">Exploración · Práctica · Repaso</span><span className="unit-arrow">↗</span></Link>
      </div>
    </section>
  </main>;
}