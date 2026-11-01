import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStripeContext } from "@/lib/stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sendSupportEmail } from "@/lib/support-email";
type Stmt={bind(...v:(string|number|null)[]):Stmt;all<T>():Promise<{results?:T[]}>;first<T>():Promise<T|null>;run():Promise<unknown>};
type DB={prepare(sql:string):Stmt};
type Env={COURSE_DB:DB;EMAIL?:{send(message:{from:string;to:string;raw:Uint8Array}):Promise<unknown>}};
function equal(a:string,b:string){if(a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}
async function authorized(){const {env}=await getStripeContext(),jar=await cookies();return !!env.SUPPORT_ADMIN_KEY&&equal(jar.get("lf_admin_session")?.value||"",env.SUPPORT_ADMIN_KEY);}
export const dynamic="force-dynamic";
export async function GET(){
 try{if(!(await authorized()))return NextResponse.json({error:"No autorizado."},{status:401});
 const {env}=await getCloudflareContext(),db=(env as unknown as Env).COURSE_DB;
 const tickets=await db.prepare("SELECT t.id,t.subject,t.category,t.status,t.created_at,t.updated_at,t.last_message_at,a.learner_id,a.email,a.display_name FROM support_tickets t JOIN learner_accounts a ON a.learner_id=t.learner_id ORDER BY CASE t.status WHEN 'open' THEN 0 WHEN 'in_progress' THEN 1 WHEN 'waiting_student' THEN 2 ELSE 3 END,t.last_message_at DESC").all<Record<string,unknown>>();
 const messages=await db.prepare("SELECT id,ticket_id,sender_type,sender_id,message,email_sent_at,created_at FROM support_ticket_messages ORDER BY created_at ASC").all<Record<string,unknown>>();
 return NextResponse.json({tickets:tickets.results||[],messages:messages.results||[]});
 }catch(e){console.error("admin tickets GET failed",e);return NextResponse.json({error:"No se pudieron cargar los tickets."},{status:500});}
}
export async function POST(request:Request){
 try{if(!(await authorized()))return NextResponse.json({error:"No autorizado."},{status:401});
 const body=await request.json() as {ticket_id?:string;message?:string;status?:string};
 const ticketId=(body.ticket_id||"").trim(),message=(body.message||"").trim(),status=body.status;
 if(!ticketId||ticketId.length>80)return NextResponse.json({error:"Ticket no válido."},{status:400});
 if(message.length<2||message.length>5000)return NextResponse.json({error:"La respuesta debe tener entre 2 y 5.000 caracteres."},{status:400});
 if(status!==undefined&&!["open","in_progress","waiting_student","resolved"].includes(status))return NextResponse.json({error:"Estado no válido."},{status:400});
 const {env}=await getCloudflareContext(),db=(env as unknown as Env).COURSE_DB;
 const ticket=await db.prepare("SELECT t.id,t.subject,t.status,a.email,a.display_name FROM support_tickets t JOIN learner_accounts a ON a.learner_id=t.learner_id WHERE t.id=?").bind(ticketId).first<{id:string;subject:string;status:string;email:string;display_name:string}>();
 if(!ticket)return NextResponse.json({error:"Ticket no encontrado."},{status:404});
 const messageId=crypto.randomUUID();
 await db.prepare("INSERT INTO support_ticket_messages(id,ticket_id,sender_type,sender_id,message) VALUES(?,?,'admin','admin',?)").bind(messageId,ticketId,message).run();
 const nextStatus=status||"waiting_student";
 await db.prepare("UPDATE support_tickets SET status=?,updated_at=CURRENT_TIMESTAMP,last_message_at=CURRENT_TIMESTAMP WHERE id=?").bind(nextStatus,ticketId).run();
 let emailSent=false;
 try{await sendSupportEmail({binding:(env as unknown as Env).EMAIL,to:ticket.email,subject:`Nueva respuesta de LinguaFly · ${ticket.subject}`,body:`Hola ${ticket.display_name},\n\nNuestro equipo ha respondido a tu consulta #${ticket.id.slice(0,8)}.\n\nAsunto: ${ticket.subject}\n\nRespuesta:\n${message}\n\nPuedes consultar el historial y responder desde tu área de alumno en https://linguafly.app/mi-aprendizaje.\n\nEquipo LinguaFly`});emailSent=true;await db.prepare("UPDATE support_ticket_messages SET email_sent_at=CURRENT_TIMESTAMP WHERE id=?").bind(messageId).run();}
 catch(error){console.error("support reply email failed",error);}
 return NextResponse.json({ok:true,message:{id:messageId,ticket_id:ticketId,sender_type:"admin",message,created_at:new Date().toISOString()},status:nextStatus,emailSent,emailNotice:emailSent?null:"La respuesta se guardó, pero no se pudo enviar el aviso por correo."},{status:201});
 }catch(e){console.error("admin ticket POST failed",e);return NextResponse.json({error:"No se pudo enviar la respuesta."},{status:500});}
}
