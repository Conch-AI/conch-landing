import { getAllCategories, getPostsByLanguage } from "@/lib/wordpress/service";
import BlogPageContent from "../components/blogs/BlogPageContent";

// Force static generation at build time
export const dynamic = 'force-static';

// Revalidate every 360 seconds (ISR)
export const revalidate = 360;

export default async function BlogPostsPage() {
  const incomingPosts = await getPostsByLanguage(500);
  const categories = await getAllCategories();

  return (
      <BlogPageContent incomingPosts={incomingPosts} categories={categories} />
  );
}
