import { getAllCategories, getPostsByLanguage } from "@/lib/wordpress/service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await getPostsByLanguage(500);
    const categories = await getAllCategories();

    return NextResponse.json({
      posts,
      categories,
    });
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog data" },
      { status: 500 }
    );
  }
}
