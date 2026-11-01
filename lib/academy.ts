import { getCloudflareContext } from "@opennextjs/cloudflare";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = typeof LEVELS[number];
export type AcademyUnit = {
  course_key: string; level: string; unit_number: number; unit_id: string; title: string; content_json?: string;
};
export type AcademyLevel = {
  level: CefrLevel; course_key: string; units: number; first_title: string; description: string;
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
    "SELECT l.level, l.course_key, COUNT(*) AS units, MIN(l.title) AS first_title, c.status AS course_status FROM learning_course_json_units l LEFT JOIN courses c ON c.cefr_level = l.level AND c.language_code = 'en' WHERE l.level IN ('A1','B1','B2','C1','C2') GROUP BY l.level, l.course_key, c.status"
  ).all<Omit<AcademyLevel, "description" | "status">>();
  const rows = result.results ?? [];
  const a2 = await db.prepare(
    "SELECT COUNT(*) AS units, MIN(u.title) AS first_title FROM courses c JOIN units u ON u.course_id=c.id WHERE c.cefr_level='A2' AND c.language_code='en' AND u.status IN ('draft','review','approved','published')"
  ).first<{ units: number; first_title: string }>();
  return LEVELS.map(level => {
    const row = rows.find(item => item.level === level) as (typeof rows[number] & { course_status?: string }) | undefined;
    if (level === "A2") return {
      level, course_key: "ingles-a2", units: a2?.units ?? 0,
      first_title: a2?.first_title ?? "Contenido en preparación", description: descriptions[level], status: "content"
    };
    return {
      level, course_key: row?.course_key ?? `ingles-${level.toLowerCase()}`,
      units: row?.units ?? 0, first_title: row?.first_title ?? "Contenido en preparación",
      description: descriptions[level],
      status: row?.course_status === "published" ? "published" : row && row.units > 0 ? "content" : "in_progress"
    };
  });
}

export async function getAcademyUnits(levelValue: string): Promise<AcademyUnit[]> {
  if (!validLevel(levelValue)) return [];
  const db = await database();
  if (levelValue.toUpperCase() === "A1") {
    const result = await db.prepare("SELECT 'ingles-a1' AS course_key, c.cefr_level AS level, u.unit_number, u.id AS unit_id, u.title FROM courses c JOIN units u ON u.course_id=c.id WHERE c.id='course-en-a1' AND u.status IN ('draft','review','approved','published') ORDER BY u.unit_number").all<AcademyUnit>();
    return result.results ?? [];
  }
  if (levelValue.toUpperCase() === "A2") {
    const result = await db.prepare(
      "SELECT 'ingles-a2' AS course_key, 'A2' AS level, u.unit_number, u.id AS unit_id, u.title FROM courses c JOIN units u ON u.course_id=c.id WHERE c.cefr_level='A2' AND c.language_code='en' AND u.status IN ('draft','review','approved','published') ORDER BY u.unit_number"
    ).all<AcademyUnit>();
    return result.results ?? [];
  }
  const result = await db.prepare(
    "SELECT course_key, level, unit_number, unit_id, title FROM learning_course_json_units WHERE level = ? AND course_key = ? ORDER BY unit_number"
  ).bind(levelValue.toUpperCase(), `ingles-${levelValue.toLowerCase()}`).all<AcademyUnit>();
  return result.results ?? [];
}

export async function getAcademyUnit(levelValue: string, unitNumber: number): Promise<AcademyUnit & { content: Record<string, any> } | null> {
  if (!validLevel(levelValue) || !Number.isInteger(unitNumber) || unitNumber < 1 || unitNumber > 100) return null;
  const db = await database();
  if (levelValue.toUpperCase() === "A1" && unitNumber >= 1 && unitNumber <= 6) {
    const unit = await db.prepare("SELECT c.id AS course_key, c.cefr_level AS level, u.unit_number, u.id AS unit_id, u.title, u.learning_objectives_json FROM courses c JOIN units u ON u.course_id=c.id WHERE c.id='course-en-a1' AND u.unit_number=? AND u.status IN ('draft','review','approved','published') LIMIT 1").bind(unitNumber).first<AcademyUnit & { learning_objectives_json?: string }>();
    if (!unit) return null;
    const rows = await db.prepare("SELECT s.id AS section_id, s.section_type, s.title AS section_title, e.id AS exercise_id, e.title AS exercise_title, e.instructions, e.content_json, e.position, o.id AS option_id, o.option_key, o.content AS option_content FROM sections s JOIN exercises e ON e.section_id=s.id LEFT JOIN exercise_options o ON o.exercise_id=e.id WHERE s.unit_id=? AND s.status IN ('draft','review','approved','published') AND e.status='published' ORDER BY s.position,e.position,o.position").bind(unit.unit_id).all<{section_id:string;section_type:string;section_title:string;exercise_id:string;exercise_title:string;instructions:string;content_json:string;position:number;option_id:string|null;option_key:string|null;option_content:string|null}>();
    const grouped = new Map<string, any>();
    for (const row of rows.results ?? []) {
      if (!grouped.has(row.section_id)) grouped.set(row.section_id, { block_id: row.section_type, title: row.section_title, duration_minutes: 18, content: [] });
      const block = grouped.get(row.section_id);
      let activity = block.content.find((item: any) => item.interaction_id === row.exercise_id);
      if (!activity) {
        let authored: Record<string, any> = {};
        try { authored = JSON.parse(row.content_json || "{}"); } catch {}
        activity = { interaction_id: row.exercise_id, type: "multiple_choice", prompt_es: authored.prompt_es || row.instructions, stimulus_en: authored.stimulus_en || "", explanation: authored.explanation_es || "", options: [] };
        block.content.push(activity);
      }
      if (row.option_id) activity.options.push({ id: row.option_id, value: row.option_key || row.option_id, text: row.option_content || row.option_key });
    }
    let objectives: string[] = [];
    try { objectives = JSON.parse(unit.learning_objectives_json || "[]"); } catch {}
    return { ...unit, course_key: "ingles-a1", content: { course: { total_duration_minutes: 75 }, learning_outcomes: objectives, blocks: Array.from(grouped.values()) } };
  }
  if (levelValue.toUpperCase() === "A2") {
    const unitId = `a2-unit-${String(unitNumber).padStart(3, "0")}`;
    const relationalUnit = await db.prepare(
      "SELECT 'ingles-a2' AS course_key, 'A2' AS level, u.unit_number, u.id AS unit_id, u.title, u.learning_objectives_json, u.status AS status FROM courses c JOIN units u ON u.course_id=c.id WHERE c.cefr_level='A2' AND c.language_code='en' AND u.id=? AND u.status IN ('draft','review','approved','published') LIMIT 1"
    ).bind(unitId).first<AcademyUnit & { learning_objectives_json?: string; status?: string }>();
    if (relationalUnit) {
      const rows = await db.prepare(
        "SELECT s.id AS section_id, s.section_type, s.title AS section_title, s.position AS section_position, e.id AS exercise_id, e.title AS exercise_title, e.instructions, e.content_json, e.position AS exercise_position, o.id AS option_id, o.option_key, o.content AS option_content, o.position AS option_position FROM sections s JOIN exercises e ON e.section_id=s.id LEFT JOIN exercise_options o ON o.exercise_id=e.id WHERE s.unit_id=? AND s.status IN ('draft','review','approved','published') AND e.status IN ('draft','review','approved','published') ORDER BY s.position,e.position,o.position"
      ).bind(unitId).all<{section_id:string;section_type:string;section_title:string;section_position:number;exercise_id:string;exercise_title:string;instructions:string;content_json:string;exercise_position:number;option_id:string|null;option_key:string|null;option_content:string|null;option_position:number|null}>();
      const grouped = new Map<string, any>();
      for (const row of rows.results ?? []) {
        if (!grouped.has(row.section_id)) grouped.set(row.section_id, { block_id: row.section_type, title: row.section_title, duration_minutes: 15, content: [] });
        const block = grouped.get(row.section_id);
        let activity = block.content.find((item: any) => item.interaction_id === row.exercise_id);
        if (!activity) {
          let authored: Record<string, any> = {};
          try { authored = JSON.parse(row.content_json || "{}"); } catch {}
          const section = row.section_type;
          const audioGroupValue = authored.audio_group;
          const audioGroupMatch = typeof audioGroupValue === "string"
            ? /^listening-(\d+)$/.exec(audioGroupValue)
            : null;
          const audioTrack = Number.isInteger(audioGroupValue)
            ? Number(audioGroupValue)
            : audioGroupMatch ? Number(audioGroupMatch[1]) : NaN;
          const hasAudio = section === "listening" &&
            typeof authored.audio_key === "string" &&
            Number.isInteger(audioTrack) && audioTrack >= 1 && audioTrack <= 3;
          activity = {
            interaction_id: row.exercise_id,
            type: "multiple_choice",
            prompt_es: row.instructions,
            question_en: authored.prompt || row.exercise_title,
            stimulus_en: "",
            transcript: section === "listening" ? (authored.stimulus || "") : undefined,
            audio_group: hasAudio ? audioTrack : undefined,
            audio_url: hasAudio ? `/api/academia/a2/${unitNumber}/audio/${audioTrack}` : undefined,
            main_text: section === "reading" ? (authored.stimulus || "") : undefined,
            explanation: authored.explanation_es || "",
            options: []
          };
          block.content.push(activity);
        }
        if (row.option_id) activity.options.push({ id: row.option_id, value: row.option_key || row.option_id, text: row.option_content || row.option_key });
      }
      const blocks = Array.from(grouped.values());
      if (blocks.length) {
        let objectives: string[] = [];
        try { objectives = JSON.parse(relationalUnit.learning_objectives_json || "[]"); } catch {}
        return {
          ...relationalUnit,
          course_key: "ingles-a2",
          content: {
            course: { total_duration_minutes: 60 },
            learning_outcomes: objectives,
            ...(relationalUnit.status === "published" ? {} : { editorial_status: "BORRADOR EDITORIAL · NO PUBLICADO" }),
            blocks
          }
        };
      }
    }
    const row = await db.prepare(
      "SELECT 'ingles-a2' AS course_key, 'A2' AS level, u.unit_number, u.id AS unit_id, u.title, b.content_json FROM unit_content_blueprints b JOIN units u ON u.id = b.unit_id WHERE b.unit_id = ? AND b.status IN ('draft','review','approved') LIMIT 1"
    ).bind(unitId).first<AcademyUnit>();
    if (!row?.content_json) return null;
    try { return { ...row, content: JSON.parse(row.content_json) as Record<string, any> }; }
    catch { return null; }
  }
  const row = await db.prepare(
    "SELECT course_key, level, unit_number, unit_id, title, content_json FROM learning_course_json_units WHERE level = ? AND course_key = ? AND unit_number = ? LIMIT 1"
  ).bind(levelValue.toUpperCase(), `ingles-${levelValue.toLowerCase()}`, unitNumber).first<AcademyUnit>();
  if (!row?.content_json) return null;
  try { return { ...row, content: JSON.parse(row.content_json) as Record<string, any> }; }
  catch { return null; }
}

export function isCefrLevel(value: string): value is CefrLevel { return validLevel(value); }
