import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL || "https://penora-ai.herokuapp.com";

export async function GET(req: NextRequest) {
  try {
    const podcastId = req.nextUrl.searchParams.get("podcastId");

    if (!podcastId) {
      return NextResponse.json({ error: "Missing podcastId" }, { status: 400 });
    }

    // TODO: Re-enable backend call once endpoint is verified
    // const res = await fetch(`${BACKEND}/ai/podcast/${podcastId}/status`);
    //
    // if (!res.ok) {
    //   return NextResponse.json(
    //     { error: "Failed to get podcast status" },
    //     { status: res.status }
    //   );
    // }
    //
    // const data = await res.json();
    // return NextResponse.json(data);

    // Dummy response — immediately complete
    return NextResponse.json({ status: "completed" });
  } catch (error) {
    console.error("Podcast status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
