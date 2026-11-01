import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStripeContext } from "@/lib/stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";
export const dynamic="force-dynamic";
type Statement={bind(...values:(string|number)[]):Statement;all<T>():Promise<{results?:T[]}>;first<T>():Promise<T|null>;run():Promise<unknown>};
type DB={prepare(sql:string):Statement};
function equal(a:string,b:string){if(a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}
async function getDb(){const {env}=await getStripeContext(),secret=env.SUPPORT_ADMIN_KEY,jar=await cookies();if(!secret||!equal(jar.get("lf_admin_session")?.value||"",secret))return null;const {env:cf}=await getCloudflareContext();return (cf as unknown as {COURSE_DB:DB}).COURSE_DB;}
const statuses=["draft","review","published"];
export async function GET(_request:Request,{params}:{params:Promise<{courseId:string}>}){
 try{const db=await getDb();if(!db)return NextResponse.json({error:"No autorizado."},{status:401});const {courseId}=await params;
 const course=await db.prepare("SELECT id,language_code,cefr_level,title,description,sort_order,status,created_at FROM courses WHERE id=?").bind(courseId).first<Record<string,unknown>>();
 if(!course)return NextResponse.json({error:"Curso no encontrado."},{status:404});
 const units=await db.prepare("SELECT id,course_id,unit_number,title,learning_objectives_json,status,created_at FROM units WHERE course_id=? ORDER BY unit_number").bind(courseId).all<Record<string,unknown>>();
 return NextResponse.json({course,units:units.results||[]});
 }catch(error){console.error("admin course detail failed",error);return NextResponse.json({error:"No se pudo cargar el curso."},{status:500});}
}
export async function PATCH(request:Request,{params}:{params:Promise<{courseId:string}>}){
 try{const db=await getDb();if(!db)return NextResponse.json({error:"No autorizado."},{status:401});const {courseId}=await params;
 const body=await request.json() as {title?:string;description?:string;status?:string};
 const current=await db.prepare("SELECT id FROM courses WHERE id=?").bind(courseId).first<{id:string}>();if(!current)return NextResponse.json({error:"Curso no encontrado."},{status:404});
 const fields:string[]=[],values:(string|number)[]=[];
 if(body.title!==undefined){const title=body.title.trim();if(!title||title.length>160)return NextResponse.json({error:"El título debe tener entre 1 y 160 caracteres."},{status:400});fields.push("title=?");values.push(title);}
 if(body.description!==undefined){if(body.description.length>2000)return NextResponse.json({error:"La descripción es demasiado larga."},{status:400});fields.push("description=?");values.push(body.description.trim());}
 if(body.status!==undefined){if(!statuses.includes(body.status))return NextResponse.json({error:"Estado no válido."},{status:400});fields.push("status=?");values.push(body.status);}
 if(!fields.length)return NextResponse.json({error:"No hay cambios que guardar."},{status:400});
 values.push(courseId);await db.prepare("UPDATE courses SET "+fields.join(", ")+" WHERE id=?").bind(...values).run();
 const course=await db.prepare("SELECT id,language_code,cefr_level,title,description,sort_order,status,created_at FROM courses WHERE id=?").bind(courseId).first<Record<string,unknown>>();
 return NextResponse.json({course});
 }catch(error){console.error("admin course update failed",error);return NextResponse.json({error:"No se pudo guardar el curso."},{status:500});}
}
