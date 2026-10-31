import { getCloudflareContext } from "@opennextjs/cloudflare";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: "A2 Unit 1 · Linguafly review preview", robots: { index: false, follow: false } };

type Blueprint = {
  unit_number: number;
  level: string;
  language: string;
  estimated_minutes: number;
  lesson_sequence: string[];
  grammar_lesson: { title: string; explanation: string; patterns: string[]; commonErrors: string[] };
  vocabulary: { term: string; translation_es: string; part_of_speech: string; example: string }[];
  reading: { title: string; text: string; questions: string[][] };
  listening: { title: string; transcript: string; questions: string[][]; audio_asset_status: string };
  speaking_task: string;
  writing_task: string;
  review_checklist: string[];
  editorial_notes: string[];
};

type Db = {
  prepare(sql: string): { bind(...values: string[]): { first<T>(): Promise<T | null> } };
};

async function loadBlueprint(): Promise<Blueprint | null> {
  const { env } = await getCloudflareContext();
  const db = (env as unknown as { COURSE_DB: Db }).COURSE_DB;
  const row = await db.prepare(
    "SELECT content_json FROM unit_content_blueprints WHERE unit_id = ? AND status = ? LIMIT 1"
  ).bind("a2-unit-001", "draft").first<{ content_json: string }>();
  if (!row?.content_json) return null;
  try { return JSON.parse(row.content_json) as Blueprint; } catch { return null; }
}

export default async function A2UnitOnePreview() {
  const unit = await loadBlueprint();
  if (!unit) notFound();

  return <main className="unit-learning" style={{maxWidth: 980, margin: "0 auto", padding: "48px 24px"}}>
    <Link href="/academia/a2" className="back-link">← Academia A2</Link>
    <div className="kicker" style={{marginTop:24}}>LINGUAFLY · VISTA PREVIA EDITORIAL · NO PUBLICADA</div>
    <section className="unit-hero">
      <div className="academy-hero-meta"><span>{unit.level}</span><span>{unit.estimated_minutes} minutos</span><span>{unit.language}</span></div>
      <h1>Introducing yourself and follow-up questions</h1>
      <p>Presentarte, compartir información personal y mantener una conversación inicial haciendo preguntas de seguimiento.</p>
    </section>

    <section className="outcomes-card" style={{marginTop:24}}>
      <div className="kicker">RECORRIDO DE LA UNIDAD</div>
      <ol>{unit.lesson_sequence.map(step => <li key={step}>{step.replaceAll("_"," ")}</li>)}</ol>
    </section>

    <section className="lesson-block" style={{marginTop:24}}>
      <div className="kicker">GRAMMAR</div>
      <h2>{unit.grammar_lesson.title}</h2>
      <p>{unit.grammar_lesson.explanation}</p>
      <h3>Patterns</h3>
      <ul>{unit.grammar_lesson.patterns.map((item,i)=><li key={i}>{item}</li>)}</ul>
      <h3>Common errors</h3>
      <ul>{unit.grammar_lesson.commonErrors.map((item,i)=><li key={i}>{item}</li>)}</ul>
    </section>

    <section className="lesson-block" style={{marginTop:24}}>
      <div className="kicker">VOCABULARY · {unit.vocabulary.length} ITEMS</div>
      <div className="unit-list">{unit.vocabulary.map(item=><article className="unit-row" key={item.term}>
        <span className="unit-title"><strong>{item.term}</strong><br/><small>{item.part_of_speech} · {item.translation_es}</small><br/><em>{item.example}</em></span>
      </article>)}</div>
    </section>

    <section className="lesson-block" style={{marginTop:24}}>
      <div className="kicker">READING</div>
      <h2>{unit.reading.title}</h2>
      <p>{unit.reading.text}</p>
      <h3>Comprehension questions</h3>
      <ol>{unit.reading.questions.map((q,i)=><li key={i}>{q[0]} <p><small>Options: {q.slice(1,4).join(" · ")}</small></p><p><strong>Answer: {q[4]}</strong></p></li>)}</ol>
    </section>

    <section className="lesson-block" style={{marginTop:24}}>
      <div className="kicker">LISTENING · TRANSCRIPT AVAILABLE</div>
      <h2>{unit.listening.title}</h2>
      <p>{unit.listening.transcript}</p>
      <p><small>Estado del audio: {unit.listening.audio_asset_status}. Se muestra el guion; no hay archivo de audio.</small></p>
      <h3>Comprehension questions</h3>
      <ol>{unit.listening.questions.map((q,i)=><li key={i}>{q[0]} <p><small>Options: {q.slice(1,4).join(" · ")}</small></p><p><strong>Answer: {q[4]}</strong></p></li>)}</ol>
    </section>

    <section className="lesson-block" style={{marginTop:24}}>
      <div className="kicker">SPEAKING</div><h2>Speaking task</h2><p>{unit.speaking_task}</p>
    </section>
    <section className="lesson-block" style={{marginTop:24}}>
      <div className="kicker">WRITING</div><h2>Writing task</h2><p>{unit.writing_task}</p>
    </section>
    <section className="outcomes-card" style={{marginTop:24}}>
      <div className="kicker">RETRIEVAL REVIEW</div>
      <ul>{unit.review_checklist.map((item,i)=><li key={i}>{item}</li>)}</ul>
    </section>
    <section className="lesson-block" style={{marginTop:24}}>
      <div className="kicker">EDITORIAL STATUS · DRAFT</div>
      <ul>{unit.editorial_notes.map((item,i)=><li key={i}>{item}</li>)}</ul>
    </section>
  </main>;
}
