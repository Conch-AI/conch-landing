import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL || "https://penora-ai.herokuapp.com";

export async function GET(req: NextRequest) {
  try {
    const voiceId = req.nextUrl.searchParams.get("voiceId");

    if (!voiceId) {
      return NextResponse.json({ error: "Missing voiceId" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND}/ai/podcast/voice-sample/${voiceId}`);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to get voice sample" },
        { status: res.status }
      );
    }

    const contentType = res.headers.get("content-type") || "audio/mpeg";
    const arrayBuffer = await res.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Voice sample error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
