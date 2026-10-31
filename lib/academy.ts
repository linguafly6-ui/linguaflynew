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
const descriptions: Record<CefrLevel, string> = {
  A1: "Empieza desde cero: presentarte, comprender expresiones cotidianas y comunicar necesidades básicas.",
  A2: "Gana autonomía en situaciones habituales, habla de experiencias y expresa planes y preferencias.",
  B1: "Comunícate con independencia, cuenta experiencias y defiende tus opiniones en contextos reales.",
  B2: "Habla con fluidez, comprende argumentos complejos y expresa ideas con precisión.",
  C1: "Domina contextos exigentes, matices, registros y comunicación académica o profesional.",
  C2: "Perfecciona la precisión, la naturalidad y los matices propios de un dominio avanzado."
};
const validLevel = (value: string): value is CefrLevel => LEVELS.includes(value.toUpperCase() as CefrLevel);

async function database(): Promise<Database> {
  const { env } = await getCloudflareContext();
  return (env as unknown as { COURSE_DB: Database }).COURSE_DB;
}

export async function getAcademyLevels(): Promise<AcademyLevel[]> {
  const db = await database();
  const result = await db.prepare(
    "SELECT l.level, l.course_key, COUNT(*) AS units, MIN(l.title) AS first_title, c.status AS course_status FROM learning_course_json_units l LEFT JOIN courses c ON c.cefr_level = l.level AND c.language_code = 'en' WHERE l.level IN ('A1','A2','B1','B2','C1','C2') GROUP BY l.level, l.course_key, c.status"
  ).all<Omit<AcademyLevel, "description" | "status">>();
  const rows = result.results ?? [];
  return LEVELS.map(level => {
    const row = rows.find(item => item.level === level) as (typeof rows[number] & { course_status?: string }) | undefined;
    return {
      level,
      course_key: row?.course_key ?? `ingles-${level.toLowerCase()}`,
      units: row?.units ?? 0,
      first_title: row?.first_title ?? "Contenido en preparación",
      description: descriptions[level],
      status: row?.course_status === "published" ? "published" : row && row.units > 0 ? "content" : "in_progress"
    };
  });
}

export async function getAcademyUnits(levelValue: string): Promise<AcademyUnit[]> {
  if (!validLevel(levelValue)) return [];
  const db = await database();
  const result = await db.prepare(
    "SELECT course_key, level, unit_number, unit_id, title FROM learning_course_json_units WHERE level = ? AND course_key = ? ORDER BY unit_number"
  ).bind(levelValue.toUpperCase(), `ingles-${levelValue.toLowerCase()}`).all<AcademyUnit>();
  return result.results ?? [];
}

export async function getAcademyUnit(levelValue: string, unitNumber: number): Promise<AcademyUnit & { content: Record<string, any> } | null> {
  if (!validLevel(levelValue) || !Number.isInteger(unitNumber) || unitNumber < 1 || unitNumber > 100) return null;
  const db = await database();
  const row = await db.prepare(
    "SELECT course_key, level, unit_number, unit_id, title, content_json FROM learning_course_json_units WHERE level = ? AND course_key = ? AND unit_number = ? LIMIT 1"
  ).bind(levelValue.toUpperCase(), `ingles-${levelValue.toLowerCase()}`, unitNumber).first<AcademyUnit>();
  if (!row?.content_json) return null;
  try {
    return { ...row, content: JSON.parse(row.content_json) as Record<string, any> };
  } catch {
    return null;
  }
}

export function isCefrLevel(value: string): value is CefrLevel {
  return validLevel(value);
}
