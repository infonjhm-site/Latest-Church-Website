import { NextResponse } from "next/server";
import { db } from "@/lib/api/db";
import { corsHeaders } from "@/lib/api/cors";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const data = await req.json();
    const resolvedParams = await params;
    const index = db.messages.findIndex(m => m.id === resolvedParams.id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: corsHeaders() });
    }

    db.messages[index] = { ...db.messages[index], ...data };
    
    return NextResponse.json(db.messages[index], { headers: corsHeaders() });
  } catch (error) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400, headers: corsHeaders() });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
