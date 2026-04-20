import { NextResponse } from "next/server";
import { db } from "@/lib/api/db";
import { corsHeaders } from "@/lib/api/cors";

export const dynamic = "force-dynamic";

const YOUTUBE_VIDEO_ID = /^[a-zA-Z0-9_-]{11}$/;
const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

function extractYouTubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (YOUTUBE_VIDEO_ID.test(trimmed)) {
    return trimmed;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const shortId = url.pathname.split("/").filter(Boolean)[0] || "";
      return YOUTUBE_VIDEO_ID.test(shortId) ? shortId : null;
    }

    const queryId = url.searchParams.get("v") || "";
    if (YOUTUBE_VIDEO_ID.test(queryId)) {
      return queryId;
    }

    const pathParts = url.pathname.split("/").filter(Boolean);
    const markerIndex = pathParts.findIndex(
      (part) => part === "embed" || part === "shorts" || part === "live"
    );

    if (markerIndex >= 0) {
      const pathId = pathParts[markerIndex + 1] || "";
      return YOUTUBE_VIDEO_ID.test(pathId) ? pathId : null;
    }
  } catch {
    return null;
  }

  return null;
}

function normalizeLivestreamLink(input: unknown): string {
  if (typeof input !== "string") {
    return "";
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return "";
  }

  const id = extractYouTubeVideoId(trimmed);
  if (!id) {
    throw new Error("Invalid YouTube link or video ID.");
  }

  return `https://www.youtube.com/watch?v=${id}`;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (typeof data.active !== "boolean") {
      return NextResponse.json(
        { error: "Invalid active state." },
        { status: 400, headers: { ...corsHeaders(), ...noStoreHeaders } }
      );
    }

    const normalizedLink = normalizeLivestreamLink(data.link);
    if (data.active && !normalizedLink) {
      return NextResponse.json(
        { error: "A valid YouTube link is required when livestream is enabled." },
        { status: 400, headers: { ...corsHeaders(), ...noStoreHeaders } }
      );
    }
    
    db.livestream.link = normalizedLink;
    db.livestream.active = data.active;
    
    return NextResponse.json(
      db.livestream,
      { status: 200, headers: { ...corsHeaders(), ...noStoreHeaders } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid data";
    return NextResponse.json(
      { error: message },
      { status: 400, headers: { ...corsHeaders(), ...noStoreHeaders } }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: { ...corsHeaders(), ...noStoreHeaders } });
}
