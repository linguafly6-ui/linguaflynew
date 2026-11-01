import { NextResponse } from "next/server";
import { getStudent } from "@/lib/student-auth";
import { getStripeContext, createCheckoutSession } from "@/lib/stripe";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type DB = { prepare(sql: string): { bind(...values: string[]): { first<T>(): Promise<T | null> } } };

export async function POST(request: Request) {
  try {
    const student = await getStudent();
    if (!student) return NextResponse.json({ error: "Inicia sesión para continuar." }, { status: 401 });
    const body = await request.json() as { course?: string };
    const course = body.course || "";
    const { env } = await getStripeContext();
    const { env: cfEnv } = await getCloudflareContext();
    const db = (cfEnv as unknown as { COURSE_DB: DB }).COURSE_DB;
    const enrolment = await db.prepare("SELECT status FROM course_enrolments WHERE learner_id=? AND course_key=?").bind(student.learner_id, course).first<{ status: string }>();
    if (!enrolment) return NextResponse.json({ error: "No existe una inscripción para ese curso." }, { status: 404 });
    if (enrolment.status === "active") return NextResponse.json({ error: "Tu suscripción ya está activa." }, { status: 409 });
    const session = await createCheckoutSession({ env, learnerId: student.learner_id, email: student.email, course });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("stripe checkout failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo iniciar el pago." }, { status: 500 });
  }
}
