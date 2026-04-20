import { NextResponse } from "next/server";
import { db, Ministry } from "@/lib/api/db";
import { corsHeaders } from "@/lib/api/cors";

export async function GET() {
  return NextResponse.json(db.ministries, { headers: corsHeaders() });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newMinistry: Ministry = {
      id: Math.random().toString(36).substring(7),
      name: data.name,
      description: data.description,
      meeting: data.meeting,
      contact: data.contact,
      phone: data.phone
    };
    
    db.ministries.push(newMinistry);
    return NextResponse.json(newMinistry, { status: 201, headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400, headers: corsHeaders() });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
