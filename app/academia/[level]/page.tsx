import Link from "next/link";
import { notFound } from "next/navigation";
import { getAcademyUnits, isCefrLevel } from "@/lib/academy";

export const dynamic = "force-dynamic";
const names: Record<string,string> = { A1:"Principiante", A2:"Elemental", B1:"Intermedio", B2:"Intermedio alto", C1:"Avanzado", C2:"Maestría" };

export default async function AcademyLevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level: rawLevel } = await params;
  const level = rawLevel.toUpperCase();
  if (!isCefrLevel(level)) notFound();
  const units = await getAcademyUnits(level);
  return <main>
    <section className="level-hero">
      <Link href="/academia" className="back-link">← Todos los niveles</Link>
      <div className="kicker">LINGUAFLY ACADEMY · {names[level].toUpperCase()}</div>
      <div className="level-hero-code">{level}</div>
      <h1>Inglés {level}<br/><em>{names[level]}</em></h1>
      <p>{units.length ? `Este itinerario contiene ${units.length} unidades de aprendizaje. Entra en una unidad para explorar sus objetivos y actividades.` : "Estamos preparando los contenidos de este nivel. Muy pronto podrás empezar tu recorrido."}</p>
      <div className="academy-hero-meta"><span>{units.length} unidades</span><span>Inglés británico</span><span>Contenido de Linguafly</span></div>
    </section>
    <section className="unit-section">
      <div className="academy-heading"><div><div className="kicker">TU PLAN DE APRENDIZAJE</div><h2>Unidades del nivel {level}</h2></div><p>Avanza en orden o vuelve a practicar cualquier unidad cuando lo necesites.</p></div>
      {units.length ? <div className="unit-list">{units.map(unit => <Link href={`/academia/${level.toLowerCase()}/${unit.unit_number}`} className="unit-row" key={unit.unit_number}>
        <span className="unit-number">{String(unit.unit_number).padStart(2,"0")}</span><span className="unit-title">{unit.title}</span><span className="unit-type">Unidad de aprendizaje</span><span className="unit-arrow">↗</span>
      </Link>)}</div> : <div className="academy-empty"><span>✦</span><h3>Este nivel está en preparación</h3><p>El contenido aparecerá aquí cuando esté listo para los estudiantes.</p><Link className="academy-button" href="/academia">Explorar otros niveles</Link></div>}
    </section>
  </main>;
}
