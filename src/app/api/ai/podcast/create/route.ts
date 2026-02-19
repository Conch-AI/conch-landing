import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://penora-ai.herokuapp.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      content,
      language,
      numHosts,
      hosts,
      mode,
      targetDuration,
      speechRate,
      guestId,
    } = body;

    const userId = guestId || "guest-" + crypto.randomUUID();

    // Step 1: Create the podcast
    const createRes = await fetch(`${BACKEND}/guest/podcast/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-guest-id": userId,
      },
      body: JSON.stringify({
        content,
        language,
        numHosts,
        hosts,
        mode,
        targetDuration,
        speechRate,
      }),
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      console.error("Create podcast error:", createRes.status, errorText);
      let errorMsg = "Failed to create podcast";
      try {
        const parsed = JSON.parse(errorText);
        errorMsg = parsed.error || parsed.message || errorMsg;
      } catch {
        errorMsg = errorText || errorMsg;
      }
      return NextResponse.json(
        { error: errorMsg },
        { status: createRes.status },
      );
    }

    const createData = await createRes.json();
    const podcastId = createData.podcastId || createData.podcast?._id;

    // Step 2: Trigger generation
    const generateRes = await fetch(
      `${BACKEND}/guest/podcast/${podcastId}/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-guest-id": userId,
        },
      },
    );

    if (!generateRes.ok) {
      const errorText = await generateRes.text();
      console.error("Generate podcast error:", errorText);
      return NextResponse.json(
        { error: "Failed to start podcast generation" },
        { status: generateRes.status },
      );
    }

    return NextResponse.json({ podcastId, guestId: userId });
  } catch (error) {
    console.error("Podcast create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
