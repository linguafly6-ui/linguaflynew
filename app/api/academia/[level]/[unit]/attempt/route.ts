import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getStudent, hasCourseAccess } from "@/lib/student-auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

type DBStatement = {
  bind(...values: (string | number)[]): DBStatement;
  run(): Promise<unknown>;
  first<T>(): Promise<T | null>;
};
type DB = { prepare(sql: string): DBStatement };
type ExerciseRow = {
  exercise_id: string;
  exercise_type_id: string;
  exercise_status: string;
  unit_status: string;
  section_status: string;
  course_status: string;
  course_id: string;
  points: number;
  registry_code: string;
  grading_strategy: string;
  supports_auto_grading: number;
  answer_config_json: string;
  correct_feedback: string | null;
  incorrect_feedback: string | null;
  content_json: string;
};

const normalize = (value: string) =>
  value.trim().toLocaleLowerCase("en-GB").normalize("NFKC").replace(/[.!?]+$/u, "");

async function getDatabase(): Promise<DB> {
  const { env } = await getCloudflareContext({ async: true });
  return (env as unknown as { COURSE_DB: DB }).COURSE_DB;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ level: string; unit: string }> }
) {
  const { level: rawLevel, unit: rawUnit } = await params;
  const level = rawLevel.toUpperCase();
  if (!/^(A1|A2|B1|B2|C1|C2)$/.test(level)) {
    return NextResponse.json({ error: "Nivel no válido." }, { status: 400 });
  }
  const unitNumber = Number(rawUnit);
  if (!Number.isInteger(unitNumber) || unitNumber < 1 || unitNumber > 100) {
    return NextResponse.json({ error: "Unidad no válida." }, { status: 400 });
  }

  let payload: { interaction_id?: unknown; answer?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 });
  }
  const interactionId = typeof payload.interaction_id === "string" ? payload.interaction_id.trim() : "";
  const answer = typeof payload.answer === "string" ? payload.answer.trim().slice(0, 2000) : "";
  if (!interactionId || interactionId.length > 160 || !answer) {
    return NextResponse.json({ error: "Falta la respuesta o el identificador del ejercicio." }, { status: 400 });
  }

  const db = await getDatabase();
  const exercise = await db.prepare(
    "SELECT e.id AS exercise_id, e.exercise_type_id, e.status AS exercise_status, e.points, u.status AS unit_status, s.status AS section_status, c.status AS course_status, c.id AS course_id, r.code AS registry_code, r.grading_strategy, r.supports_auto_grading, k.answer_config_json, k.correct_feedback, k.incorrect_feedback, e.content_json FROM exercises e JOIN sections s ON s.id=e.section_id JOIN units u ON u.id=s.unit_id JOIN courses c ON c.id=u.course_id JOIN exercise_type_registry r ON r.code=e.exercise_type_id AND r.status='active' LEFT JOIN exercise_answer_keys k ON k.exercise_id=e.id WHERE e.id=? AND c.cefr_level=? AND u.unit_number=? LIMIT 1"
  ).bind(interactionId, level, unitNumber).first<ExerciseRow>();

  if (!exercise) {
    return NextResponse.json({ error: "Ejercicio no encontrado en esta unidad." }, { status: 404 });
  }
  if (!exercise.supports_auto_grading) {
    return NextResponse.json({ error: "Este tipo de actividad requiere evaluación no automática." }, { status: 422 });
  }
  if (!exercise.answer_config_json) {
    console.error("Relational answer key missing", { exerciseId: interactionId });
    return NextResponse.json({ error: "El ejercicio no tiene una clave de corrección válida." }, { status: 422 });
  }

  let student: Awaited<ReturnType<typeof getStudent>> = null;
  try {
    student = await getStudent();
  } catch {
    student = null;
  }
  const courseKey = `ingles-${level.toLowerCase()}`;
  const hasAccess = Boolean(student && await hasCourseAccess(student.learner_id, courseKey));
  const fullyPublished = exercise.course_status === "published"
    && exercise.unit_status === "published"
    && exercise.section_status === "published"
    && exercise.exercise_status === "published";
  if (!fullyPublished && !hasAccess) {
    return NextResponse.json({ error: "Este contenido todavía no está publicado." }, { status: 403 });
  }

  let config: Record<string, unknown>;
  try {
    config = JSON.parse(exercise.answer_config_json || "{}") as Record<string, unknown>;
  } catch {
    console.error("Malformed relational answer config", { exerciseId: interactionId });
    return NextResponse.json({ error: "La clave de corrección no tiene un formato válido." }, { status: 422 });
  }

  let correct = false;
  const strategy = exercise.grading_strategy;
  if (strategy === "single_choice") {
    const selected = await db.prepare(
      "SELECT option_key FROM exercise_options WHERE exercise_id=? AND (option_key=? OR id=?) LIMIT 1"
    ).bind(interactionId, answer, answer).first<{ option_key: string }>();
    if (!selected) {
      return NextResponse.json({ error: "La opción seleccionada no pertenece a este ejercicio." }, { status: 400 });
    }
    const correctKeys = Array.isArray(config.correctOptionKeys)
      ? config.correctOptionKeys.filter((value): value is string => typeof value === "string")
      : [];
    if (!correctKeys.length) {
      return NextResponse.json({ error: "La clave de selección no contiene opciones correctas." }, { status: 422 });
    }
    correct = correctKeys.includes(selected.option_key);
  } else if (strategy === "accepted_answers" || strategy === "accepted_variants" || strategy === "normalized_text") {
    const rawAccepted = config.acceptedAnswers ?? config.acceptedVariants ?? config.accepted_answers;
    const accepted = Array.isArray(rawAccepted)
      ? rawAccepted.filter((value): value is string => typeof value === "string")
      : [];
    if (!accepted.length) {
      return NextResponse.json({ error: "La clave no contiene respuestas admitidas para este tipo de ejercicio." }, { status: 422 });
    }
    correct = accepted.some(value => normalize(value) === normalize(answer));
  } else if (strategy === "boolean") {
    const expected = config.correctAnswer ?? config.answer;
    const submitted = answer.toLowerCase();
    if (typeof expected !== "boolean") {
      return NextResponse.json({ error: "La clave booleana no tiene un valor válido." }, { status: 422 });
    }
    correct = (submitted === "true" || submitted === "verdadero") === expected;
  } else {
    console.error("Unsupported automatic grading strategy", { exerciseId: interactionId, strategy });
    return NextResponse.json({ error: "La estrategia de corrección todavía no está implementada." }, { status: 422 });
  }

  let authored: Record<string, unknown> = {};
  try {
    authored = JSON.parse(exercise.content_json || "{}") as Record<string, unknown>;
  } catch {
    authored = {};
  }
  const explanation = typeof authored.explanation_es === "string" ? authored.explanation_es : "";
  const feedback = correct
    ? (exercise.correct_feedback || "¡Correcto!")
    : (exercise.incorrect_feedback || "No es correcto. Revisa la explicación e inténtalo de nuevo.");

  if (student && hasAccess) {
    try {
      await db.prepare(
        "INSERT INTO learning_attempts (id, learner_id, exercise_id, idempotency_key, response_json, is_correct, score, max_score, feedback_json, grading_version) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(
        randomUUID(),
        student.learner_id,
        interactionId,
        randomUUID(),
        JSON.stringify({ answer }),
        correct ? 1 : 0,
        correct ? exercise.points : 0,
        exercise.points,
        JSON.stringify({ feedback, explanation }),
        `registry:${exercise.registry_code}:${strategy}`
      ).run();
    } catch (error) {
      console.error("Unable to persist relational learning attempt:", error);
    }
  }

  return NextResponse.json({ correct, feedback, ...(explanation ? { explanation } : {}) });
}
