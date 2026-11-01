import { NextResponse } from "next/server";
import { createCheckoutSession, getStripeContext } from "@/lib/stripe";
const courses=["ingles-a1","ingles-a2","ingles-b1","ingles-b2","ingles-c1","ingles-c2"];
export async function POST(request:Request){
 try{const body=await request.json() as {course?:string};const course=body.course||"";if(!courses.includes(course))return NextResponse.json({error:"Curso no válido."},{status:400});const {env}=await getStripeContext();const session=await createCheckoutSession({env,course});return NextResponse.json({url:session.url});}
 catch(error){console.error("stripe checkout failed",error);return NextResponse.json({error:error instanceof Error?error.message:"No se pudo iniciar el pago."},{status:500});}
}
