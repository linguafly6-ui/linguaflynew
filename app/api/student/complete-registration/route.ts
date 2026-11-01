import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createSession, hashPassword } from "@/lib/student-auth";
import { getStripeContext, stripeGet, stripeRequest } from "@/lib/stripe";
type DB={prepare(sql:string):{bind(...values:(string|number)[]):{first<T>():Promise<T|null>}};batch(statements:unknown[]):Promise<unknown>};
type CheckoutSession={id:string;payment_status:string;status:string;customer:string|{id:string}|null;subscription:string|{id:string;status?:string}|null;customer_details?:{email?:string};metadata?:{course_key?:string}};
type Subscription={id:string;status:string;customer:string|{id:string}};
export async function POST(request:Request){
 try{
  const body=await request.json() as {sessionId?:string;name?:string;password?:string};const sessionId=body.sessionId||"",name=(body.name||"").trim(),password=body.password||"";
  if(!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)||name.length<2||name.length>80||password.length<10||password.length>128||!/[A-Za-z]/.test(password)||!/[0-9]/.test(password))return NextResponse.json({error:"Revisa tu nombre y contraseña (mínimo 10 caracteres, letras y números)."},{status:400});
  const {env}=await getStripeContext();if(!env.STRIPE_SECRET_KEY)throw new Error("Stripe no está configurado.");
  const session=await stripeGet<CheckoutSession>(env.STRIPE_SECRET_KEY,`checkout/sessions/${sessionId}?expand[]=subscription`);
  const subscriptionId=typeof session.subscription==="string"?session.subscription:session.subscription?.id;
  const customerId=typeof session.customer==="string"?session.customer:session.customer?.id;
  const subscription=typeof session.subscription==="object"&&session.subscription?session.subscription as Subscription:subscriptionId?await stripeGet<Subscription>(env.STRIPE_SECRET_KEY,`subscriptions/${subscriptionId}`):null;
  const course=session.metadata?.course_key||"",email=(session.customer_details?.email||"").trim().toLowerCase();
  if(session.status!=="complete"||session.payment_status!=="paid"||!subscriptionId||!customerId||!subscription||!["active","trialing"].includes(subscription.status)||!["ingles-a1","ingles-a2","ingles-b1","ingles-b2","ingles-c1","ingles-c2"].includes(course)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return NextResponse.json({error:"No hemos podido confirmar el pago. Si ya has pagado, espera unos segundos y vuelve a intentarlo."},{status:402});
  const {env:cfEnv}=await getCloudflareContext();const db=(cfEnv as unknown as {COURSE_DB:DB}).COURSE_DB;
  const exists=await db.prepare("SELECT learner_id FROM learner_accounts WHERE email=?").bind(email).first<{learner_id:string}>();if(exists)return NextResponse.json({error:"Ya existe una cuenta con ese correo. Inicia sesión para revisar tu curso."},{status:409});
  const learnerId=crypto.randomUUID(),salt=Array.from(crypto.getRandomValues(new Uint8Array(16))).map(v=>v.toString(16).padStart(2,"0")).join(""),passwordHash=await hashPassword(password,salt);
  await db.batch([
   db.prepare("INSERT INTO learners(id,status) VALUES(?,'active')").bind(learnerId),
   db.prepare("INSERT INTO learner_accounts(learner_id,email,display_name,password_salt,password_hash) VALUES(?,?,?,?,?)").bind(learnerId,email,name,salt,passwordHash),
   db.prepare("INSERT INTO course_enrolments(id,learner_id,course_key,status) VALUES(?,?,?,'active')").bind(crypto.randomUUID(),learnerId,course),
   db.prepare("INSERT INTO learner_billing(learner_id,stripe_customer_id,stripe_subscription_id,subscription_status,course_key,updated_at) VALUES(?,?,?,?,?,datetime('now'))").bind(learnerId,customerId,subscriptionId,subscription.status,course)
  ]);
  await stripeRequest(env.STRIPE_SECRET_KEY,`subscriptions/${subscriptionId}`,new URLSearchParams({"metadata[learner_id]":learnerId,"metadata[course_key]":course}));
  await createSession(learnerId);return NextResponse.json({ok:true,redirect:"/mi-aprendizaje"});
 }catch(error){console.error("post-payment account creation failed",error);return NextResponse.json({error:error instanceof Error?error.message:"No se pudo crear tu cuenta."},{status:500});}
}
