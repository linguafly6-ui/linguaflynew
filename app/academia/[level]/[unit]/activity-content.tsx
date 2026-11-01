"use client";

import { useState } from "react";

type Option = { id: string; text: string; value?: string };

// Authored bilingual strings use [[English|Spanish]]. Render only the
// requested language so internal localisation markers never reach students.
function LocalizedText({ text, language = "en" }: { text: string; language?: "en" | "es" }) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return <>{parts.map((part, index) => {
    const match = /^\[\[([^|\]]+)\|([^\]]+)\]\]$/.exec(part);
    if (!match) return part;
    return <span key={index}>{language === "es" ? match[2] : match[1]}</span>;
  })}</>;
}
export type Activity = {
  interaction_id?: string; type?: string; prompt_es?: string; question_en?: string;
  stimulus_en?: string; stimulus_es?: string; main_text?: string; transcript?: string;
  audio_group?: number; audio_url?: string;
  options?: Option[]; correct_answer?: string | string[] | boolean;
  example?: string; explanation?: string; mastery_tag?: string;
};

function activityTypeLabel(type: string | undefined): string {
  const key = (type ?? "ACTIVIDAD").toLowerCase().replaceAll("-", "_");
  const labels: Record<string, string> = {
    fill_blank: "COMPLETA EL ESPACIO",
    gap_fill: "COMPLETA EL ESPACIO",
    sentence_building: "ORDENA LA FRASE",
    multiple_choice: "OPCIÓN MÚLTIPLE",
    single_choice: "OPCIÓN MÚLTIPLE",
    true_false: "VERDADERO O FALSO",
    translation: "TRADUCCIÓN",
    matching: "RELACIONA",
    listening: "COMPRENSIÓN ORAL",
    reading: "COMPRENSIÓN LECTORA"
  };
  return labels[key] ?? key.replaceAll("_", " ").toUpperCase();
}

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
  const id = activity.interaction_id ?? `activity-${index}`;
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | "error" | "saving" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const isChoice = activity.type === "multiple_choice" || activity.type === "true_false";
  async function checkAnswer() {
    if (!answer.trim() || feedback === "saving") return;
    setFeedback("saving");
    try {
      const response = await fetch(`/api/academia/${level.toLowerCase()}/${unit}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interaction_id: activity.interaction_id, answer }),
      });
      const data = await response.json();
      setFeedback(response.ok ? (data.correct ? "correct" : "incorrect") : "error");
      setErrorMessage(response.ok ? "" : (typeof data.error === "string" ? data.error : `Error al comprobar la respuesta (HTTP ${response.status}).`));
    } catch {
      setFeedback("error");
    }
  }
  return <article className="activity-card">
    <div className="activity-type">{activityTypeLabel(activity.type)}</div>
    <p className="activity-prompt">{activity.prompt_es ? <LocalizedText text={activity.prompt_es} language="es" /> : "Practica este contenido."}</p>
    {activity.question_en && <p className="activity-stimulus" lang="en"><LocalizedText text={activity.question_en} /></p>}
    {activity.stimulus_en && <div className="activity-stimulus" lang="en"><LocalizedText text={activity.stimulus_en} /></div>}
    {isChoice && activity.options?.length ? <fieldset className="activity-options" style={{border:0,padding:0,margin:0}}>
      <legend className="sr-only">Selecciona una respuesta</legend>
      {activity.options.map(option => <label key={option.id} className="activity-option" style={{display:"flex",gap:10,alignItems:"center",padding:"9px 0",cursor:"pointer"}}>
        <input type="radio" name={id} value={option.value ?? option.text} checked={answer===(option.value ?? option.text)} onChange={() => {setAnswer(option.value ?? option.text);setFeedback(null);setErrorMessage("");}} />
        <span><LocalizedText text={option.text} /></span>
      </label>)}
    </fieldset> : <div className="answer-entry">
      <label htmlFor={id}>Tu respuesta</label>
      <input id={id} value={answer} onChange={event => {setAnswer(event.target.value);setFeedback(null);setErrorMessage("");}}
        onKeyDown={event => {if(event.key==="Enter" && answer.trim()) checkAnswer();}}
        placeholder="Escribe tu respuesta" />
    </div>}
    <button type="button" className="check-answer" onClick={checkAnswer} disabled={!answer.trim() || feedback === "saving"}>{feedback === "saving" ? "Comprobando…" : "Comprobar"}</button>
    {feedback === "correct" && <p className="answer-feedback correct">¡Correcto! Muy bien.</p>}
    {feedback === "incorrect" && <p className="answer-feedback incorrect">No es correcto. Inténtalo de nuevo.</p>}
    {feedback === "error" && <p className="answer-feedback incorrect">{errorMessage || "No se pudo comprobar la respuesta. Inténtalo de nuevo."}</p>}
    {feedback === "correct" && activity.explanation && <p className="activity-hint"><LocalizedText text={activity.explanation} language="es" /></p>}
  </article>;
}

function Passage({ text, kind, audioUrl }: { text: string; kind: "reading" | "listening"; audioUrl?: string }) {
  if (kind === "reading") {
    // Support both real line breaks and legacy data containing the literal "\\n" sequence.
    const parts = text.split(/\\r?\\n|\\\\n/);
    const hasHeading = parts.length > 1;
    return <section className="passage-card reading-card">
      <div className="passage-kicker">READING · COMPRENSIÓN LECTORA</div>
      <h4>{hasHeading ? <LocalizedText text={parts[0]} /> : "Texto de lectura"}</h4>
      <div className="reading-passage" style={{whiteSpace:"pre-line"}}><LocalizedText text={hasHeading ? parts.slice(1).join("\\n").trim() : text} /></div>
    </section>;
  }
  return <section className="passage-card listening-card">
    <div className="passage-kicker">LISTENING · COMPRENSIÓN ORAL</div>
    <h4>Escucha el audio</h4>
    {audioUrl
      ? <audio controls preload="none" src={audioUrl} aria-label="Audio de comprensión oral en inglés británico">
          Tu navegador no puede reproducir este archivo de audio.
        </audio>
      : <><p>Este material todavía no tiene una grabación asociada.</p><SpeakButton text={text} label="Reproducción provisional" /></>}
    <details className="transcript-details"><summary>Ver transcripción</summary><p style={{whiteSpace:"pre-line"}}><LocalizedText text={text} /></p></details>
  </section>;
}

export type ClientActivity = Omit<Activity, "correct_answer">;

export default function ActivityContent({ activities, mode: _mode, level, unit }: { activities: ClientActivity[]; mode?: "vocabulary" | "standard"; level: string; unit: number }) {
  // Older unit data repeats the same passage on every question in a reading set.
  // Render each distinct passage once per activity section, while keeping every question.
  const seenReadings = new Set<string>();
  const listeningGroups = new Map<string, { transcripts: string[]; audioUrl?: string }>();
  for (const activity of activities) {
    if (!activity.transcript) continue;
    const groupKey = activity.audio_group ? String(activity.audio_group) : activity.transcript.trim();
    const group = listeningGroups.get(groupKey) ?? { transcripts: [] };
    const transcript = activity.transcript.trim();
    if (!group.transcripts.includes(transcript)) group.transcripts.push(transcript);
    if (activity.audio_url) group.audioUrl = activity.audio_url;
    listeningGroups.set(groupKey, group);
  }
  const seenListeningGroups = new Set<string>();
  return <div className="activity-list">{activities.map((activity,index)=>{
    const readingIsNew = !!activity.main_text && !seenReadings.has(activity.main_text.trim());
    const groupKey = activity.audio_group ? String(activity.audio_group) : activity.transcript?.trim() ?? "";
    const listeningIsNew = !!groupKey && !seenListeningGroups.has(groupKey);
    if (activity.main_text) seenReadings.add(activity.main_text.trim());
    if (listeningIsNew) seenListeningGroups.add(groupKey);
    const listeningGroup = groupKey ? listeningGroups.get(groupKey) : undefined;
    return <div key={activity.interaction_id ?? index}>
      {listeningIsNew && listeningGroup && <Passage text={listeningGroup.transcripts.join("\n\n")} kind="listening" audioUrl={listeningGroup.audioUrl} />}
      {readingIsNew && activity.main_text && <Passage text={activity.main_text} kind="reading" />}
      <ActivityCard activity={activity} index={index} level={level} unit={unit}/>
    </div>;
  })}</div>;
}
