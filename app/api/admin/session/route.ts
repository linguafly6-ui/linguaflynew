import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStripeContext } from "@/lib/stripe";
function equal(a:string,b:string){if(a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}
export async function POST(request:Request){try{const {env}=await getStripeContext();const secret=env.SUPPORT_ADMIN_KEY;if(!secret)return NextResponse.json({error:"Panel no configurado."},{status:503});const body=await request.json() as {key?:string};if(!body.key||!equal(body.key,secret))return NextResponse.json({error:"Clave incorrecta."},{status:401});const jar=await cookies();jar.set("lf_admin_session",secret,{httpOnly:true,secure:true,sameSite:"strict",path:"/admin",maxAge:60*60*8});return NextResponse.json({ok:true});}catch{return NextResponse.json({error:"No se pudo iniciar sesión."},{status:500});}}
export async function DELETE(){const jar=await cookies();jar.delete("lf_admin_session");return NextResponse.json({ok:true});}
