import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createSession, hashPassword } from "@/lib/student-auth";
type DB={prepare(sql:string):{bind(...v:(string|number)[]):{first<T>():Promise<T|null>}}};
export async function POST(request:Request){
 try{
  const body=await request.json() as {email?:string;password?:string},email=(body.email??"").trim().toLowerCase(),password=body.password??"";
  if(!email||!password||password.length>128)return NextResponse.json({error:"Introduce tu correo y contraseña."},{status:400});
  const {env}=await getCloudflareContext(),db=(env as unknown as {COURSE_DB:DB}).COURSE_DB;
  const user=await db.prepare("SELECT a.learner_id,a.password_salt,a.password_hash FROM learner_accounts a JOIN learners l ON l.id=a.learner_id WHERE a.email=? AND l.status='active'").bind(email).first<{learner_id:string;password_salt:string;password_hash:string}>();
  if(!user)return NextResponse.json({error:"Correo o contraseña incorrectos."},{status:401});
  const candidate=await hashPassword(password,user.password_salt);
  if(candidate!==user.password_hash)return NextResponse.json({error:"Correo o contraseña incorrectos."},{status:401});
  await createSession(user.learner_id);
  return NextResponse.json({ok:true,redirect:"/mi-aprendizaje"});
 }catch(error){console.error("student login failed",error);return NextResponse.json({error:"No se pudo iniciar sesión."},{status:500});}
}
