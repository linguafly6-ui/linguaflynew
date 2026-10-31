import Link from "next/link";
import { notFound } from "next/navigation";
import { getAcademyUnit, isCefrLevel } from "@/lib/academy";
import ActivityContent, { type Activity } from "./activity-content";
import { a2Unit1Exercises } from "./a2-unit-001-exercises";
import { a2Unit2Exercises } from "./a2-unit-002-exercises";
import { a2Unit3Exercises } from "./a2-unit-003-exercises";
import { a2Unit4Exercises } from "./a2-unit-004-exercises";
import { a2Unit5Exercises } from "./a2-unit-005-exercises";
import { a2Unit6Exercises } from "./a2-unit-006-exercises";

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
  return <ol className="theory-question-list">{items.map((q,i)=><li key={i}><span className="question-number">{String(i+1).padStart(2,"0")}</span><div><p>{q[0]}</p>{q.length>1&&<small>Opciones: {q.slice(1,4).join(" · ")}</small>}{q[4]&&<p className="question-answer"><strong>Respuesta: {q[4]}</strong></p>}</div></li>)}</ol>;
}
function BlueprintView({ data, title, level, number }: { data: Blueprint; title: string; level: string; number: number }) {
  return <main className="unit-learning" style={{maxWidth:980,margin:"0 auto",padding:"48px 24px"}}>
    <Link href={`/academia/${level.toLowerCase()}`} className="back-link">← Academia {level}</Link>
    <div className="kicker" style={{marginTop:24}}>LINGUAFLY ACADEMY · {level} · UNIDAD {String(number).padStart(2,"0")}</div>
    <div className="kicker" style={{marginTop:12}}>BORRADOR EDITORIAL · NO PUBLICADO</div>
    <section className="unit-hero"><div className="academy-hero-meta"><span>{level}</span><span>{data.estimated_minutes ?? "—"} minutos</span><span>{data.language ?? "English"}</span></div><h1>{title}</h1><p>Contenido en revisión editorial. Esta unidad todavía no está aprobada para su publicación a estudiantes.</p></section>
    <section className="theory-content" aria-label="Contenido teórico de la unidad">
      {!!data.lesson_sequence?.length&&<section className="theory-card theory-roadmap"><div className="theory-section-label"><span className="theory-icon">✦</span><span>MAPA DE APRENDIZAJE</span></div><h2>Tu recorrido de aprendizaje</h2><p className="theory-intro">Estos son los pasos que seguirás para dominar los objetivos de esta unidad.</p><ol className="roadmap-list">{data.lesson_sequence.map((x,i)=><li key={x}><span className="roadmap-index">{String(i+1).padStart(2,"0")}</span><span>{x.replaceAll("_"," ")}</span></li>)}</ol></section>}
      {data.grammar_lesson&&<section className="theory-card grammar-theory"><div className="theory-section-label"><span className="theory-icon">Aa</span><span>GRAMMAR · GRAMÁTICA</span></div><h2>{data.grammar_lesson.title}</h2><p className="theory-intro">{data.grammar_lesson.explanation}</p>{!!data.grammar_lesson.patterns?.length&&<div className="theory-subsection"><h3>Cómo se construye</h3><div className="grammar-patterns">{data.grammar_lesson.patterns.map((x,i)=><div className="grammar-pattern" key={i}><span>{String(i+1).padStart(2,"0")}</span><p>{x}</p></div>)}</div></div>}{!!data.grammar_lesson.commonErrors?.length&&<div className="common-errors"><h3><span aria-hidden="true">!</span> Errores frecuentes</h3><ul>{data.grammar_lesson.commonErrors.map((x,i)=><li key={i}>{x}</li>)}</ul></div>}</section>}
      {!!data.vocabulary?.length&&<section className="theory-card vocabulary-theory"><div className="theory-section-label"><span className="theory-icon">文</span><span>VOCABULARY · VOCABULARIO</span></div><div className="theory-heading-row"><div><h2>Palabras clave</h2><p className="theory-intro">Amplía tu vocabulario y observa cómo se utiliza cada expresión en contexto.</p></div><span className="theory-count">{data.vocabulary.length} palabras</span></div><div className="vocabulary-grid">{data.vocabulary.map((x,i)=><article className="vocabulary-card" key={x.term}><span className="vocabulary-number">{String(i+1).padStart(2,"0")}</span><h3>{x.term}</h3><span className="vocabulary-meta">{x.part_of_speech??"Vocabulary"}{x.translation_es?" · "+x.translation_es:""}</span>{x.example&&<p className="vocabulary-example">“{x.example}”</p>}</article>)}</div></section>}
      <div className="theory-reading-grid">
        {data.reading&&<section className="theory-card text-skill-card"><div className="theory-section-label"><span className="theory-icon">↗</span><span>READING · COMPRENSIÓN LECTORA</span></div><h2>{data.reading.title}</h2><div className="theory-reading-text">{data.reading.text}</div>{!!data.reading.questions?.length&&<div className="theory-questions"><h3>Comprueba lo que has entendido</h3><Questions items={data.reading.questions}/></div>}</section>}
        {data.listening&&<section className="theory-card text-skill-card"><div className="theory-section-label"><span className="theory-icon">♫</span><span>LISTENING · COMPRENSIÓN ORAL</span></div><h2>{data.listening.title}</h2><div className="listening-transcript"><span>TRANSCRIPCIÓN</span><p>{data.listening.transcript}</p></div><p className="audio-status-note">Audio: {data.listening.audio_asset_status??"pendiente de verificación"}. Por ahora se ofrece el texto de apoyo, no una grabación.</p>{!!data.listening.questions?.length&&<div className="theory-questions"><h3>Comprueba lo que has entendido</h3><Questions items={data.listening.questions}/></div>}</section>}
      </div>
      {!!data.review_checklist?.length&&<section className="theory-card review-theory"><div className="theory-section-label"><span className="theory-icon">✓</span><span>REPASO · AL FINAL DE LA UNIDAD</span></div><h2>¿Ya lo tienes?</h2><p className="theory-intro">Utiliza esta lista para comprobar qué sabes hacer antes de continuar.</p><ul>{data.review_checklist.map((x,i)=><li key={i}><span>{String(i+1).padStart(2,"0")}</span>{x}</li>)}</ul></section>}
      {!!data.editorial_notes?.length&&<section className="theory-card editorial-notes"><div className="theory-section-label"><span className="theory-icon">✦</span><span>NOTAS EDITORIALES · BORRADOR</span></div><ul>{data.editorial_notes.map((x,i)=><li key={i}>{x}</li>)}</ul></section>}
    </section>
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
    {number === 3 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 3 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica descripciones físicas y de personalidad, el uso de be y have y el orden de los adjetivos. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([
        ["GRAMMAR",a2Unit3Exercises.grammar],
        ["VOCABULARY",a2Unit3Exercises.vocabulary],
        ["LISTENING",a2Unit3Exercises.listening],
        ["READING",a2Unit3Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div>
        <ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}
    {number === 4 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 4 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica el presente simple, las rutinas diarias y los adverbios de frecuencia. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([
        ["GRAMMAR",a2Unit4Exercises.grammar],
        ["VOCABULARY",a2Unit4Exercises.vocabulary],
        ["LISTENING",a2Unit4Exercises.listening],
        ["READING",a2Unit4Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div>
        <ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}
    {number === 5 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 5 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica like, love, enjoy y hate + -ing, preferencias con prefer y vocabulario de actividades de ocio. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([
        ["GRAMMAR",a2Unit5Exercises.grammar],
        ["VOCABULARY",a2Unit5Exercises.vocabulary],
        ["LISTENING",a2Unit5Exercises.listening],
        ["READING",a2Unit5Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div>
        <ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}
    {number === 6 && <section className="lesson-block" style={{marginTop:32}}>
      <div className="kicker">PRACTICE · UNIT 6 REVIEW DRAFT</div><h2>60 interactive exercises</h2>
      <p>Practica los nombres contables e incontables, cuantificadores y vocabulario de alimentación, cocina y restaurantes. El listening utiliza voz sintética del navegador, no grabaciones originales.</p>
      {([
        ["GRAMMAR",a2Unit6Exercises.grammar],
        ["VOCABULARY",a2Unit6Exercises.vocabulary],
        ["LISTENING",a2Unit6Exercises.listening],
        ["READING",a2Unit6Exercises.reading],
      ] as const).map(([heading, activities]) => <section key={heading} style={{marginTop:28}}>
        <div className="kicker">{heading} · 15 ACTIVITIES</div>
        <ActivityContent activities={activities} mode="standard"/>
      </section>)}
    </section>}
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
