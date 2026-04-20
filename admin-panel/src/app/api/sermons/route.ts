import { NextResponse } from "next/server";
import { db, Sermon } from "@/lib/api/db";
import { corsHeaders } from "@/lib/api/cors";

export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  return NextResponse.json({
    sermons: db.sermons,
    livestream: db.livestream
  }, { headers: { ...corsHeaders(), ...noStoreHeaders } });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newSermon: Sermon = {
      id: Math.random().toString(36).substring(7),
      title: data.title,
      description: data.description,
      date: data.date,
      link: data.link,
      isFeatured: data.isFeatured || false
    };
    
    db.sermons.push(newSermon);
    return NextResponse.json(newSermon, { status: 201, headers: { ...corsHeaders(), ...noStoreHeaders } });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400, headers: { ...corsHeaders(), ...noStoreHeaders } });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: { ...corsHeaders(), ...noStoreHeaders } });
}
