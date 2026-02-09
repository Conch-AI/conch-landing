"use client";

import BlogPost from "@/app/components/blogs/BlogPost";
import { Post } from "types/Post";
import { useRouter } from "next/navigation";

interface BlogPostPageProps {
  post: Post;
}

export default function BlogPostPage({ post }: BlogPostPageProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push("/blogs");
  };

  return <BlogPost post={post} onBack={handleBack} />;
}
