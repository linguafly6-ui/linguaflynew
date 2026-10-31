"use client";

import { useState } from "react";

type Option = { id: string; text: string };
export type Activity = {
  interaction_id?: string;
  type?: string;
  prompt_es?: string;
  question_en?: string;
  stimulus_en?: string;
  stimulus_es?: string;
  main_text?: string;
  transcript?: string;
  options?: Option[];
  correct_answer?: string | string[] | boolean;
  example?: string;
  explanation?: string;
};
type Props = { activities: Activity[] };

function SpeakButton({ text, label }: { text: string; label: string }) {
  const [playing, setPlaying] = useState(false);
  function speak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    utterance.rate = 0.92;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    setPlaying(true);
    window.speechSynthesis.speak(utterance);
  }
  return <button type="button" className="media-play-button" onClick={speak} disabled={!text}>
    <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span> {playing ? "Pausar audio" : label}
  </button>;
}

function unmark(value: string) {
  return value.replace(/\\[\\[([^|\\]]+)\\|([^\\]]+)\\]\\]/g, "$1").trim();
}

function getVocabularyPair(activity: Activity): { english: string; spanish: string } | null {
  const stimulus = activity.stimulus_en ?? "";
  const marked = [...stimulus.matchAll(/\\[\\[([^|\\]]+)\\|([^\\]]+)\\]\\]/g)];
  const first = marked.find(match => !/^[_ .-]+$/.test(match[1].trim()));
  if (first) return { english: first[1].trim(), spanish: first[2].trim() };
  const spanishMarked = marked.find(match => /^[_ .-]+$/.test(match[1].trim()));
  const answer = Array.isArray(activity.correct_answer) ? activity.correct_answer[0] : activity.correct_answer;
  if (spanishMarked && typeof answer === "string") {
    return { english: answer.trim(), spanish: spanishMarked[2].trim() };
  }
  return null;
}

function VocabularyTranslationCard({ activity }: { activity: Activity }) {
  const pair = getVocabularyPair(activity);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  if (!pair) return <div className="activity-card"><p className="activity-prompt">Este ejercicio de vocabulario necesita revisión editorial.</p></div>;
  const accepted = pair.spanish.split(/\\s*[/;]\\s*/).map(value => value.trim().toLocaleLowerCase("es"));
  const isCorrect = accepted.includes(answer.trim().replace(/[.!?]+$/, "").toLocaleLowerCase("es"));
  return <div className="activity-card vocabulary-translation-card">
    <div className="activity-type">TRADUCCIÓN · INGLÉS → CASTELLANO</div>
    <p className="activity-prompt">Traduce al castellano la siguiente palabra o expresión:</p>
    <div className="vocabulary-source" lang="en">{pair.english}</div>
    <div className="answer-entry">
      <label htmlFor={activity.interaction_id}>Tu traducción al castellano</label>
      <input id={activity.interaction_id} lang="es" value={answer} onChange={event => {setAnswer(event.target.value);setChecked(false);}} onKeyDown={event => {if(event.key==="Enter")setChecked(true);}} placeholder="Escribe la traducción en castellano" />
      <button type="button" className="check-answer" onClick={() => setChecked(true)} disabled={!answer.trim()}>Comprobar</button>
      {checked && <p className={isCorrect ? "answer-feedback correct" : "answer-feedback incorrect"}>{isCorrect ? "¡Correcto! Muy bien." : <>No es correcto. La traducción es: <strong>{pair.spanish}</strong>.</>}</p>}
    </div>
  </div>;
}

function ActivityCard({ activity }: { activity: Activity }) {
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const expected = Array.isArray(activity.correct_answer) ? activity.correct_answer[0] : activity.correct_answer;
  const isCorrect = typeof expected === "string" && answer.trim().toLowerCase().replace(/[.!?]+$/, "") === expected.trim().toLowerCase().replace(/[.!?]+$/, "");
  const keyword = activity.example;
  return <div className="activity-card">
    <div className="activity-type">{(activity.type ?? "ACTIVIDAD").replaceAll("_"," ").replaceAll("-"," ").toUpperCase()}</div>
    <p className="activity-prompt">{activity.prompt_es ?? "Practica este contenido."}</p>
    {activity.stimulus_en && <div className="activity-stimulus">{activity.stimulus_en}</div>}
    {keyword && activity.type === "key_word_transformation" && <div className="keyword-chip">PALABRA CLAVE <strong>{keyword}</strong></div>}
    {activity.type === "key_word_transformation" && <div className="answer-entry">
      <label htmlFor={activity.interaction_id}>Tu respuesta</label>
      <input id={activity.interaction_id} value={answer} onChange={event => {setAnswer(event.target.value);setChecked(false);}} onKeyDown={event => {if(event.key==="Enter")setChecked(true);}} placeholder="Escribe la palabra o expresión que falta" />
      <button type="button" className="check-answer" onClick={() => setChecked(true)} disabled={!answer.trim()}>Comprobar</button>
      {checked && <p className={isCorrect ? "answer-feedback correct" : "answer-feedback incorrect"}>{isCorrect ? "¡Correcto! Muy bien." : "Todavía no. Revisa la palabra clave y vuelve a intentarlo."}</p>}
    </div>}
    {activity.options?.length ? <ul className="activity-options">{activity.options.map(option => <li key={option.id}>{option.text}</li>)}</ul> : null}
    {activity.explanation && <p className="activity-hint">{activity.explanation}</p>}
  </div>;
}

export default function ActivityContent({ activities, mode }: Props & { mode?: "vocabulary" | "standard" }) {
  const listeningText = activities.find(item => item.transcript)?.transcript;
  const readingText = activities.find(item => item.main_text)?.main_text;
  return <>
    {listeningText && <section className="passage-card listening-card">
      <div className="passage-kicker">LISTENING · COMPRENSIÓN ORAL</div>
      <h4>Escucha el diálogo</h4>
      <p>Reproduce el audio y después responde a las preguntas. La voz se genera al reproducirlo en tu navegador.</p>
      <SpeakButton text={listeningText} label="Reproducir audio en inglés" />
      <details className="transcript-details"><summary>Ver transcripción</summary><p>{listeningText}</p></details>
    </section>}
    {readingText && <section className="passage-card reading-card">
      <div className="passage-kicker">READING · COMPRENSIÓN LECTORA</div>
      <h4>{readingText.split("\n")[0]}</h4>
      <div className="reading-passage">{readingText.split("\n").slice(1).join("\n").trim() || readingText}</div>
      <SpeakButton text={readingText} label="Escuchar lectura" />
    </section>}
    <div className="activity-list">{activities.map((activity, index) => mode === "vocabulary" ? <VocabularyTranslationCard activity={activity} key={activity.interaction_id ?? index} /> : <ActivityCard activity={activity} key={activity.interaction_id ?? index} />)}</div>
  </>;
}
