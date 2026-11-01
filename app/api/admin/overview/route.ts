import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStripeContext } from "@/lib/stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";
type DB={prepare(sql:string):{all<T>():Promise<{results?:T[]}>;first<T>():Promise<T|null>}};
function equal(a:string,b:string){if(a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}
export async function GET(){try{const {env}=await getStripeContext(),secret=env.SUPPORT_ADMIN_KEY,jar=await cookies();if(!secret||!equal(jar.get("lf_admin_session")?.value||"",secret))return NextResponse.json({error:"No autorizado."},{status:401});const {env:cf}=await getCloudflareContext(),db=(cf as unknown as {COURSE_DB:DB}).COURSE_DB;
const students=await db.prepare("SELECT a.learner_id,a.email,a.display_name,a.created_at,l.status AS account_status,e.course_key,e.status AS enrolment_status,b.subscription_status,b.stripe_customer_id,b.stripe_subscription_id,b.updated_at AS billing_updated_at FROM learner_accounts a JOIN learners l ON l.id=a.learner_id LEFT JOIN course_enrolments e ON e.learner_id=a.learner_id LEFT JOIN learner_billing b ON b.learner_id=a.learner_id ORDER BY a.created_at DESC").all<Record<string,unknown>>();
const summary=await db.prepare("SELECT COUNT(*) AS students,(SELECT COUNT(*) FROM course_enrolments WHERE status='active') AS active_enrolments,(SELECT COUNT(*) FROM learner_billing WHERE subscription_status IN ('active','trialing')) AS paying_students,(SELECT COUNT(*) FROM learner_billing WHERE subscription_status IN ('canceled','unpaid','past_due')) AS attention_needed FROM learner_accounts").first<Record<string,number>>();
return NextResponse.json({summary:summary||{},students:students.results||[],progressTracking:"not_enabled"});}catch(error){console.error("admin overview failed",error);return NextResponse.json({error:"No se pudieron cargar los datos."},{status:500});}}
