import { getCloudflareContext } from "@opennextjs/cloudflare";
type StripeEnv = { STRIPE_SECRET_KEY?: string; STRIPE_WEBHOOK_SECRET?: string; STRIPE_PRICE_INGLES_A1?: string; STRIPE_PRICE_INGLES_A2?: string; STRIPE_PRICE_INGLES_B1?: string; STRIPE_PRICE_INGLES_B2?: string; STRIPE_PRICE_INGLES_C1?: string; STRIPE_PRICE_INGLES_C2?: string; NEXT_PUBLIC_SITE_URL?: string; };
export type StripeContext = { env: StripeEnv };
export async function getStripeContext(): Promise<StripeContext> { const { env } = await getCloudflareContext(); return { env: env as unknown as StripeEnv }; }
export function getPriceId(env: StripeEnv, course: string): string {
 const keys: Record<string,keyof StripeEnv>={"ingles-a1":"STRIPE_PRICE_INGLES_A1","ingles-a2":"STRIPE_PRICE_INGLES_A2","ingles-b1":"STRIPE_PRICE_INGLES_B1","ingles-b2":"STRIPE_PRICE_INGLES_B2","ingles-c1":"STRIPE_PRICE_INGLES_C1","ingles-c2":"STRIPE_PRICE_INGLES_C2"};
 const key=keys[course]; if(!key||!env[key]) throw new Error("El precio recurrente de Stripe no está configurado para este curso."); return env[key] as string;
}
export function siteUrl(env:StripeEnv){return (env.NEXT_PUBLIC_SITE_URL||"https://linguafly.app").replace(/\/$/,"");}
export async function stripeRequest<T>(secret:string,path:string,params:URLSearchParams):Promise<T>{
 const response=await fetch(`https://api.stripe.com/v1/${path}`,{method:"POST",headers:{Authorization:`Bearer ${secret}`,"Content-Type":"application/x-www-form-urlencoded"},body:params.toString()});
 const data=await response.json() as T&{error?:{message?:string}}; if(!response.ok) throw new Error(data.error?.message||"Stripe no pudo procesar la solicitud."); return data;
}
export async function stripeGet<T>(secret:string,path:string):Promise<T>{
 const response=await fetch(`https://api.stripe.com/v1/${path}`,{headers:{Authorization:`Bearer ${secret}`}});
 const data=await response.json() as T&{error?:{message?:string}}; if(!response.ok) throw new Error(data.error?.message||"No se pudo verificar el pago en Stripe."); return data;
}
export async function createCheckoutSession(input:{env:StripeEnv;course:string}){
 if(!input.env.STRIPE_SECRET_KEY) throw new Error("Falta configurar STRIPE_SECRET_KEY en el entorno.");
 const params=new URLSearchParams(); params.set("mode","subscription"); params.set("success_url",`${siteUrl(input.env)}/suscripcion/confirmacion?session_id={CHECKOUT_SESSION_ID}`); params.set("cancel_url",`${siteUrl(input.env)}/suscripcion?cancelado=1`);
 params.set("line_items[0][price]",getPriceId(input.env,input.course)); params.set("line_items[0][quantity]","1"); params.set("metadata[course_key]",input.course); params.set("subscription_data[metadata][course_key]",input.course); params.set("allow_promotion_codes","true"); params.set("billing_address_collection","auto");
 return stripeRequest<{id:string;url:string}>(input.env.STRIPE_SECRET_KEY,"checkout/sessions",params);
}
