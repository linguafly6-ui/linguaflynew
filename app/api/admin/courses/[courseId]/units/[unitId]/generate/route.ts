import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { getStripeContext } from "@/lib/stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";
const MODEL = "@cf/zai-org/glm-4.7-flash";
const CATEGORIES = ["grammar", "vocabulary", "listening", "reading"] as const;
type Category = typeof CATEGORIES[number];
type Statement = { bind(...values: (string | number)[]): Statement; first<T>(): Promise<T | null>; run(): Promise<unknown> };
type DB = { prepare(sql: string): Statement };
type AI = { run(model: string, input: Record<string, unknown>): Promise<unknown> };
const safeEqual = (a: string, b: string) => { if (a.length !== b.length) return false; let n=0; for(let i=0;i<a.length;i++) n |= a.charCodeAt(i)^b.charCodeAt(i); return n===0; };
async function getAdminContext() {
  const { env } = await getStripeContext();
  const secret = env.SUPPORT_ADMIN_KEY;
  const jar = await cookies();
  if (!secret || !safeEqual(jar.get("lf_admin_session")?.value || "", secret)) return null;
  const { env: cf } = await getCloudflareContext();
  const runtime = cf as unknown as { COURSE_DB: DB; AI?: AI };
  if (!runtime.COURSE_DB || !runtime.AI) throw new Error("Faltan los bindings COURSE_DB o AI de Cloudflare.");
  return runtime;
}
function extractText(result: unknown): string {
  const value = result as { response?: unknown; choices?: Array<{message?:{content?:unknown}}> };
  const candidate = value?.response ?? value?.choices?.[0]?.message?.content;
  if (typeof candidate === "string") return candidate;
  if (candidate && typeof candidate === "object") return JSON.stringify(candidate);
  throw new Error("Workers AI no devolvió contenido de texto.");
}
function parseJson(text: string): unknown {
  const cleaned = text.trim().replace(/^\`\`\`(?:json)?\s*/i, "").replace(/\s*\`\`\`$/, "");
  const start = cleaned.indexOf("{"), end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("La respuesta de IA no contiene un objeto JSON.");
  return JSON.parse(cleaned.slice(start, end + 1));
}
function validateActivities(raw: unknown, category: Category) {
  if (!Array.isArray(raw) || raw.length !== 15) throw new Error(category + ": se esperaban exactamente 15 ejercicios.");
  const seen = new Set<string>();
  return raw.map((item, index) => {
    const a = item as Record<string, unknown>;
    const id = String(a.interaction_id || "").trim();
    const type = String(a.type || "");
    const prompt = String(a.prompt_es || "").trim();
    const explanation = String(a.explanation || "").trim();
    const correct = String(a.correct_answer || "").trim();
    if (!id || seen.has(id) || !prompt || !explanation || !correct) throw new Error(category + ": ejercicio " + (index+1) + " incompleto o con ID duplicado.");
    seen.add(id);
    if (type !== "multiple_choice" && type !== "fill_blank") throw new Error(category + ": tipo de actividad no compatible.");
    const activity: Record<string, unknown> = { interaction_id:id, type, prompt_es:prompt, question_en:String(a.question_en || ""), explanation, correct_answer:correct, mastery_tag:category };
    if (type === "multiple_choice") {
      if (!Array.isArray(a.options) || a.options.length < 3 || a.options.length > 4) throw new Error(category + ": cada selección múltiple necesita 3 o 4 opciones.");
      const options = a.options.map((option, i) => {
        const o = option as Record<string, unknown>;
        return { id: String(o.id || String.fromCharCode(65+i)), text: String(o.text || "").trim() };
      });
      if (options.some(o => !o.text) || !options.some(o => o.text === correct || o.id === correct)) throw new Error(category + ": la respuesta correcta no coincide con las opciones.");
      activity.options = options;
      activity.correct_answer = options.find(o => o.text === correct || o.id === correct)!.text;
    } else {
      if (!String(a.stimulus_en || "").trim()) throw new Error(category + ": completar huecos requiere stimulus_en.");
      activity.stimulus_en = String(a.stimulus_en).trim();
    }
    if (category === "listening") {
      if (!String(a.transcript || "").trim()) throw new Error("Listening necesita un transcript para reproducir el diálogo.");
      activity.transcript = String(a.transcript).trim();
    }
    if (category === "reading") {
      if (!String(a.main_text || "").trim()) throw new Error("Reading necesita main_text para la comprensión lectora.");
      activity.main_text = String(a.main_text).trim();
    }
    return activity;
  });
}
async function generateCategory(ai: AI, category: Category, level: string, title: string, editorial: string) {
  const system = "Eres un diseñador curricular experto en inglés como lengua extranjera y niveles CEFR. Devuelve exclusivamente JSON válido, sin Markdown ni comentarios. No inventes objetivos ajenos al material editorial.";
  const user = `Diseña exactamente 15 ejercicios para la competencia ${category.toUpperCase()} de inglés nivel ${level}, unidad "${title}". Sigue este formato de actividad de LinguaFly.
CONTENIDO EDITORIAL Y OBJETIVOS:
${editorial}
REGLAS:
- Respuesta en inglés en los estímulos y opciones; prompt_es y explanation en español claro.
- IDs únicos: prefijo g para grammar, v para vocabulary, l para listening, r para reading, seguidos de dos dígitos.
- Solo type "multiple_choice" o "fill_blank".
- multiple_choice: options es array de 3 objetos { "id":"A", "text":"..." }; correct_answer debe coincidir exactamente con el texto de una opción.
- fill_blank: incluye stimulus_en y correct_answer.
- Todos incluyen interaction_id, type, prompt_es, question_en, explanation y correct_answer.
- Grammar: evaluar únicamente las estructuras gramaticales presentes en el material.
- Vocabulary: usar únicamente vocabulario enseñado en el material, en contexto.
- Listening: incluye transcript completo en cada ejercicio, adecuado al nivel; las preguntas deben comprobar detalles e inferencias del diálogo.
- Reading: incluye main_text completo en cada ejercicio; textos auténticos y preguntas de comprensión.
- Varía contextos y dificultad; no repitas preguntas ni respuestas obvias.
- No incluyas speaking ni writing.
Devuelve {"exercises":[...]} con exactamente 15 objetos.`;
  const result = await ai.run(MODEL, { messages: [{ role:"system", content:system }, { role:"user", content:user }], max_tokens: 7500, temperature: 0.35 });
  const parsed = parseJson(extractText(result)) as { exercises?: unknown };
  return validateActivities(parsed.exercises, category);
}
export async function POST(_request: Request, { params }: { params: Promise<{ courseId: string; unitId: string }> }) {
  let runtime: Awaited<ReturnType<typeof getAdminContext>>;
  try { runtime = await getAdminContext(); } catch (error) { console.error("AI bindings unavailable", error); return NextResponse.json({ error:"Workers AI no está configurado en este entorno." }, { status:503 }); }
  if (!runtime) return NextResponse.json({ error:"No autorizado." }, { status:401 });
  const { courseId, unitId } = await params;
  try {
    const course = await runtime.COURSE_DB.prepare("SELECT id,cefr_level,title FROM courses WHERE id=?").bind(courseId).first<{id:string;cefr_level:string;title:string}>();
    if (!course) return NextResponse.json({ error:"Curso no encontrado." }, { status:404 });
    let editorial: Record<string, unknown> | null = null;
    const blueprint = await runtime.COURSE_DB.prepare("SELECT content_json FROM unit_content_blueprints WHERE unit_id=? AND status IN ('draft','review','approved')").bind(unitId).first<{content_json:string}>();
    if (blueprint?.content_json) editorial = JSON.parse(blueprint.content_json) as Record<string, unknown>;
    if (!editorial) {
      const row = await runtime.COURSE_DB.prepare("SELECT content_json FROM learning_course_json_units WHERE unit_id=? AND level=? LIMIT 1").bind(unitId, course.cefr_level).first<{content_json:string}>();
      if (row?.content_json) editorial = JSON.parse(row.content_json) as Record<string, unknown>;
    }
    if (!editorial) return NextResponse.json({ error:"La unidad no tiene contenido editorial disponible para generar ejercicios." }, { status:409 });
    const title = String((editorial.course as Record<string,unknown> | undefined)?.unit_title || (editorial as Record<string,unknown>).title || unitId);
    const editorialText = JSON.stringify({
      learning_outcomes: editorial.learning_outcomes || editorial.learning_objectives || [],
      grammar_lesson: editorial.grammar_lesson || editorial.grammar || null,
      vocabulary: editorial.vocabulary || [],
      reading: editorial.reading || null,
      listening: editorial.listening || null
    }).slice(0, 14000);
    const existing = await runtime.COURSE_DB.prepare("SELECT id FROM unit_generated_exercise_drafts WHERE course_id=? AND unit_id=?").bind(unitId).first<{id:string}>();
    if (existing) return NextResponse.json({ error:"Esta unidad ya tiene una generación guardada. No se sobrescribirá; revisa o elimina el borrador antes de volver a generar." }, { status:409 });
    const generated: Record<string, unknown> = {};
    for (const category of CATEGORIES) generated[category] = await generateCategory(runtime.AI!, category, course.cefr_level, title, editorialText);
    const counts = Object.fromEntries(CATEGORIES.map(category => [category, (generated[category] as unknown[]).length]));
    const id = randomUUID();
    await runtime.COURSE_DB.prepare("INSERT INTO unit_generated_exercise_drafts (id,course_id,unit_id,level,model,content_json,status) VALUES (?,?,?,?,?,?,'review')")
      .bind(id,courseId,unitId,course.cefr_level,MODEL,JSON.stringify(generated)).run();
    return NextResponse.json({ id, unit_id:unitId, level:course.cefr_level, status:"review", model:MODEL, total:60, counts, message:"60 ejercicios generados y guardados como borrador de revisión. Todavía no están publicados." }, { status:201 });
  } catch (error) {
    console.error("exercise generation failed", error);
    const message = error instanceof Error ? error.message : "Error de generación.";
    return NextResponse.json({ error:message.slice(0,400) }, { status:502 });
  }
}
