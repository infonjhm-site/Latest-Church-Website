import { NextResponse } from "next/server";
import { db, Event } from "@/lib/api/db";
import { corsHeaders } from "@/lib/api/cors";

export async function GET() {
  return NextResponse.json(db.events, { headers: corsHeaders() });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newEvent: Event = {
      id: Math.random().toString(36).substring(7),
      title: data.title,
      description: data.description,
      date: data.date,
      time: data.time,
      location: data.location,
      image: data.image || ""
    };
    
    db.events.push(newEvent);
    return NextResponse.json(newEvent, { status: 201, headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400, headers: corsHeaders() });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
