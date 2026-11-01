import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createSession, hashPassword } from "@/lib/student-auth";
type DB={prepare(sql:string):{bind(...v:(string|number)[]):any};batch(stmts:any[]):Promise<unknown>};
const courses=["ingles-a1","ingles-a2","ingles-b1","ingles-b2","ingles-c1","ingles-c2"];
export async function POST(request:Request){
 try{
  const body=await request.json() as {name?:string;email?:string;password?:string;course?:string};
  const name=(body.name??"").trim(),email=(body.email??"").trim().toLowerCase(),password=body.password??"",course=body.course??"";
  if(name.length<2||name.length>80||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>190||password.length<10||password.length>128||!/[A-Za-z]/.test(password)||!/[0-9]/.test(password)||!courses.includes(course))return NextResponse.json({error:"Revisa tus datos. La contraseña debe tener al menos 10 caracteres, letras y números."},{status:400});
  const {env}=await getCloudflareContext(),db=(env as unknown as {COURSE_DB:DB}).COURSE_DB;
  const exists=await db.prepare("SELECT learner_id FROM learner_accounts WHERE email=?").bind(email).first();
  if(exists)return NextResponse.json({error:"Ya existe una cuenta con ese correo. Inicia sesión."},{status:409});
  const id=crypto.randomUUID(),salt=Array.from(crypto.getRandomValues(new Uint8Array(16))).map(v=>v.toString(16).padStart(2,"0")).join("");
  const passwordHash=await hashPassword(password,salt);
  await db.batch([
   db.prepare("INSERT INTO learners(id,status) VALUES(?,'active')").bind(id),
   db.prepare("INSERT INTO learner_accounts(learner_id,email,display_name,password_salt,password_hash) VALUES(?,?,?,?,?)").bind(id,email,name,salt,passwordHash),
   db.prepare("INSERT INTO course_enrolments(id,learner_id,course_key,status) VALUES(?,?,?,'active')").bind(crypto.randomUUID(),id,course)
  ]);
  await createSession(id);
  return NextResponse.json({ok:true,redirect:"/mi-aprendizaje"});
 }catch(error){console.error("student registration failed",error);return NextResponse.json({error:"No se pudo completar el registro. Inténtalo de nuevo."},{status:500});}
}
