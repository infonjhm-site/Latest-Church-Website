import { NextResponse } from "next/server";
import { db, Announcement } from "@/lib/api/db";
import { corsHeaders } from "@/lib/api/cors";

export async function GET() {
  return NextResponse.json(db.announcements, { headers: corsHeaders() });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newAnnouncement: Announcement = {
      id: Math.random().toString(36).substring(7),
      title: data.title,
      type: data.type === 'daily' ? 'Daily' : 'Ticker',
      content: data.content,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "Active"
    };
    
    db.announcements.push(newAnnouncement);
    return NextResponse.json(newAnnouncement, { status: 201, headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400, headers: corsHeaders() });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
