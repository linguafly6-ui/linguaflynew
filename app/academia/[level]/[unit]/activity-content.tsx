"use client";

import { useState } from "react";

type Option = { id: string; text: string };
export type Activity = {
  interaction_id?: string; type?: string; prompt_es?: string; question_en?: string;
  stimulus_en?: string; stimulus_es?: string; main_text?: string; transcript?: string;
  options?: Option[]; correct_answer?: string | string[] | boolean;
  example?: string; explanation?: string; mastery_tag?: string;
};

function SpeakButton({ text, label }: { text: string; label: string }) {
  const [playing, setPlaying] = useState(false);
  function speak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (playing) { window.speechSynthesis.cancel(); setPlaying(false); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB"; utterance.rate = 0.92;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    setPlaying(true); window.speechSynthesis.speak(utterance);
  }
  return <button type="button" className="media-play-button" onClick={speak} disabled={!text}>
    <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span> {playing ? "Detener audio" : label}
  </button>;
}

function ActivityCard({ activity, index, level, unit }: { activity: Activity; index: number; level: string; unit: number }) {
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const id = activity.interaction_id ?? `activity-${index}`;
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | "error" | "saving" | null>(null);
  const isChoice = activity.type === "multiple_choice" || activity.type === "true_false";
  async function checkAnswer() {\n    if (!answer.trim() || feedback === "saving") return;\n    setFeedback("saving");\n    try {\n      const response = await fetch(`/api/academia/${level.toLowerCase()}/${unit}/attempt`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ interaction_id: activity.interaction_id, answer }) });\n      const data = await response.json();\n      setFeedback(response.ok ? (data.correct ? "correct" : "incorrect") : "error");\n    } catch { setFeedback("error"); }\n  }\n  return <article className="activity-card">
    <div className="activity-type">{(activity.type ?? "ACTIVIDAD").replaceAll("_"," ").replaceAll("-"," ").toUpperCase()}</div>
    <p className="activity-prompt">{activity.prompt_es ?? "Practica este contenido."}</p>
    {activity.question_en && <p className="activity-stimulus" lang="en">{activity.question_en}</p>}
    {activity.stimulus_en && <div className="activity-stimulus" lang="en">{activity.stimulus_en}</div>}
    {isChoice && activity.options?.length ? <fieldset className="activity-options" style={{border:0,padding:0,margin:0}}>
      <legend className="sr-only">Selecciona una respuesta</legend>
      {activity.options.map(option => <label key={option.id} className="activity-option" style={{display:"flex",gap:10,alignItems:"center",padding:"9px 0",cursor:"pointer"}}>
        <input type="radio" name={id} value={option.text} checked={answer===option.text} onChange={() => {setAnswer(option.text);setChecked(false);}} />
        <span>{option.text}</span>
      </label>)}
    </fieldset> : <div className="answer-entry">
      <label htmlFor={id}>Tu respuesta</label>
      <input id={id} value={answer} onChange={event => {setAnswer(event.target.value);setChecked(false);}}
        onKeyDown={event => {if(event.key==="Enter" && answer.trim()) setChecked(true);}}
        placeholder="Escribe tu respuesta" />
    </div>}
    <button type="button" className="check-answer" onClick={() => setChecked(true)} disabled={!answer.trim()}>Comprobar</button>
    {checked && <p className={isCorrect ? "answer-feedback correct" : "answer-feedback incorrect"}>
      {isCorrect ? "¡Correcto! Muy bien." : <>No es correcto. Respuesta: <strong>{expected.filter((x): x is string => typeof x==="string").join(" / ") || "—"}</strong>.</>}
    </p>}
    {checked && activity.explanation && <p className="activity-hint">{activity.explanation}</p>}
  </article>;
}

function Passage({ text, kind }: { text: string; kind: "reading" | "listening" }) {
  if (kind === "reading") {
    // Support both real line breaks and legacy data containing the literal "\\n" sequence.
    const parts = text.split(/\\r?\\n|\\\\n/);
    const hasHeading = parts.length > 1;
    return <section className="passage-card reading-card">
      <div className="passage-kicker">READING · COMPRENSIÓN LECTORA</div>
      <h4>{hasHeading ? parts[0] : "Texto de lectura"}</h4>
      <div className="reading-passage" style={{whiteSpace:"pre-line"}}>{hasHeading ? parts.slice(1).join("\\n").trim() : text}</div>
      <SpeakButton text={text} label="Escuchar lectura" />
    </section>;
  }
  return <section className="passage-card listening-card">
    <div className="passage-kicker">LISTENING · COMPRENSIÓN ORAL</div>
    <h4>Escucha el diálogo</h4>
    <p>Escucha el diálogo y responde a las preguntas. La voz se genera en tu navegador; no es una grabación de hablante nativo.</p>
    <SpeakButton text={text} label="Reproducir audio en inglés" />
    <details className="transcript-details"><summary>Ver transcripción</summary><p style={{whiteSpace:"pre-line"}}>{text}</p></details>
  </section>;
}

export default function ActivityContent({ activities, mode: _mode, level, unit }: { activities: Activity[]; mode?: "vocabulary" | "standard"; level: string; unit: number }) {
  // Older unit data repeats the same passage on every question in a reading set.
  // Render each distinct passage once per activity section, while keeping every question.
  const seenReadings = new Set<string>();
  const seenTranscripts = new Set<string>();
  return <div className="activity-list">{activities.map((activity,index)=>{
    const readingIsNew = !!activity.main_text && !seenReadings.has(activity.main_text.trim());
    const listeningIsNew = !!activity.transcript && !seenTranscripts.has(activity.transcript.trim());
    if (activity.main_text) seenReadings.add(activity.main_text.trim());
    if (activity.transcript) seenTranscripts.add(activity.transcript.trim());
    return <div key={activity.interaction_id ?? index}>
      {listeningIsNew && activity.transcript && <Passage text={activity.transcript} kind="listening" />}
      {readingIsNew && activity.main_text && <Passage text={activity.main_text} kind="reading" />}
      <ActivityCard activity={activity} index={index} level={level} unit={unit}/>
    </div>;
  })}</div>;
}
