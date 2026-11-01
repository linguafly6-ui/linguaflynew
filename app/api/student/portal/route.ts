import { NextResponse } from "next/server";
import { getStudent } from "@/lib/student-auth";
import { getStripeContext, siteUrl, stripeRequest } from "@/lib/stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type DB = { prepare(sql: string): { bind(...values: string[]): { first<T>(): Promise<T | null> } } };

export async function POST() {
  try {
    const student = await getStudent();
    if (!student) return NextResponse.json({ error: "Inicia sesión para continuar." }, { status: 401 });
    const { env } = await getStripeContext();
    if (!env.STRIPE_SECRET_KEY) throw new Error("Falta configurar STRIPE_SECRET_KEY.");
    const { env: cfEnv } = await getCloudflareContext();
    const db = (cfEnv as unknown as { COURSE_DB: DB }).COURSE_DB;
    const billing = await db.prepare("SELECT stripe_customer_id FROM learner_billing WHERE learner_id=?").bind(student.learner_id).first<{ stripe_customer_id: string }>();
    if (!billing?.stripe_customer_id) return NextResponse.json({ error: "Todavía no hay una suscripción de Stripe asociada a tu cuenta." }, { status: 404 });
    const params = new URLSearchParams({ customer: billing.stripe_customer_id, return_url: `${siteUrl(env)}/mi-aprendizaje` });
    const portal = await stripeRequest<{ url: string }>(env.STRIPE_SECRET_KEY, "billing_portal/sessions", params);
    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error("stripe portal failed", error);
    return NextResponse.json({ error: "No se pudo abrir el portal de facturación." }, { status: 500 });
  }
}
