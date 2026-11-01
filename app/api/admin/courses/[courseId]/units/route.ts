import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStripeContext } from "@/lib/stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";
export const dynamic="force-dynamic";
type Statement={bind(...values:(string|number)[]):Statement;all<T>():Promise<{results?:T[]}>;first<T>():Promise<T|null>;run():Promise<unknown>};
type DB={prepare(sql:string):Statement};
function equal(a:string,b:string){if(a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}
async function getDb(){const {env}=await getStripeContext(),secret=env.SUPPORT_ADMIN_KEY,jar=await cookies();if(!secret||!equal(jar.get("lf_admin_session")?.value||"",secret))return null;const {env:cf}=await getCloudflareContext();return (cf as unknown as {COURSE_DB:DB}).COURSE_DB;}
export async function POST(request:Request,{params}:{params:Promise<{courseId:string}>}){
 try{const db=await getDb();if(!db)return NextResponse.json({error:"No autorizado."},{status:401});const {courseId}=await params;
 const course=await db.prepare("SELECT id FROM courses WHERE id=?").bind(courseId).first<{id:string}>();if(!course)return NextResponse.json({error:"Curso no encontrado."},{status:404});
 const body=await request.json() as {title?:string;learning_objectives?:string[]};
 const title=(body.title||"").trim(),objectives=Array.isArray(body.learning_objectives)?body.learning_objectives.map(x=>String(x).trim()).filter(Boolean).slice(0,20):[];
 if(!title||title.length>180)return NextResponse.json({error:"El título de la unidad es obligatorio (máximo 180 caracteres)."},{status:400});
 const current=await db.prepare("SELECT COALESCE(MAX(unit_number),0) AS last_number FROM units WHERE course_id=?").bind(courseId).first<{last_number:number}>();
 const number=Number(current?.last_number||0)+1;if(number>100)return NextResponse.json({error:"Este curso ya tiene el máximo de 100 unidades."},{status:409});
 const id=courseId+"-unit-"+String(number).padStart(3,"0");
 await db.prepare("INSERT INTO units (id,course_id,unit_number,title,learning_objectives_json,status) VALUES (?,?,?,?,?,'draft')").bind(id,courseId,number,title,JSON.stringify(objectives)).run();
 const unit=await db.prepare("SELECT id,course_id,unit_number,title,learning_objectives_json,status,created_at FROM units WHERE id=?").bind(id).first<Record<string,unknown>>();
 return NextResponse.json({unit},{status:201});
 }catch(error){console.error("admin unit create failed",error);return NextResponse.json({error:"No se pudo crear la unidad."},{status:500});}
}
