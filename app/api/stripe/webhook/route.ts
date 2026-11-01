import { NextResponse } from "next/server";
import { getStripeContext } from "@/lib/stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type DB = { prepare(sql: string): { bind(...values: (string | number)[]): { run(): Promise<unknown> } } };
type StripeEvent = {
  type: string;
  data: { object: {
    id: string;
    customer?: string | { id: string } | null;
    subscription?: string | { id: string } | null;
    status?: string;
    metadata?: { learner_id?: string; course_key?: string };
    customer_details?: { email?: string };
  } };
};

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifySignature(payload: string, header: string, secret: string) {
  const parts = header.split(",").map((part) => part.split("="));
  const timestamp = parts.find(([key]) => key === "t")?.[1];
  const signatures = parts.filter(([key]) => key === "v1").map(([, value]) => value);
  if (!timestamp || !signatures.length || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`)));
  const expected = Array.from(digest).map((value) => value.toString(16).padStart(2, "0")).join("");
  return signatures.some((signature) => safeEqual(signature, expected));
}

function objectId(value: string | { id: string } | null | undefined) {
  return typeof value === "string" ? value : value?.id || null;
}

export async function POST(request: Request) {
  const { env } = await getStripeContext();
  if (!env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: "Webhook no configurado." }, { status: 500 });
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") || "";
  if (!(await verifySignature(payload, signature, env.STRIPE_WEBHOOK_SECRET))) {
    return NextResponse.json({ error: "Firma no válida." }, { status: 400 });
  }

  try {
    const event = JSON.parse(payload) as StripeEvent;
    const object = event.data.object;
    const { env: cfEnv } = await getCloudflareContext();
    const db = (cfEnv as unknown as { COURSE_DB: DB }).COURSE_DB;

    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const learnerId = object.metadata?.learner_id;
      const course = object.metadata?.course_key;
      const customerId = objectId(object.customer);
      const subscriptionId = objectId(object.subscription);
      if (learnerId && course && customerId && subscriptionId) {
        await db.prepare("INSERT INTO learner_billing(learner_id,stripe_customer_id,stripe_subscription_id,subscription_status,course_key,updated_at) VALUES(?,?,?,'active',?,datetime('now')) ON CONFLICT(learner_id) DO UPDATE SET stripe_customer_id=excluded.stripe_customer_id,stripe_subscription_id=excluded.stripe_subscription_id,subscription_status='active',course_key=excluded.course_key,updated_at=datetime('now')").bind(learnerId, customerId, subscriptionId, course).run();
        await db.prepare("UPDATE course_enrolments SET status='active' WHERE learner_id=? AND course_key=?").bind(learnerId, course).run();
      }
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const learnerId = object.metadata?.learner_id;
      const course = object.metadata?.course_key;
      const customerId = objectId(object.customer);
      if (learnerId && course) {
        const status = event.type === "customer.subscription.deleted" ? "canceled" : (object.status || "inactive");
        const accessActive = status === "active" || status === "trialing";
        await db.prepare("INSERT INTO learner_billing(learner_id,stripe_customer_id,stripe_subscription_id,subscription_status,course_key,updated_at) VALUES(?,?,?,?,?,datetime('now')) ON CONFLICT(learner_id) DO UPDATE SET stripe_customer_id=COALESCE(excluded.stripe_customer_id,learner_billing.stripe_customer_id),stripe_subscription_id=excluded.stripe_subscription_id,subscription_status=excluded.subscription_status,course_key=excluded.course_key,updated_at=datetime('now')").bind(learnerId, customerId || "", object.id, status, course).run();
        await db.prepare("UPDATE course_enrolments SET status=? WHERE learner_id=? AND course_key=?").bind(accessActive ? "active" : (status === "canceled" ? "cancelled" : "pending"), learnerId, course).run();
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("stripe webhook processing failed", error);
    return NextResponse.json({ error: "No se pudo procesar el evento." }, { status: 500 });
  }
}
