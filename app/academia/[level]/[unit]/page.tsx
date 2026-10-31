import Link from "next/link";
import { notFound } from "next/navigation";
import { getAcademyUnit, isCefrLevel } from "@/lib/academy";

export const dynamic = "force-dynamic";

type Activity = { interaction_id?: string; type?: string; prompt_es?: string; stimulus_en?: string; options?: Array<{id:string; text:string}>; explanation?: string };
type Block = { block_id?: string; title?: string; duration_minutes?: number; content?: Activity[] };

export default async function AcademyUnitPage({ params }: { params: Promise<{ level: string; unit: string }> }) {
  const { level: rawLevel, unit: rawUnit } = await params;
  const level = rawLevel.toUpperCase();
  const unitNumber = Number(rawUnit);
  if (!isCefrLevel(level)) notFound();
  const unit = await getAcademyUnit(level, unitNumber);
  if (!unit) notFound();
  const course = unit.content.course ?? {};
  const outcomes = Array.isArray(unit.content.learning_outcomes) ? unit.content.learning_outcomes as string[] : [];
  const blocks = Array.isArray(unit.content.blocks) ? unit.content.blocks as Block[] : [];
  const activityCount = blocks.reduce((sum, block) => sum + (block.content?.length ?? 0), 0);
  return <main>
    <section className="unit-hero">
      <Link href={`/academia/${level.toLowerCase()}`} className="back-link">← Volver a Inglés {level}</Link>
      <div className="kicker">LINGUAFLY ACADEMY · {level} · UNIDAD {String(unitNumber).padStart(2,"0")}</div>
      <h1>{unit.title}</h1>
      <p>Una unidad práctica para avanzar en tu inglés, consolidar conocimientos y aplicar lo aprendido.</p>
      <div className="academy-hero-meta"><span>{course.total_duration_minutes ?? "—"} min estimados</span><span>{blocks.length} bloques</span><span>{activityCount} actividades</span></div>
    </section>
    <section className="unit-learning">
      {outcomes.length > 0 && <div className="outcomes-card"><div className="kicker">AL TERMINAR ESTA UNIDAD</div><h2>Lo que vas a aprender</h2><ul>{outcomes.map((outcome, i) => <li key={i}><span>✓</span>{outcome}</li>)}</ul></div>}
      <div className="lesson-heading"><div className="kicker">CONTENIDO DEL CURSO</div><h2>Tu recorrido de aprendizaje</h2><p>Explora cada bloque y trabaja las actividades a tu ritmo.</p></div>
      <div className="lesson-blocks">{blocks.map((block, index) => <article className="lesson-block" key={block.block_id ?? index}>
        <div className="lesson-block-head"><span className="lesson-block-number">BLOQUE {String(index + 1).padStart(2,"0")}</span><span>{block.duration_minutes ? `${block.duration_minutes} min` : `${block.content?.length ?? 0} actividades`}</span></div>
        <h3>{block.title ?? `Bloque ${index + 1}`}</h3>
        <div className="activity-list">{(block.content ?? []).map((activity, activityIndex) => <div className="activity-card" key={activity.interaction_id ?? activityIndex}>
          <div className="activity-type">{(activity.type ?? "ACTIVIDAD").replaceAll("_"," ").replaceAll("-"," ").toUpperCase()}</div>
          <p className="activity-prompt">{activity.prompt_es ?? "Practica este contenido."}</p>
          {activity.stimulus_en && <div className="activity-stimulus">{activity.stimulus_en}</div>}
          {activity.options?.length ? <ul className="activity-options">{activity.options.map(option => <li key={option.id}>{option.text}</li>)}</ul> : null}
          {activity.explanation && <p className="activity-hint">{activity.explanation}</p>}
        </div>)}</div>
      </article>)}</div>
      <div className="unit-next"><Link className="academy-button" href={`/academia/${level.toLowerCase()}`}>Volver al temario</Link></div>
    </section>
  </main>;
}
