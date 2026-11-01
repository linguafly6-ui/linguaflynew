import { NextResponse } from "next/server";
import { getStudent } from "@/lib/student-auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sendSupportEmail } from "@/lib/support-email";
type Stmt={bind(...v:(string|number|null)[]):Stmt;all<T>():Promise<{results?:T[]}>;first<T>():Promise<T|null>;run():Promise<unknown>};
type DB={prepare(sql:string):Stmt};
type Env={COURSE_DB:DB;EMAIL?:{send(message:{from:string;to:string;raw:Uint8Array}):Promise<unknown>}};
export const dynamic="force-dynamic";
export async function GET(){
 try{const student=await getStudent();if(!student)return NextResponse.json({error:"Inicia sesión para consultar tus tickets."},{status:401});
 const {env}=await getCloudflareContext(),db=(env as unknown as Env).COURSE_DB;
 const tickets=await db.prepare("SELECT id,subject,category,status,created_at,updated_at,last_message_at FROM support_tickets WHERE learner_id=? ORDER BY last_message_at DESC").bind(student.learner_id).all<Record<string,unknown>>();
 const messages=await db.prepare("SELECT m.id,m.ticket_id,m.sender_type,m.message,m.created_at FROM support_ticket_messages m JOIN support_tickets t ON t.id=m.ticket_id WHERE t.learner_id=? ORDER BY m.created_at ASC").bind(student.learner_id).all<Record<string,unknown>>();
 return NextResponse.json({tickets:tickets.results||[],messages:messages.results||[]});
 }catch(e){console.error("student tickets GET failed",e);return NextResponse.json({error:"No se pudieron cargar tus consultas."},{status:500});}
}
export async function POST(request:Request){
 try{const student=await getStudent();if(!student)return NextResponse.json({error:"Inicia sesión para crear una consulta."},{status:401});
 const body=await request.json() as {subject?:string;category?:string;message?:string};
 const subject=(body.subject||"").trim(),message=(body.message||"").trim(),category=body.category||"general";
 if(subject.length<4||subject.length>120)return NextResponse.json({error:"El asunto debe tener entre 4 y 120 caracteres."},{status:400});
 if(message.length<10||message.length>5000)return NextResponse.json({error:"El mensaje debe tener entre 10 y 5.000 caracteres."},{status:400});
 if(!["general","course","billing","technical","other"].includes(category))return NextResponse.json({error:"Selecciona una categoría válida."},{status:400});
 const {env}=await getCloudflareContext(),db=(env as unknown as Env).COURSE_DB,id=crypto.randomUUID(),messageId=crypto.randomUUID();
 await db.prepare("INSERT INTO support_tickets(id,learner_id,subject,category) VALUES(?,?,?,?)").bind(id,student.learner_id,subject,category).run();
 await db.prepare("INSERT INTO support_ticket_messages(id,ticket_id,sender_type,sender_id,message) VALUES(?,?,'student',?,?)").bind(messageId,id,student.learner_id,message).run();
 let emailSent=false;
 try{await sendSupportEmail({binding:(env as unknown as Env).EMAIL,to:student.email,subject:`Hemos recibido tu consulta · #${id.slice(0,8)}`,body:`Hola ${student.display_name},\n\nHemos recibido correctamente tu consulta en LinguaFly.\n\nNúmero de ticket: ${id}\nAsunto: ${subject}\n\nTu mensaje:\n${message}\n\nNuestro equipo la revisará y te responderá desde el área de alumno. Te avisaremos por correo cuando haya una respuesta.\n\nGracias,\nEquipo LinguaFly`});emailSent=true;await db.prepare("UPDATE support_ticket_messages SET email_sent_at=CURRENT_TIMESTAMP WHERE id=?").bind(messageId).run();}
 catch(error){console.error("support receipt email failed",error);}
 return NextResponse.json({ok:true,ticket:{id,subject,category,status:"open",created_at:new Date().toISOString()},emailSent,emailNotice:emailSent?null:"La consulta se ha guardado, pero no se pudo enviar el email de confirmación. El equipo podrá verla igualmente."},{status:201});
 }catch(e){console.error("student ticket POST failed",e);return NextResponse.json({error:"No se pudo crear la consulta. Inténtalo de nuevo."},{status:500});}
}
