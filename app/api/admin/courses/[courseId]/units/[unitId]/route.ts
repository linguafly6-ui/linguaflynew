import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStripeContext } from "@/lib/stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";
export const dynamic="force-dynamic";
type Statement={bind(...values:(string|number)[]):Statement;first<T>():Promise<T|null>;run():Promise<unknown>};
type DB={prepare(sql:string):Statement};
function equal(a:string,b:string){if(a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}
async function getDb(){const {env}=await getStripeContext(),secret=env.SUPPORT_ADMIN_KEY,jar=await cookies();if(!secret||!equal(jar.get("lf_admin_session")?.value||"",secret))return null;const {env:cf}=await getCloudflareContext();return (cf as unknown as {COURSE_DB:DB}).COURSE_DB;}
const statuses=["draft","review","published"];
export async function PATCH(request:Request,{params}:{params:Promise<{courseId:string;unitId:string}>}){
 try{const db=await getDb();if(!db)return NextResponse.json({error:"No autorizado."},{status:401});const {courseId,unitId}=await params;
 const body=await request.json() as {title?:string;learning_objectives?:string[];status?:string};
 const current=await db.prepare("SELECT id FROM units WHERE id=? AND course_id=?").bind(unitId,courseId).first<{id:string}>();if(!current)return NextResponse.json({error:"Unidad no encontrada."},{status:404});
 const fields:string[]=[],values:(string|number)[]=[];
 if(body.title!==undefined){const title=body.title.trim();if(!title||title.length>180)return NextResponse.json({error:"El título debe tener entre 1 y 180 caracteres."},{status:400});fields.push("title=?");values.push(title);}
 if(body.learning_objectives!==undefined){if(!Array.isArray(body.learning_objectives)||body.learning_objectives.length>20)return NextResponse.json({error:"Los objetivos no son válidos."},{status:400});fields.push("learning_objectives_json=?");values.push(JSON.stringify(body.learning_objectives.map(x=>String(x).trim()).filter(Boolean)));}
 if(body.status!==undefined){if(!statuses.includes(body.status))return NextResponse.json({error:"Estado no válido."},{status:400});fields.push("status=?");values.push(body.status);}
 if(!fields.length)return NextResponse.json({error:"No hay cambios que guardar."},{status:400});
 values.push(unitId,courseId);await db.prepare("UPDATE units SET "+fields.join(", ")+" WHERE id=? AND course_id=?").bind(...values).run();
 const unit=await db.prepare("SELECT id,course_id,unit_number,title,learning_objectives_json,status,created_at FROM units WHERE id=?").bind(unitId).first<Record<string,unknown>>();
 return NextResponse.json({unit});
 }catch(error){console.error("admin unit update failed",error);return NextResponse.json({error:"No se pudo guardar la unidad."},{status:500});}
}
