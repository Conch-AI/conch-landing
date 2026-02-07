import { Suspense } from "react";
import BlogHome from "@/app/components/blogs/BlogHome";
import { getAllCategories, getPostsByLanguage } from "@/lib/wordpress/service";

// Revalidate every 360 seconds
export const revalidate = 360;

export default async function BlogPostsPage() {
  const incomingPosts = await getPostsByLanguage(500);
  const categories = await getAllCategories();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogHome incomingPosts={incomingPosts} categories={categories} />
    </Suspense>
  );
}
