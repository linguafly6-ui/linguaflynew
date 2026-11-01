import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStripeContext } from "@/lib/stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";
type Statement = { bind(...values: (string|number)[]): Statement; all<T>(): Promise<{results?:T[]}>; first<T>(): Promise<T|null> };
type DB = { prepare(sql:string): Statement };
function equal(a:string,b:string){if(a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}
async function authorized(){
 const {env}=await getStripeContext(),secret=env.SUPPORT_ADMIN_KEY,jar=await cookies();
 return !!secret && equal(jar.get("lf_admin_session")?.value||"",secret);
}
function parseJson(value:unknown):any{if(typeof value!=="string")return value??null;try{return JSON.parse(value);}catch{return value;}}
function expectedFromConfig(value:unknown):unknown{
 const config=parseJson(value);
 if(!config||typeof config!=="object")return null;
 const obj=config as Record<string,unknown>;
 for(const key of ["correct_answer","correctAnswer","expected_answer","expectedAnswer","answer","answers","accepted_answers","acceptedAnswers"]){
  if(obj[key]!==undefined)return obj[key];
 }
 return null;
}
export async function GET(_request:Request,{params}:{params:Promise<{learnerId:string}>}){
 try{
  if(!(await authorized()))return NextResponse.json({error:"No autorizado."},{status:401});
  const {learnerId}=await params;
  if(!learnerId || learnerId.length>128)return NextResponse.json({error:"Alumno no válido."},{status:400});
  const {env}=await getCloudflareContext(),db=(env as unknown as {COURSE_DB:DB}).COURSE_DB;
  const student=await db.prepare("SELECT a.learner_id,a.email,a.display_name,a.created_at,l.status AS account_status FROM learner_accounts a JOIN learners l ON l.id=a.learner_id WHERE a.learner_id=?").bind(learnerId).first<Record<string,unknown>>();
  if(!student)return NextResponse.json({error:"Alumno no encontrado."},{status:404});
  const [enrolments,unitProgress,attempts,reviews,competencies]=await Promise.all([
   db.prepare("SELECT course_key,status,enrolled_at AS created_at FROM course_enrolments WHERE learner_id=? ORDER BY course_key").bind(learnerId).all<Record<string,unknown>>(),
   db.prepare("SELECT p.unit_id,p.status,p.exercises_attempted,p.exercises_correct,p.started_at,p.completed_at,p.updated_at,u.unit_number,u.title,c.cefr_level,c.title AS course_title FROM learner_unit_progress p LEFT JOIN units u ON u.id=p.unit_id LEFT JOIN courses c ON c.id=u.course_id WHERE p.learner_id=? ORDER BY c.sort_order,u.unit_number").bind(learnerId).all<Record<string,any>>(),
   db.prepare("SELECT a.id,a.exercise_id,a.response_json,a.is_correct,a.score,a.max_score,a.feedback_json,a.grading_version,a.attempted_at,e.exercise_code,e.title AS exercise_title,s.section_type,u.id AS unit_id,u.unit_number,u.title AS unit_title,c.cefr_level,er.error_code,er.error_detail_json,ak.answer_config_json FROM learning_attempts a LEFT JOIN exercises e ON e.id=a.exercise_id LEFT JOIN sections s ON s.id=e.section_id LEFT JOIN units u ON u.id=s.unit_id LEFT JOIN courses c ON c.id=u.course_id LEFT JOIN learner_error_events er ON er.attempt_id=a.id LEFT JOIN exercise_answer_keys ak ON ak.exercise_id=a.exercise_id WHERE a.learner_id=? ORDER BY a.attempted_at DESC LIMIT 500").bind(learnerId).all<Record<string,any>>(),
   db.prepare("SELECT r.exercise_id,r.due_at,r.interval_days,r.ease_factor,r.repetitions,r.lapses,r.last_quality,r.updated_at,e.exercise_code,e.title AS exercise_title,u.id AS unit_id,u.unit_number,c.cefr_level FROM spaced_repetition_items r LEFT JOIN exercises e ON e.id=r.exercise_id LEFT JOIN sections s ON s.id=e.section_id LEFT JOIN units u ON u.id=s.unit_id LEFT JOIN courses c ON c.id=u.course_id WHERE r.learner_id=? ORDER BY r.due_at").bind(learnerId).all<Record<string,unknown>>(),
   db.prepare("SELECT p.competency_id,p.evidence_count,p.correct_count,p.mastery_score,p.last_evidence_at,cp.title AS competency_title,cp.skill,cp.cefr_level FROM learner_competency_progress p LEFT JOIN competencies cp ON cp.id=p.competency_id WHERE p.learner_id=? ORDER BY cp.cefr_level,cp.skill").bind(learnerId).all<Record<string,unknown>>()
  ]);
  type AttemptRow = Record<string, any>;
  const rows: AttemptRow[] = attempts.results || [];
  const normalized: AttemptRow[] = rows.map((row: AttemptRow) => ({
   ...row,
   response: parseJson(row.response_json),
   feedback: parseJson(row.feedback_json),
   error_detail: parseJson(row.error_detail_json),
   expected_answer: expectedFromConfig(row.answer_config_json)
  }));
  const mistakes=normalized.filter(row=>Number(row.is_correct)===0);
  const byCourse=new Map<string,{course_key:string;attempts:number;correct:number;failed:number;units:Set<string>}>();
  for(const row of normalized){const key="ingles-"+String(row.cefr_level||"").toLowerCase();const item=byCourse.get(key)||{course_key:key,attempts:0,correct:0,failed:0,units:new Set<string>()};item.attempts++;if(Number(row.is_correct)===1)item.correct++;else item.failed++;if(row.unit_id)item.units.add(String(row.unit_id));byCourse.set(key,item);}
  const progress=[...(unitProgress.results||[])].map(row=>({...row,accuracy:Number(row.exercises_attempted)>0?Math.round(Number(row.exercises_correct)/Number(row.exercises_attempted)*100):0}));
  return NextResponse.json({student,enrolments:enrolments.results||[],progress,course_progress:[...byCourse.values()].map(item=>({course_key:item.course_key,attempts:item.attempts,correct:item.correct,failed:item.failed,units_with_activity:item.units.size,accuracy:item.attempts?Math.round(item.correct/item.attempts*100):0})),attempts:normalized,mistakes,reviews:reviews.results||[],competencies:competencies.results||[]});
 }catch(error){console.error("admin learner detail failed",error);return NextResponse.json({error:"No se pudo cargar la ficha del alumno."},{status:500});}
}
