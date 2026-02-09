"use client";

import { ArrowLeft, Calendar, User } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Post } from "types/Post";
import DOMPurify from "isomorphic-dompurify";

interface BlogPostProps {
  post: Post;
  onBack: () => void;
}

const BlogPost = ({ post, onBack }: BlogPostProps) => {
  const [activeHeading, setActiveHeading] = useState<string>("");

  // Extract headings from content for table of contents
  const tableOfContents = useMemo(() => {
    if (!post.content || typeof window === 'undefined') return [];

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = post.content;
    const headings = tempDiv.querySelectorAll("h2, h3");

    return Array.from(headings).map((heading, index) => ({
      id: `heading-${index}`,
      text: heading.textContent || "",
      level: heading.tagName.toLowerCase(),
    }));
  }, [post.content]);

  // Sanitize content
  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(post.content || "");
  }, [post.content]);

  // Add IDs to headings for scroll functionality
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const contentDiv = document.getElementById("blog-content");
    if (!contentDiv) return;

    const headings = contentDiv.querySelectorAll("h2, h3");
    headings.forEach((heading, index) => {
      heading.id = `heading-${index}`;
    });
  }, [sanitizedContent]);

  // Handle scroll to update active heading
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      const headings = document.querySelectorAll("#blog-content h2, #blog-content h3");
      let currentActive = "";

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          currentActive = heading.id;
        }
      });

      setActiveHeading(currentActive);
    };

    const contentArea = document.querySelector(".overflow-y-auto");
    contentArea?.addEventListener("scroll", handleScroll);

    return () => {
      contentArea?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToHeading = (id: string) => {
    if (typeof window === 'undefined') return;
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header — matches blog listing page */}
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="https://framerusercontent.com/images/A9DsIoq6hkJgbGBX8cIcdcQcNk.png?scale-down-to=512"
                width={28}
                height={28}
                alt="Conch AI"
                className="md:w-8 md:h-8"
              />
              <span className="text-lg md:text-xl bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent font-semibold">
                Conch
              </span>
            </Link>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[13px] md:text-[14px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Table of Contents - Desktop */}
          {tableOfContents.length > 0 && (
            <aside className="hidden xl:block w-72 shrink-0">
              <div className="sticky top-6 bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#6366f1] rounded-full"></span>
                  Table of Contents
                </h3>
                <nav className="space-y-1">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToHeading(item.id)}
                      className={`block w-full text-left text-sm py-2 px-3 rounded-lg transition-all ${
                        item.level === "h3" ? "pl-6 text-xs" : ""
                      } ${
                        activeHeading === item.id
                          ? "text-[#6366f1] font-semibold bg-[#6366f1]/10"
                          : "text-gray-600 hover:text-[#6366f1] hover:bg-gray-100"
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <article className="flex-1 min-w-0">
            {/* Featured Image */}
            {post.featuredImage?.node?.sourceUrl && (
              <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-8 bg-gray-100">
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-[1.15] tracking-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-10 pb-8 border-b-2 border-gray-100">
              {/* Author */}
              {post.author?.node && (
                <div className="flex items-center gap-3">
                  {post.author.node.avatar?.url ? (
                    <Image
                      src={post.author.node.avatar.url}
                      alt={post.author.node.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {post.author.node.name}
                    </p>
                    {post.author.node.description && (
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {post.author.node.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{moment(post.date).format("MMMM DD, YYYY")}</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags?.nodes && post.tags.nodes.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {post.tags.nodes.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10 text-[#6366f1] border border-[#6366f1]/20 hover:border-[#6366f1] transition-colors"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div
              id="blog-content"
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
                prose-h1:text-4xl prose-h1:mt-16 prose-h1:mb-6 prose-h1:leading-tight
                prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-5 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3
                prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-[#6366f1]
                prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-3
                prose-p:text-gray-700 prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-base
                prose-a:text-[#6366f1] prose-a:no-underline prose-a:font-medium hover:prose-a:underline hover:prose-a:text-[#5558e3]
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-em:text-gray-600
                prose-ul:my-8 prose-ul:space-y-3
                prose-ol:my-8 prose-ol:space-y-3
                prose-li:text-gray-700 prose-li:leading-relaxed prose-li:text-base
                prose-li::marker:text-[#6366f1] prose-li::marker:font-bold
                prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-10
                prose-blockquote:border-l-4 prose-blockquote:border-[#6366f1] prose-blockquote:bg-[#6366f1]/5 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-4 prose-blockquote:italic prose-blockquote:rounded-r-lg prose-blockquote:my-8
                prose-code:text-[#6366f1] prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-6 prose-pre:overflow-x-auto prose-pre:my-8
                prose-table:my-8 prose-table:border prose-table:border-gray-200
                prose-th:bg-gray-50 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold
                prose-td:px-4 prose-td:py-3 prose-td:border-t prose-td:border-gray-200
                prose-hr:my-12 prose-hr:border-gray-200"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {/* Categories */}
            {post.categories?.nodes && post.categories.nodes.length > 0 && (
              <div className="mt-16 pt-10 border-t-2 border-gray-100">
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#6366f1] rounded-full"></span>
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.categories.nodes.map((category) => (
                      <span
                        key={category.id}
                        className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-white text-gray-700 border border-gray-200 hover:border-[#6366f1] hover:text-[#6366f1] hover:shadow-sm transition-all cursor-pointer"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </article>
        </div>
      </div>

      {/* Footer — matches blog listing page */}
      <footer className="border-t border-border mt-12 md:mt-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[12px] md:text-[13px] text-muted-foreground">
              &copy; 2026 Yofi Tech, LLC. All rights reserved.
            </p>
            <div className="flex items-center gap-4 md:gap-6">
              <Link
                href="/blogs"
                className="text-[12px] md:text-[13px] text-[#6366f1] font-medium"
              >
                Blog
              </Link>
              <Link
                href="/privacy"
                className="text-[12px] md:text-[13px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-[12px] md:text-[13px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPost;
