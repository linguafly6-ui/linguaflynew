import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getStudent, hasCourseAccess } from "@/lib/student-auth";
import { getAcademyUnit } from "@/lib/academy";

export const dynamic = "force-dynamic";
type DBStatement = { bind(...values: (string|number)[]): DBStatement; run(): Promise<unknown>; };
type DB = { prepare(sql: string): DBStatement };
type Exercise = { interaction_id?: string; mastery_tag?: string; correct_answer?: string|string[]|boolean };
const normalize = (value: string) => value.trim().toLocaleLowerCase().replace(/[.!?]+$/, "");
function findExercise(content: Record<string, any>, interactionId: string): Exercise | undefined {
  for (const block of Array.isArray(content.blocks) ? content.blocks : []) {
    const found = (Array.isArray(block.content) ? block.content : []).find((item: Exercise) => item.interaction_id === interactionId);
    if (found) return found;
  }
  return undefined;
}
export async function POST(request: NextRequest, { params }: { params: Promise<{ level: string; unit: string }> }) {
  const student = await getStudent();
  if (!student) return NextResponse.json({ error: "Inicia sesión para guardar tu progreso." }, { status: 401 });
  const { level: rawLevel, unit: rawUnit } = await params;
  const level = rawLevel.toUpperCase();
  if (!/^(A1|A2|B1|B2|C1|C2)$/.test(level)) return NextResponse.json({ error: "Nivel no válido." }, { status: 400 });
  const unitNumber = Number(rawUnit);
  if (!Number.isInteger(unitNumber) || unitNumber < 1 || unitNumber > 100) return NextResponse.json({ error: "Unidad no válida." }, { status: 400 });
  const courseKey = `ingles-${level.toLowerCase()}`;
  if (!(await hasCourseAccess(student.learner_id, courseKey))) return NextResponse.json({ error: "No tienes acceso a este curso." }, { status: 403 });
  let payload: { interaction_id?: string; answer?: string };
  try { payload = await request.json(); } catch { return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 }); }
  const interactionId = typeof payload.interaction_id === "string" ? payload.interaction_id.slice(0,160) : "";
  const answer = typeof payload.answer === "string" ? payload.answer.trim().slice(0,2000) : "";
  if (!interactionId || !answer) return NextResponse.json({ error: "Falta la respuesta." }, { status: 400 });
  const unit = await getAcademyUnit(level, unitNumber);
  if (!unit) return NextResponse.json({ error: "Unidad no encontrada." }, { status: 404 });
  const exercise = findExercise(unit.content, interactionId);
  if (!exercise || exercise.correct_answer === undefined) return NextResponse.json({ error: "Actividad no disponible para corrección segura." }, { status: 404 });
  const expected = Array.isArray(exercise.correct_answer) ? exercise.correct_answer : [exercise.correct_answer];
  const correct = expected.some(value => typeof value === "string" && normalize(answer) === normalize(value));
  const masteryTag = (exercise.mastery_tag || `${unit.unit_id}:${interactionId}`).slice(0,160);
  const { env } = await (await import("@opennextjs/cloudflare")).getCloudflareContext();
  const db = (env as unknown as { COURSE_DB: DB }).COURSE_DB;
  const now = new Date().toISOString().replace("T"," ").slice(0,19);
  const id = randomUUID();
  await db.prepare("INSERT INTO learner_activity_attempts (id,learner_id,course_key,unit_id,interaction_id,mastery_tag,answer_text,is_correct,attempted_at) VALUES (?,?,?,?,?,?,?,?,?)")
    .bind(id,student.learner_id,courseKey,unit.unit_id,interactionId,masteryTag,answer,correct?1:0,now).run();
  const existing = await (db as any).prepare("SELECT failure_count,success_streak,interval_hours FROM learner_skill_reviews WHERE learner_id=? AND course_key=? AND mastery_tag=?")
    .bind(student.learner_id,courseKey,masteryTag).first();
  const failures = correct ? (existing?.failure_count ?? 0) : (existing?.failure_count ?? 0) + 1;
  const streak = correct ? (existing?.success_streak ?? 0) + 1 : 0;
  const previousInterval = existing?.interval_hours ?? 24;
  const interval = correct ? Math.min(24*30, Math.max(24, previousInterval * (streak >= 2 ? 2 : 1.5))) : Math.max(2, [24,12,6,3][Math.min(failures-1,3)]);
  const due = new Date(Date.now() + interval*3600000).toISOString().replace("T"," ").slice(0,19);
  await (db as any).prepare("INSERT INTO learner_skill_reviews (learner_id,course_key,mastery_tag,failure_count,success_streak,interval_hours,due_at,last_attempt_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(learner_id,course_key,mastery_tag) DO UPDATE SET failure_count=excluded.failure_count,success_streak=excluded.success_streak,interval_hours=excluded.interval_hours,due_at=excluded.due_at,last_attempt_at=excluded.last_attempt_at,updated_at=excluded.updated_at")
    .bind(student.learner_id,courseKey,masteryTag,failures,streak,interval,due,now,now).run();
  return NextResponse.json({ correct, due_at: due, failure_count: failures, mastery_tag: masteryTag });
}
