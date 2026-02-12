import { getPostBySlug, getPostSlugs } from "@/lib/wordpress/service";
import { notFound } from "next/navigation";
import BlogPostPage from "./BlogPostPage";

// Force static generation at build time
export const dynamic = 'force-static';

// Revalidate every 360 seconds (ISR)
export const revalidate = 360;

// Generate static params for all posts
export async function generateStaticParams() {
  try {
    const posts = await getPostSlugs(500);
    
    if (!posts || posts.length === 0) {
      return [];
    }

    // For catch-all route [...slug], return array format
    return posts.map((post: { slug: string }) => ({
      slug: [post.slug],
    }));
  } catch (error) {
    console.error("Error generating static params for blog posts:", error);
    return [];
  }
}

interface PageProps {
  params: {
    slug: string[];
  };
}

export default async function BlogSlugPage({ params }: PageProps) {
  // Handle catch-all route - get the last segment as slug
  const slug = Array.isArray(params.slug) ? params.slug[params.slug.length - 1] : params.slug;

  if (!slug) {
    notFound();
  }

  const post = await getPostBySlug(slug);

  if (!post || !post.slug) {
    notFound();
  }

  return <BlogPostPage post={post} />;
}
