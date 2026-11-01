import { getCloudflareContext } from "@opennextjs/cloudflare";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = typeof LEVELS[number];
export type AcademyUnit = {
  course_key: string;
  level: string;
  unit_number: number;
  unit_id: string;
  title: string;
  content_json?: string;
};
export type AcademyLevel = {
  level: CefrLevel;
  course_key: string;
  units: number;
  first_title: string;
  description: string;
  status: "published" | "content" | "in_progress";
};
type Statement = {
  bind(...values: (string | number)[]): Statement;
  all<T>(): Promise<{ results?: T[] }>;
  first<T>(): Promise<T | null>;
};
type Database = { prepare(sql: string): Statement };
type UnitRow = AcademyUnit & {
  learning_objectives_json: string;
  course_status: string;
};
type ExerciseRow = {
  section_id: string;
  section_type: string;
  section_title: string;
  section_position: number;
  exercise_id: string;
  exercise_type_id: string;
  exercise_title: string;
  instructions: string;
  content_json: string;
  exercise_position: number;
  option_id: string | null;
  option_key: string | null;
  option_content: string | null;
  option_position: number | null;
};
const descriptions: Record<CefrLevel, string> = {
  A1: "Empieza desde cero: presentarte, comprender expresiones cotidianas y comunicar necesidades básicas.",
  A2: "Gana autonomía en situaciones habituales, habla de experiencias y expresa planes y preferencias.",
  B1: "Comunícate con independencia, cuenta experiencias y defiende tus opiniones en contextos reales.",
  B2: "Habla con fluidez, comprende argumentos complejos y expresa ideas con precisión.",
  C1: "Domina contextos exigentes, matices, registros y comunicación académica o profesional.",
  C2: "Perfecciona la precisión, la naturalidad y los matices propios de un dominio avanzado."
};
const validLevel = (value: string): value is CefrLevel =>
  LEVELS.includes(value.toUpperCase() as CefrLevel);

async function database(): Promise<Database> {
  const { env } = await getCloudflareContext();
  return (env as unknown as { COURSE_DB: Database }).COURSE_DB;
}

export async function getAcademyLevels(): Promise<AcademyLevel[]> {
  const db = await database();
  const result = await db.prepare(
    "SELECT c.id AS course_key, c.cefr_level AS level, COUNT(u.id) AS units, MIN(u.title) AS first_title, c.status AS course_status FROM courses c LEFT JOIN units u ON u.course_id=c.id WHERE c.language_code='en' GROUP BY c.id, c.cefr_level, c.status"
  ).all<AcademyLevel & { course_status: string }>();
  const rows = result.results ?? [];
  return LEVELS.map(level => {
    const row = rows.find(item => item.level === level);
    const units = Number(row?.units ?? 0);
    return {
      level,
      course_key: row?.course_key ?? `course-en-${level.toLowerCase()}`,
      units,
      first_title: row?.first_title ?? "Contenido en preparación",
      description: descriptions[level],
      status: row?.course_status === "published"
        ? "published"
        : units > 0 ? "content" : "in_progress"
    };
  });
}

export async function getAcademyUnits(levelValue: string): Promise<AcademyUnit[]> {
  if (!validLevel(levelValue)) return [];
  const db = await database();
  const result = await db.prepare(
    "SELECT c.id AS course_key, c.cefr_level AS level, u.unit_number, u.id AS unit_id, u.title FROM courses c JOIN units u ON u.course_id=c.id WHERE c.cefr_level=? AND c.language_code='en' AND u.status IN ('draft','review','published') ORDER BY u.unit_number"
  ).bind(levelValue.toUpperCase()).all<AcademyUnit>();
  return result.results ?? [];
}

export async function getAcademyUnit(
  levelValue: string,
  unitNumber: number
): Promise<AcademyUnit & { content: Record<string, any> } | null> {
  if (!validLevel(levelValue) || !Number.isInteger(unitNumber) || unitNumber < 1 || unitNumber > 100) return null;
  const db = await database();
  const unit = await db.prepare(
    "SELECT c.id AS course_key, c.cefr_level AS level, u.unit_number, u.id AS unit_id, u.title, u.learning_objectives_json, c.status AS course_status FROM courses c JOIN units u ON u.course_id=c.id WHERE c.cefr_level=? AND c.language_code='en' AND u.unit_number=? AND u.status IN ('draft','review','published') LIMIT 1"
  ).bind(levelValue.toUpperCase(), unitNumber).first<UnitRow>();
  if (!unit) return null;

  const result = await db.prepare(
    "SELECT s.id AS section_id, s.section_type, s.title AS section_title, s.position AS section_position, e.id AS exercise_id, e.exercise_type_id, e.title AS exercise_title, e.instructions, e.content_json, e.position AS exercise_position, o.id AS option_id, o.option_key, o.content AS option_content, o.position AS option_position FROM sections s LEFT JOIN exercises e ON e.section_id=s.id AND e.status IN ('draft','review','approved','published') LEFT JOIN exercise_options o ON o.exercise_id=e.id WHERE s.unit_id=? AND s.status IN ('draft','review','approved','published') ORDER BY CASE s.section_type WHEN 'grammar' THEN 1 WHEN 'listening' THEN 2 WHEN 'vocabulary' THEN 3 WHEN 'reading' THEN 4 ELSE 5 END, e.position, o.position"
  ).bind(unit.unit_id).all<ExerciseRow>();

  const grouped = new Map<string, {
    block_id: string;
    title: string;
    duration_minutes: number;
    content: any[];
  }>();
  for (const row of result.results ?? []) {
    if (!grouped.has(row.section_id)) {
      grouped.set(row.section_id, {
        block_id: row.section_type,
        title: row.section_title,
        duration_minutes: 15,
        content: []
      });
    }
    if (!row.exercise_id) continue;
    const block = grouped.get(row.section_id)!;
    let activity = block.content.find(item => item.interaction_id === row.exercise_id);
    if (!activity) {
      let authored: Record<string, any> = {};
      try {
        authored = JSON.parse(row.content_json || "{}");
      } catch {
        authored = {};
      }
      activity = {
        interaction_id: row.exercise_id,
        type: "multiple_choice",
        prompt_es: authored.prompt_es || row.instructions || "",
        question_en: authored.prompt || row.exercise_title || "",
        stimulus_en: row.section_type === "grammar" || row.section_type === "vocabulary"
          ? (authored.stimulus_en || authored.prompt || "")
          : "",
        transcript: row.section_type === "listening"
          ? (authored.transcript || authored.stimulus_en || authored.stimulus || "")
          : undefined,
        main_text: row.section_type === "reading"
          ? (authored.passage || authored.stimulus_en || authored.stimulus || "")
          : undefined,
        explanation: authored.explanation_es || "",
        options: []
      };
      block.content.push(activity);
    }
    if (row.option_id) {
      activity.options.push({
        id: row.option_id,
        value: row.option_key || row.option_id,
        text: row.option_content || row.option_key
      });
    }
  }

  let objectives: string[] = [];
  try {
    objectives = JSON.parse(unit.learning_objectives_json || "[]");
  } catch {
    objectives = [];
  }
  return {
    course_key: unit.course_key,
    level: unit.level,
    unit_number: unit.unit_number,
    unit_id: unit.unit_id,
    title: unit.title,
    content: {
      course: { total_duration_minutes: 60 },
      learning_outcomes: objectives,
      editorial_status: unit.course_status === "published"
        ? "CONTENIDO DEL CURSO · REVISAR ESTADO DE UNIDAD"
        : "BORRADOR EDITORIAL · NO PUBLICADO",
      blocks: Array.from(grouped.values())
    }
  };
}

export function isCefrLevel(value: string): value is CefrLevel {
  return validLevel(value);
}
