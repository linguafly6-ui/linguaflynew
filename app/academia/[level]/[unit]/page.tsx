import Link from "next/link";
import { notFound } from "next/navigation";
import { getAcademyUnit, isCefrLevel } from "@/lib/academy";
import ActivityContent, { type Activity } from "./activity-content";
import { a2Unit1Exercises } from "./a2-unit-001-exercises";
import { a2Unit2Exercises } from "./a2-unit-002-exercises";

export const dynamic = "force-dynamic";
type Block = { block_id?: string; title?: string; duration_minutes?: number; content?: Activity[] };
type Blueprint = {
  estimated_minutes?: number; language?: string; lesson_sequence?: string[];
  grammar_lesson?: { title?: string; explanation?: string; patterns?: string[]; commonErrors?: string[] };
  vocabulary?: { term: string; translation_es?: string; part_of_speech?: string; example?: string }[];
  reading?: { title?: string; text?: string; questions?: string[][] };
  listening?: { title?: string; transcript?: string; questions?: string[][]; audio_asset_status?: string };
  speaking_task?: string; writing_task?: string; review_checklist?: string[]; editorial_notes?: string[];
};
function Questions({ items }: { items: string[][] }) {
  return <ol>{items.map((q,i)=><li key={i}>{q[0]}{q.length>1&&<p><small>Opciones: {q.slice(1,4).join(" · ")}</small></p>}{q[4]&&<p><strong>Respuesta: {q[4]}</strong></p>}</li>)}</ol>;
}
function BlueprintView({ data, title, level, number }: { data: Blueprint; title: string; level: string; number: number }) {
  return <main className="unit-learning" style={{maxWidth:980,margin:"0 auto",padding:"48px 24px"}}>
    <Link href={`/academia/${level.toLowerCase()}`} className="back-link">← Academia {level}</Link>
    <div className="kicker" style={{marginTop:24}}>LINGUAFLY ACADEMY · {level} · UNIDAD {String(number).padStart(2,"0")}</div>
    <div className="kicker" style={{marginTop:12}}>BORRADOR EDITORIAL · NO PUBLICADO</div>
    <section className="unit-hero"><div className="academy-hero-meta"><span>{level}</span><span>{data.estimated_minutes ?? "—"} minutos</span><span>{data.language ?? "English"}</span></div><h1>{title}</h1><p>Contenido en revisión editorial. Esta unidad todavía no está aprobada para su publicación a estudiantes.</p></section>
    {number === 1 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 1 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Completa las actividades y comprueba cada respuesta. El audio de listening se reproduce mediante voz sintética del navegador.</p>
      {([
        ["GRAMMAR",a2Unit1Exercises.grammar],
        ["VOCABULARY",a2Unit1Exercises.vocabulary],
        ["LISTENING",a2Unit1Exercises.listening],
        ["READING",a2Unit1Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div>
        <ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}
    {number === 2 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 2 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica los posesivos, have got, las relaciones familiares y la comprensión oral y lectora. El listening utiliza voz sintética del navegador, no una grabación original.</p>
      {([
        ["GRAMMAR",a2Unit2Exercises.grammar],
        ["VOCABULARY",a2Unit2Exercises.vocabulary],
        ["LISTENING",a2Unit2Exercises.listening],
        ["READING",a2Unit2Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div>
        <ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}
    {!!data.lesson_sequence?.length&&<section className="outcomes-card" style={{marginTop:24}}><div className="kicker">RECORRIDO DE LA UNIDAD</div><ol>{data.lesson_sequence.map(x=><li key={x}>{x.replaceAll("_"," ")}</li>)}</ol></section>}
    {data.grammar_lesson&&<section className="lesson-block" style={{marginTop:24}}><div className="kicker">GRAMMAR</div><h2>{data.grammar_lesson.title}</h2><p>{data.grammar_lesson.explanation}</p><h3>Patterns</h3><ul>{data.grammar_lesson.patterns?.map((x,i)=><li key={i}>{x}</li>)}</ul><h3>Common errors</h3><ul>{data.grammar_lesson.commonErrors?.map((x,i)=><li key={i}>{x}</li>)}</ul></section>}
    {!!data.vocabulary?.length&&<section className="lesson-block" style={{marginTop:24}}><div className="kicker">VOCABULARY · {data.vocabulary.length} ITEMS</div><div className="unit-list">{data.vocabulary.map(x=><article className="unit-row" key={x.term}><span className="unit-title"><strong>{x.term}</strong><br/><small>{x.part_of_speech} · {x.translation_es}</small><br/><em>{x.example}</em></span></article>)}</div></section>}
    {data.reading&&<section className="lesson-block" style={{marginTop:24}}><div className="kicker">READING</div><h2>{data.reading.title}</h2><p>{data.reading.text}</p><h3>Comprehension questions</h3><Questions items={data.reading.questions??[]}/></section>}
    {data.listening&&<section className="lesson-block" style={{marginTop:24}}><div className="kicker">LISTENING · TRANSCRIPT AVAILABLE</div><h2>{data.listening.title}</h2><p>{data.listening.transcript}</p><p><small>Estado del audio: {data.listening.audio_asset_status??"No verificado"}. Se muestra el guion; no se incluye archivo de audio.</small></p><h3>Comprehension questions</h3><Questions items={data.listening.questions??[]}/></section>}
    {data.speaking_task&&<section className="lesson-block" style={{marginTop:24}}><div className="kicker">SPEAKING</div><h2>Speaking task</h2><p>{data.speaking_task}</p></section>}
    {data.writing_task&&<section className="lesson-block" style={{marginTop:24}}><div className="kicker">WRITING</div><h2>Writing task</h2><p>{data.writing_task}</p></section>}
    {!!data.review_checklist?.length&&<section className="outcomes-card" style={{marginTop:24}}><div className="kicker">RETRIEVAL REVIEW</div><ul>{data.review_checklist.map((x,i)=><li key={i}>{x}</li>)}</ul></section>}
    {!!data.editorial_notes?.length&&<section className="lesson-block" style={{marginTop:24}}><div className="kicker">EDITORIAL NOTES · DRAFT</div><ul>{data.editorial_notes.map((x,i)=><li key={i}>{x}</li>)}</ul></section>}
    <div className="unit-next"><Link className="academy-button" href={`/academia/${level.toLowerCase()}`}>Volver al temario</Link></div>
  </main>;
}
export default async function AcademyUnitPage({ params }: { params: Promise<{ level: string; unit: string }> }) {
  const { level: rawLevel, unit: rawUnit } = await params;
  const level = rawLevel.toUpperCase(), unitNumber = Number(rawUnit);
  if (!isCefrLevel(level)) notFound();
  const unit = await getAcademyUnit(level, unitNumber);
  if (!unit) notFound();
  if (level === "A2" && unit.content.lesson_sequence) return <BlueprintView data={unit.content as Blueprint} title={unit.title} level={level} number={unitNumber}/>;
  const course = unit.content.course ?? {};
  const outcomes = Array.isArray(unit.content.learning_outcomes) ? unit.content.learning_outcomes as string[] : [];
  const blocks = Array.isArray(unit.content.blocks) ? unit.content.blocks as Block[] : [];
  const activityCount = blocks.reduce((sum, block) => sum + (block.content?.length ?? 0), 0);
  return <main><section className="unit-hero"><Link href={`/academia/${level.toLowerCase()}`} className="back-link">← Volver a Inglés {level}</Link><div className="kicker">LINGUAFLY ACADEMY · {level} · UNIDAD {String(unitNumber).padStart(2,"0")}</div><h1>{unit.title}</h1><p>Una unidad práctica para avanzar en tu inglés, consolidar conocimientos y aplicar lo aprendido.</p><div className="academy-hero-meta"><span>{course.total_duration_minutes ?? "—"} min estimados</span><span>{blocks.length} bloques</span><span>{activityCount} actividades</span></div></section><section className="unit-learning">{outcomes.length>0&&<div className="outcomes-card"><div className="kicker">AL TERMINAR ESTA UNIDAD</div><h2>Lo que vas a aprender</h2><ul>{outcomes.map((x,i)=><li key={i}><span>✓</span>{x}</li>)}</ul></div>}<div className="lesson-heading"><div className="kicker">CONTENIDO DEL CURSO</div><h2>Tu recorrido de aprendizaje</h2><p>Explora cada bloque y trabaja las actividades a tu ritmo.</p></div><div className="lesson-blocks">{blocks.map((block,index)=><article className="lesson-block" key={block.block_id??index}><div className="lesson-block-head"><span className="lesson-block-number">BLOQUE {String(index+1).padStart(2,"0")}</span><span>{block.duration_minutes?block.duration_minutes+" min":(block.content?.length??0)+" actividades"}</span></div><h3>{block.title??`Bloque ${index+1}`}</h3><ActivityContent activities={block.content??[]} mode={["B1","B2"].includes(block.block_id??"")||/vocabulario|vocabulary/i.test(block.title??"")?"vocabulary":"standard"}/></article>)}</div><div className="unit-next"><Link className="academy-button" href={`/academia/${level.toLowerCase()}`}>Volver al temario</Link></div></section></main>;
}
