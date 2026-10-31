import Link from "next/link";
import { getAcademyLevels } from "@/lib/academy";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Academia de inglés A1–C2",
  description: "Explora los cursos de inglés de Linguafly desde A1 hasta C2."
};

export default async function AcademyPage() {
  const levels = await getAcademyLevels();
  const totalUnits = levels.reduce((sum, item) => sum + item.units, 0);
  return <main>
    <section className="academy-hero">
      <div className="kicker">LINGUAFLY ACADEMY · ENGLISH LEARNING</div>
      <h1>Tu inglés.<br/><em>Tu siguiente nivel.</em></h1>
      <p>Una ruta de aprendizaje completa desde tus primeras palabras hasta un dominio avanzado del inglés. Aprende paso a paso, con unidades prácticas y objetivos claros.</p>
      <div className="academy-hero-meta"><span>6 niveles CEFR</span><span>{totalUnits} unidades disponibles</span><span>Inglés británico</span></div>
    </section>
    <section className="academy-content">
      <div className="academy-heading"><div><div className="kicker">ENCUENTRA TU PUNTO DE PARTIDA</div><h2>Seis niveles. Un camino para avanzar.</h2></div><p>Elige tu nivel para descubrir el contenido, las unidades y las actividades disponibles.</p></div>
      <div className="level-grid">
        {levels.map((item, index) => <Link className={`level-card level-${item.level.toLowerCase()}`} href={`/academia/${item.level.toLowerCase()}`} key={item.level}>
          <div className="level-card-top"><span className="level-index">0{index + 1} / 06</span><span className={item.status === "available" ? "level-status ready" : "level-status"}>{item.status === "available" ? "Contenido disponible" : "En preparación"}</span></div>
          <div className="level-code">{item.level}</div>
          <h3>{({A1:"Principiante",A2:"Elemental",B1:"Intermedio",B2:"Intermedio alto",C1:"Avanzado",C2:"Maestría"} as Record<string,string>)[item.level]}</h3>
          <p>{item.description}</p>
          <div className="level-card-bottom"><span>{item.units} unidades</span><span className="level-arrow">↗</span></div>
        </Link>)}
      </div>
    </section>
    <section className="academy-path">
      <div className="kicker">EL MÉTODO LINGUAFLY</div>
      <h2>Aprende con un propósito.<br/>Avanza con confianza.</h2>
      <div className="academy-pillars"><article><b>01</b><h3>Comprende</h3><p>Construye vocabulario y entiende cómo funciona el idioma.</p></article><article><b>02</b><h3>Practica</h3><p>Consolida lo aprendido con actividades y situaciones reales.</p></article><article><b>03</b><h3>Comunica</h3><p>Convierte tus conocimientos en comunicación clara y natural.</p></article></div>
    </section>
  </main>;
}
