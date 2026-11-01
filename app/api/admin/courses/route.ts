import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStripeContext } from "@/lib/stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic="force-dynamic";
type Statement={bind(...values:(string|number)[]):Statement;all<T>():Promise<{results?:T[]}>;first<T>():Promise<T|null>;run():Promise<unknown>};
type DB={prepare(sql:string):Statement};
function equal(a:string,b:string){if(a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}
async function getDb(){const {env}=await getStripeContext(),secret=env.SUPPORT_ADMIN_KEY,jar=await cookies();if(!secret||!equal(jar.get("lf_admin_session")?.value||"",secret))return null;const {env:cf}=await getCloudflareContext();return (cf as unknown as {COURSE_DB:DB}).COURSE_DB;}
const levels=["A1","A2","B1","B2","C1","C2"];
const statuses=["draft","review","published"];
export async function GET(){
 try{const db=await getDb();if(!db)return NextResponse.json({error:"No autorizado."},{status:401});
 const result=await db.prepare("SELECT c.id,c.language_code,c.cefr_level,c.title,c.description,c.sort_order,c.status,c.created_at,COUNT(u.id) AS unit_count FROM courses c LEFT JOIN units u ON u.course_id=c.id GROUP BY c.id ORDER BY c.sort_order,c.cefr_level").all<Record<string,unknown>>();
 return NextResponse.json({courses:result.results||[]});
 }catch(error){console.error("admin courses list failed",error);return NextResponse.json({error:"No se pudieron cargar los cursos."},{status:500});}
}
export async function POST(request:Request){
 try{const db=await getDb();if(!db)return NextResponse.json({error:"No autorizado."},{status:401});
 const body=await request.json() as {language_code?:string;cefr_level?:string;title?:string;description?:string;status?:string};
 const language=(body.language_code||"en").trim().toLowerCase(),level=(body.cefr_level||"").trim().toUpperCase(),title=(body.title||"").trim(),description=(body.description||"").trim(),status=body.status||"draft";
 if(!/^[a-z]{2,5}$/.test(language)||!levels.includes(level)||!title||title.length>160||description.length>2000||!statuses.includes(status))return NextResponse.json({error:"Revisa el idioma, nivel, título, descripción y estado."},{status:400});
 const exists=await db.prepare("SELECT id FROM courses WHERE language_code=? AND cefr_level=?").bind(language,level).first<{id:string}>();
 if(exists)return NextResponse.json({error:"Ya existe un curso para ese idioma y nivel.",course_id:exists.id},{status:409});
 const sort=await db.prepare("SELECT COALESCE(MAX(sort_order),0)+1 AS next_order FROM courses").first<{next_order:number}>();
 const id="course-"+language+"-"+level.toLowerCase();
 await db.prepare("INSERT INTO courses (id,language_code,cefr_level,title,description,sort_order,status) VALUES (?,?,?,?,?,?,?)").bind(id,language,level,title,description,sort?.next_order||1,status).run();
 const course=await db.prepare("SELECT id,language_code,cefr_level,title,description,sort_order,status,created_at FROM courses WHERE id=?").bind(id).first<Record<string,unknown>>();
 return NextResponse.json({course},{status:201});
 }catch(error){console.error("admin course create failed",error);return NextResponse.json({error:"No se pudo crear el curso."},{status:500});}
}
