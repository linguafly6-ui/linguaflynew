import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getStudent, hasCourseAccess } from "@/lib/student-auth";
import { getAcademyUnit } from "@/lib/academy";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { a2Unit2Exercises } from "@/app/academia/[level]/[unit]/a2-unit-002-exercises";

export const dynamic = "force-dynamic";
type DBStatement = { bind(...values: (string|number)[]): DBStatement; run(): Promise<unknown>; first<T>(): Promise<T|null>; };
type DB = { prepare(sql: string): DBStatement };
type Exercise = { interaction_id?: string; mastery_tag?: string; correct_answer?: string|string[]|boolean };
const normalize = (value: string) => value.trim().toLocaleLowerCase().replace(/[.!?]+$/, "");
function findExercise(content: Record<string, any>, interactionId: string): Exercise | undefined {
  // Course JSON has used both block.content and nested content containers.
  // Walk only plain JSON objects/arrays and match the exact interaction ID.
  const pending: unknown[] = [content];
  const visited = new Set<object>();
  while (pending.length) {
    const current = pending.pop();
    if (!current || typeof current !== "object") continue;
    if (visited.has(current as object)) continue;
    visited.add(current as object);
    if (Array.isArray(current)) {
      for (const item of current) pending.push(item);
      continue;
    }
    const item = current as Record<string, unknown>;
    if (item.interaction_id === interactionId) {
      if (typeof item.correct_answer === "string" || typeof item.correct_answer === "boolean" ||
          (Array.isArray(item.correct_answer) && item.correct_answer.every(value => typeof value === "string"))) {
        return item as Exercise;
      }
    }
    for (const value of Object.values(item)) {
      if (value && typeof value === "object") pending.push(value);
    }
  }
  return undefined;
}
export async function POST(request: NextRequest, { params }: { params: Promise<{ level: string; unit: string }> }) {
  const { level: rawLevel, unit: rawUnit } = await params;
  const level = rawLevel.toUpperCase();
  if (!/^(A1|A2|B1|B2|C1|C2)$/.test(level)) return NextResponse.json({ error: "Nivel no válido." }, { status: 400 });
  const unitNumber = Number(rawUnit);
  if (!Number.isInteger(unitNumber) || unitNumber < 1 || unitNumber > 100) return NextResponse.json({ error: "Unidad no válida." }, { status: 400 });

  let payload: { interaction_id?: string; answer?: string };
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 }); }
  const interactionId = typeof payload.interaction_id === "string" ? payload.interaction_id.slice(0,160) : "";
  const answer = typeof payload.answer === "string" ? payload.answer.trim().slice(0,2000) : "";
  if (!interactionId || !answer) return NextResponse.json({ error: "Falta la respuesta." }, { status: 400 });

  const unit = await getAcademyUnit(level, unitNumber);
  if (!unit) return NextResponse.json({ error: "Unidad no encontrada." }, { status: 404 });
  // A2 unit 2 is rendered from its authored TypeScript exercise bank,
  // while getAcademyUnit returns only its lesson blueprint from D1.
  // Resolve against the exact same bank used by the page.
  let exercise: Exercise | undefined;
  if (level === "A2" && unitNumber === 2) {
    exercise = Object.values(a2Unit2Exercises).flat().find(item => item.interaction_id === interactionId);
    // BlueprintPractice also renders a legacy generated set before the 60
    // authored activities. Its IDs are derived from the blueprint arrays.
    if (!exercise) {
      const legacySets: Record<string, unknown> = {
        a2ugrammar: unit.content.grammar_exercises,
        a2uvocabulary: unit.content.vocabulary_exercises,
        a2ureading: unit.content.reading?.questions,
        a2ulistening: unit.content.listening?.questions,
      };
      const match = /^(a2u(?:grammar|vocabulary|reading|listening))_(\d{2})$/.exec(interactionId);
      if (match) {
        const rows = legacySets[match[1]];
        const item = Array.isArray(rows) ? rows[Number(match[2]) - 1] : undefined;
        if (Array.isArray(item) && typeof item[1] === "string") {
          exercise = { interaction_id: interactionId, correct_answer: item[1] };
        }
      }
    }
  }
  // Other JSON-backed units resolve answers from their authoritative D1 row.
  try {
    if (!exercise) {
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as unknown as { COURSE_DB: DB }).COURSE_DB;
    const row = await db.prepare(
      "SELECT item.value AS exercise_json FROM learning_course_json_units unit, json_each(unit.content_json, '$.blocks') block, json_each(block.value, '$.content') item WHERE unit.level = ? AND unit.course_key = ? AND unit.unit_number = ? AND json_extract(item.value, '$.interaction_id') = ? LIMIT 1"
    ).bind(level, `ingles-${level.toLowerCase()}`, unitNumber, interactionId).first<{ exercise_json: string }>();
    if (row?.exercise_json) exercise = JSON.parse(row.exercise_json) as Exercise;
    }
  } catch (error) {
    console.error("Unable to resolve academy exercise from D1:", error);
  }
  // Fallback supports legacy blueprint units and older content layouts.
  exercise ??= findExercise(unit.content, interactionId);
  if (!exercise || exercise.correct_answer === undefined) {
    console.error("Academy exercise answer missing:", { level, unitNumber, interactionId });
    return NextResponse.json({ error: "No encontramos la respuesta asociada a esta actividad. Recarga la unidad e inténtalo de nuevo." }, { status: 404 });
  }
  const expected = Array.isArray(exercise.correct_answer) ? exercise.correct_answer : [exercise.correct_answer];
  const correct = expected.some(value => typeof value === "string" && normalize(answer) === normalize(value));

  // Public preview units can be practised without an account. Persist spaced-repetition
  // progress only when the visitor has an active student session and course enrolment.
  try {
    const student = await getStudent();
    const courseKey = `ingles-${level.toLowerCase()}`;
    if (student && await hasCourseAccess(student.learner_id, courseKey)) {
      const { env } = await getCloudflareContext();
      const db = (env as unknown as { COURSE_DB: DB }).COURSE_DB;
      const now = new Date().toISOString().replace("T"," ").slice(0,19);
      const id = randomUUID();
      const masteryTag = (exercise.mastery_tag || `${unit.unit_id}:${interactionId}`).slice(0,160);
      await db.prepare("INSERT INTO learner_activity_attempts (id,learner_id,course_key,unit_id,interaction_id,mastery_tag,answer_text,is_correct,attempted_at) VALUES (?,?,?,?,?,?,?,?,?)")
        .bind(id,student.learner_id,courseKey,unit.unit_id,interactionId,masteryTag,answer,correct?1:0,now).run();
      const existing = await db.prepare("SELECT failure_count,success_streak,interval_hours FROM learner_skill_reviews WHERE learner_id=? AND course_key=? AND mastery_tag=?")
        .bind(student.learner_id,courseKey,masteryTag).first<{failure_count:number;success_streak:number;interval_hours:number}>();
      const failures = correct ? (existing?.failure_count ?? 0) : (existing?.failure_count ?? 0) + 1;
      const streak = correct ? (existing?.success_streak ?? 0) + 1 : 0;
      const previousInterval = existing?.interval_hours ?? 24;
      const interval = correct ? Math.min(24*30, Math.max(24, previousInterval * (streak >= 2 ? 2 : 1.5))) : Math.max(2, [24,12,6,3][Math.min(failures-1,3)]);
      const due = new Date(Date.now() + interval*3600000).toISOString().replace("T"," ").slice(0,19);
      await db.prepare("INSERT INTO learner_skill_reviews (learner_id,course_key,mastery_tag,failure_count,success_streak,interval_hours,due_at,last_attempt_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(learner_id,course_key,mastery_tag) DO UPDATE SET failure_count=excluded.failure_count,success_streak=excluded.success_streak,interval_hours=excluded.interval_hours,due_at=excluded.due_at,last_attempt_at=excluded.last_attempt_at,updated_at=excluded.updated_at")
        .bind(student.learner_id,courseKey,masteryTag,failures,streak,interval,due,now,now).run();
    }
  } catch (error) {
    console.error("Unable to persist academy attempt:", error);
    // Answer checking remains available even if optional progress tracking is unavailable.
  }
  return NextResponse.json({ correct });
}
