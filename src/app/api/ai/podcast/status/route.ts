import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://penora-ai.herokuapp.com";

export async function GET(req: NextRequest) {
  try {
    const podcastId = req.nextUrl.searchParams.get("podcastId");
    console.log("podcastId", podcastId);

    if (!podcastId) {
      return NextResponse.json(
        { error: "Missing podcastId" },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${BACKEND}/guest/podcast/${podcastId}/status`,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to get podcast status" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Podcast status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
