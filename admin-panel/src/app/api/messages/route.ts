import { NextResponse } from "next/server";
import { db, MessageItem } from "@/lib/api/db";
import { corsHeaders } from "@/lib/api/cors";

export async function GET() {
  return NextResponse.json(db.messages, { headers: corsHeaders() });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newMessage: MessageItem = {
      id: Math.random().toString(36).substring(7),
      type: data.type === 'prayer' ? 'prayer' : 'contact',
      sender: data.sender || "Anonymous",
      email: data.email || "",
      subject: data.subject || "No Subject",
      message: data.message,
      date: new Date().toISOString().split('T')[0],
      resolved: false,
      prayed: false,
      confidential: data.confidential || false
    };
    
    db.messages.unshift(newMessage); // add to top of inbox
    return NextResponse.json(newMessage, { status: 201, headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400, headers: corsHeaders() });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
