import { NextResponse } from "next/server";
import { db } from "@/lib/api/db";
import { corsHeaders } from "@/lib/api/cors";

export async function GET() {
  return NextResponse.json(db.settings, { headers: corsHeaders() });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    db.settings = { ...db.settings, ...data };
    return NextResponse.json(db.settings, { headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400, headers: corsHeaders() });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
