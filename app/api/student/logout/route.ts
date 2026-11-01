import { NextResponse } from "next/server";
import { endSession } from "@/lib/student-auth";
export async function POST(){await endSession();return NextResponse.json({ok:true,redirect:"/academia"});}
