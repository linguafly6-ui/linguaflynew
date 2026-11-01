import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStripeContext } from "@/lib/stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getAcademyUnit } from "@/lib/academy";

export const dynamic = "force-dynamic";
type Statement = { bind(...values: (string|number)[]): Statement; all<T>(): Promise<{results?:T[]}>; first<T>(): Promise<T|null> };
type DB = { prepare(sql:string): Statement };
type Exercise = { interaction_id?:string; correct_answer?:string|string[]|boolean; mastery_tag?:string };
function equal(a:string,b:string){if(a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}
async function authorized(){
 const {env}=await getStripeContext(),secret=env.SUPPORT_ADMIN_KEY,jar=await cookies();
 return !!secret && equal(jar.get("lf_admin_session")?.value||"",secret);
}
function findExercise(content:Record<string,any>, interactionId:string):Exercise|undefined{
 for(const block of Array.isArray(content.blocks)?content.blocks:[]){
  const found=(Array.isArray(block.content)?block.content:[]).find((item:Exercise)=>item.interaction_id===interactionId);
  if(found)return found;
 }
 return undefined;
}
export async function GET(_request:Request,{params}:{params:Promise<{learnerId:string}>}){
 try{
  if(!(await authorized()))return NextResponse.json({error:"No autorizado."},{status:401});
  const {learnerId}=await params;
  if(!learnerId || learnerId.length>128)return NextResponse.json({error:"Alumno no válido."},{status:400});
  const {env}=await getCloudflareContext(),db=(env as unknown as {COURSE_DB:DB}).COURSE_DB;
  const student=await db.prepare("SELECT a.learner_id,a.email,a.display_name,a.created_at,l.status AS account_status FROM learner_accounts a JOIN learners l ON l.id=a.learner_id WHERE a.learner_id=?").bind(learnerId).first<Record<string,unknown>>();
  if(!student)return NextResponse.json({error:"Alumno no encontrado."},{status:404});
  const enrolments=await db.prepare("SELECT course_key,status,created_at FROM course_enrolments WHERE learner_id=? ORDER BY course_key").bind(learnerId).all<Record<string,unknown>>();
  const attempts=await db.prepare("SELECT id,course_key,unit_id,interaction_id,mastery_tag,answer_text,is_correct,attempted_at FROM learner_activity_attempts WHERE learner_id=? ORDER BY attempted_at DESC LIMIT 500").bind(learnerId).all<Record<string,any>>();
  const reviews=await db.prepare("SELECT course_key,mastery_tag,failure_count,success_streak,interval_hours,due_at,last_attempt_at FROM learner_skill_reviews WHERE learner_id=? ORDER BY due_at").bind(learnerId).all<Record<string,unknown>>();
  const rows=attempts.results||[];
  const mistakes=await Promise.all(rows.filter(row=>Number(row.is_correct)===0).map(async row=>{
   let expectedAnswer:string|string[]|boolean|null=null;
   const normalizedUnit=String(row.unit_id||"").toUpperCase().replace("-UNIT-","-");\n   const match=normalizedUnit.match(/^([A-C][1-2])-(\\d+)$/);
   if(match){
    try{const unit=await getAcademyUnit(match[1].toUpperCase(),Number(match[2]));if(unit){const exercise=findExercise(unit.content,row.interaction_id);expectedAnswer=exercise?.correct_answer??null;}}catch{}
   }
   return {...row,expected_answer:expectedAnswer};
  }));
  const byCourse=new Map<string,{course_key:string;attempts:number;correct:number;failed:number;units:Set<string>}>();
  for(const row of rows){const key=String(row.course_key);const item=byCourse.get(key)||{course_key:key,attempts:0,correct:0,failed:0,units:new Set<string>()};item.attempts++;if(Number(row.is_correct)===1)item.correct++;else item.failed++;item.units.add(String(row.unit_id));byCourse.set(key,item);}
  const progress=[...byCourse.values()].map(item=>({course_key:item.course_key,attempts:item.attempts,correct:item.correct,failed:item.failed,units_with_activity:item.units.size,accuracy:item.attempts?Math.round(item.correct/item.attempts*100):0}));
  return NextResponse.json({student,enrolments:enrolments.results||[],progress,attempts:rows,mistakes,reviews:reviews.results||[]});
 }catch(error){console.error("admin learner detail failed",error);return NextResponse.json({error:"No se pudo cargar la ficha del alumno."},{status:500});}
}
