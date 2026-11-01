import Link from "next/link";
import { notFound } from "next/navigation";
import { getAcademyUnit, isCefrLevel } from "@/lib/academy";
import ActivityContent, { type Activity } from "./activity-content";

export const dynamic = "force-dynamic";

type Block = { block_id?: string; title?: string; duration_minutes?: number; content?: Activity[] };
const SECTION_ORDER = ["grammar", "listening", "vocabulary", "reading"];

export default async function AcademyUnitPage({ params }: { params: Promise<{ level: string; unit: string }> }) {
  const { level: rawLevel, unit: rawUnit } = await params;
  const level = rawLevel.toUpperCase();
  const unitNumber = Number(rawUnit);
  if (!isCefrLevel(level)) notFound();
  const unit = await getAcademyUnit(level, unitNumber);
  if (!unit) notFound();

  const course = unit.content.course ?? {};
  const outcomes = Array.isArray(unit.content.learning_outcomes) ? unit.content.learning_outcomes as string[] : [];
  const blocks = (Array.isArray(unit.content.blocks) ? unit.content.blocks as Block[] : [])
    .slice()
    .sort((a, b) => SECTION_ORDER.indexOf(a.block_id ?? "") - SECTION_ORDER.indexOf(b.block_id ?? ""));
  const activityCount = blocks.reduce((sum, block) => sum + (block.content?.length ?? 0), 0);

  return <main>
    <section className="unit-hero">
      <Link href={`/academia/${level.toLowerCase()}`} className="back-link">← Volver a Inglés {level}</Link>
      <div className="kicker">LINGUAFLY ACADEMY · {level} · UNIDAD {String(unitNumber).padStart(2, "0")}</div>
      {typeof unit.content.editorial_status === "string" && <div className="kicker" style={{marginTop:10}}>{unit.content.editorial_status}</div>}
      <h1>{unit.title}</h1>
      <p>Una unidad práctica para avanzar en tu inglés, consolidar conocimientos y aplicar lo aprendido.</p>
      <div className="academy-hero-meta">
        <span>{course.total_duration_minutes ?? "—"} min estimados</span><span>{blocks.length} bloques</span><span>{activityCount} actividades</span>
      </div>
    </section>
    <section className="unit-learning">
      {outcomes.length > 0 && <div className="outcomes-card">
        <div className="kicker">AL TERMINAR ESTA UNIDAD</div><h2>Lo que vas a aprender</h2>
        <ul>{outcomes.map((outcome, index) => <li key={index}><span>✓</span>{outcome}</li>)}</ul>
      </div>}
      <div className="lesson-heading">
        <div className="kicker">CONTENIDO RELACIONAL DE D1</div><h2>Tu recorrido de aprendizaje</h2>
        <p>Explora Grammar, Listening, Vocabulary y Reading, en ese orden, y trabaja las actividades a tu ritmo.</p>
      </div>
      <div className="lesson-blocks">{blocks.map((block, index) => <article className="lesson-block" key={block.block_id ?? index}>
        <div className="lesson-block-head">
          <span className="lesson-block-number">BLOQUE {String(index+1).padStart(2,"0")}</span>
          <span>{block.duration_minutes ? `${block.duration_minutes} min` : `${block.content?.length ?? 0} actividades`}</span>
        </div>
        <h3>{block.title ?? block.block_id ?? `Bloque ${index+1}`}</h3>
        <ActivityContent activities={block.content ?? []} mode={/vocabulary/i.test(block.block_id ?? "") ? "vocabulary" : "standard"} level={level} unit={unitNumber}/>
      </article>)}</div>
      <div className="unit-next"><Link className="academy-button" href={`/academia/${level.toLowerCase()}`}>Volver al temario</Link></div>
    </section>
  </main>;
}
