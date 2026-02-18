import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://penora-ai.herokuapp.com";

export async function GET(req: NextRequest) {
  try {
    const includePreviews =
      req.nextUrl.searchParams.get("includePreviews") || "true";

    const res = await fetch(
      `${BACKEND}/guest/podcast/voices?includePreviews=${includePreviews}`,
      {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Voices fetch error:", res.status, errorText);
      return NextResponse.json(
        { error: "Failed to fetch voices" },
        { status: res.status },
      );
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Voices API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
