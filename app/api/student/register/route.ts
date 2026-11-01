import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({ error: "Primero debes completar el pago en Stripe. Después podrás crear tu cuenta." }, { status: 410 });
}
