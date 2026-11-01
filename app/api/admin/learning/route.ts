import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStripeContext } from "@/lib/stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";
export const dynamic = "force-dynamic";
type Statement = { bind(...values:(string|number)[]): Statement; all<T>():Promise<{results?:T[]}>; first<T>():Promise<T|null> };
type DB = { prepare(sql:string):Statement };
function equal(a:string,b:string){if(a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}
async function authorized(){const {env}=await getStripeContext();const secret=env.SUPPORT_ADMIN_KEY;const jar=await cookies();return !!secret&&equal(jar.get("lf_admin_session")?.value||"",secret);}
export async function GET(request:Request){
 if(!(await authorized()))return NextResponse.json({error:"No autorizado."},{status:401});
 try{
  const {env}=await getCloudflareContext();const db=(env as unknown as {COURSE_DB:DB}).COURSE_DB;
  const url=new URL(request.url);const table=url.searchParams.get("table");
  const tables=(await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all<{name:string}>()).results||[];
  const counts:Record<string,number>={};
  await Promise.all(tables.map(async ({name})=>{if(!/^[a-zA-Z0-9_]+$/.test(name))return;try{const row=await db.prepare("SELECT COUNT(*) AS total FROM "+name).first<{total:number}>();counts[name]=row?.total??0;}catch{counts[name]=0;}}));
  const [courses,attempts,reviews]=await Promise.all([
   db.prepare("SELECT level,course_key,COUNT(*) AS units,MAX(title) AS sample_title FROM learning_course_json_units GROUP BY level,course_key ORDER BY level").all<Record<string,unknown>>().catch(()=>({results:[]})),
   db.prepare("SELECT a.id,a.learner_id,u.display_name,u.email,a.course_key,a.unit_id,a.interaction_id,a.mastery_tag,a.answer_text,a.is_correct,a.attempted_at FROM learner_activity_attempts a LEFT JOIN learner_accounts u ON u.learner_id=a.learner_id ORDER BY a.attempted_at DESC LIMIT 200").all<Record<string,unknown>>().catch(()=>({results:[]})),
   db.prepare("SELECT r.learner_id,u.display_name,u.email,r.course_key,r.mastery_tag,r.failure_count,r.success_streak,r.interval_hours,r.due_at,r.last_attempt_at FROM learner_skill_reviews r LEFT JOIN learner_accounts u ON u.learner_id=r.learner_id ORDER BY r.due_at ASC LIMIT 200").all<Record<string,unknown>>().catch(()=>({results:[]})),
  ]);
  let tableData:{columns:string[];rows:Record<string,unknown>[]} | null=null;
  if(table && tables.some(t=>t.name===table) && /^[a-zA-Z0-9_]+$/.test(table)){
   const info=await db.prepare("PRAGMA table_info("+table+")").all<{name:string}>();
   const columns=(info.results||[]).map(c=>c.name);
   const rows=(await db.prepare("SELECT * FROM "+table+" LIMIT 100").all<Record<string,unknown>>()).results||[];
   tableData={columns,rows};
  }
  return NextResponse.json({tables:tables.map(t=>({name:t.name,count:counts[t.name]??0})),courses:courses.results||[],attempts:attempts.results||[],reviews:reviews.results||[],tableData});
 }catch(error){console.error("admin learning data failed",error);return NextResponse.json({error:"No se pudieron cargar los datos académicos."},{status:500});}
}
