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
    // const res = await fetch(`${BACKEND}/ai/podcast/${podcastId}`);
    //
    // if (!res.ok) {
    //   return NextResponse.json(
    //     { error: "Failed to get podcast data" },
    //     { status: res.status }
    //   );
    // }
    //
    // const data = await res.json();
    // return NextResponse.json(data);

    // Dummy response for UI testing
    return NextResponse.json({
      _id: podcastId,
      title: "AI-Generated Podcast",
      language: "en",
      mode: "Conversational",
      numHosts: 2,
      hosts: [
        { id: 1, voiceId: "alloy", name: "Alex" },
        { id: 2, voiceId: "echo", name: "Morgan" },
      ],
      duration: 180,
      dialogues: [
        { hostId: 1, hostName: "Alex", voiceId: "alloy", text: "Welcome to this episode! Today we're diving into a fascinating topic from the uploaded document." },
        { hostId: 2, hostName: "Morgan", voiceId: "echo", text: "That's right, Alex. There's a lot to unpack here. Let's start with the key highlights." },
        { hostId: 1, hostName: "Alex", voiceId: "alloy", text: "The document covers several important points that our listeners will find really useful." },
        { hostId: 2, hostName: "Morgan", voiceId: "echo", text: "Absolutely. And what I found most interesting was how it all connects together." },
      ],
      chapters: [
        { title: "Introduction", startTime: 0, endTime: 45, description: "Welcome and overview" },
        { title: "Key Findings", startTime: 45, endTime: 120, description: "Main discussion points" },
        { title: "Conclusion", startTime: 120, endTime: 180, description: "Wrap up and takeaways" },
      ],
      summary: "This podcast explores the key topics from your uploaded document, featuring a dynamic conversation between two hosts who break down the main ideas into an engaging discussion.",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      thumbnailUrl: "",
      status: "completed",
    });
  } catch (error) {
    console.error("Podcast get error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
