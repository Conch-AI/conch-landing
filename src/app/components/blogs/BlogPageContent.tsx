"use client";

import moment from "moment";
import { ArrowLeft, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Post } from "types/Post";
import { LocaleType } from "../../../../helpers/locale";

interface Category {
  name: string;
}

interface BlogPageContentProps {
  incomingPosts: Post[];
  categories: Category[] | null;
}

const BlogPageContent = ({
  incomingPosts,
  categories,
}: BlogPageContentProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [posts, setPosts] = useState<Post[]>(incomingPosts);
  const [isExpanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [isFocused, setFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Post[]>([]);

  const queryLocale = useMemo(() => {
    const pathSegments = pathname?.split("/") || [];
    const firstSegment = pathSegments[1];
    const LOCALES = ["en", "ko", "ja", "zh", "fr", "de", "it", "pt", "es"];
    return LOCALES.includes(firstSegment)
      ? (firstSegment as LocaleType)
      : null;
  }, [pathname]);

  const clickedCategory = useCallback(
    (categoryTitle: string) => {
      if (selectedCategory === categoryTitle || categoryTitle === "All") {
        setSelectedCategory("All");
        setPosts(incomingPosts);
        setExpanded(false);
      } else {
        setSelectedCategory(categoryTitle);
        setPosts(
          incomingPosts.filter(
            (post) => post.categories?.nodes[0].name === categoryTitle
          )
        );
      }
    },
    [incomingPosts, selectedCategory]
  );

  useEffect(() => {
    const category = searchParams?.get("category");
    if (category && typeof category === "string") {
      clickedCategory(category);
    }
  }, [searchParams, clickedCategory]);

  const formattedCategories = useMemo(
    () =>
      categories && categories.length
        ? ["All", ...categories.map((item: Category) => item?.name)]
        : [],
    [categories]
  );

  const visiblePosts = useMemo(() => {
    if (!posts?.length) return [];
    if (isExpanded || selectedCategory !== "All") {
      return posts.slice(selectedCategory === "All" ? 1 : 0);
    }
    return posts.slice(1, 9);
  }, [posts, isExpanded, selectedCategory]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        const searchTerm = query.toLowerCase();
        const filteredPosts = incomingPosts.filter((post: Post) =>
          post.title.toLowerCase().includes(searchTerm)
        );
        setSearchResults(filteredPosts);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, incomingPosts]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setQuery(e.target.value);
    },
    []
  );

  const handleFocus = useCallback(() => setFocused(true), []);
  const handleBlur = useCallback(() => {
    setTimeout(() => setFocused(false), 250);
  }, []);

  const formatCategoryName = (item: string) =>
    item === "Memory Techniques for Studying" ? "Study Techniques" : item;

  const getBlogPath = (slug: string) =>
    queryLocale ? `/${queryLocale}/blogs/${slug}` : `/blogs/${slug}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header — matches privacy page */}
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
            <Link
              href="/"
              className="flex items-center gap-2 text-[13px] md:text-[14px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Title + Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 md:mb-10">
          <div>
            <h1 className="text-2xl md:text-[36px] font-medium text-foreground mb-1 md:mb-2">
              Blog
            </h1>
            <p className="text-[13px] md:text-[14px] text-muted-foreground">
              Insights, tips, and updates from Conch AI
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72 lg:w-80">
            <div className="flex h-10 sm:h-11 w-full items-center rounded-xl border border-border bg-background px-3 sm:px-4 hover:border-[#6366f1] transition-colors focus-within:border-[#6366f1] focus-within:ring-2 focus-within:ring-[#6366f1]/20">
              <input
                value={query}
                onChange={handleSearch}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Search articles..."
                className="h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <Search size={18} className="text-muted-foreground flex-shrink-0" />
            </div>
            {isFocused && query && (
              <div className="absolute top-12 sm:top-14 left-0 right-0 z-[999] w-full rounded-xl border border-border bg-background shadow-lg max-h-[400px] overflow-y-auto">
                <div className="flex flex-col gap-1 p-2">
                  {searchResults.length === 0 && query ? (
                    <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                      No results found
                    </div>
                  ) : (
                    <>
                      {searchResults.slice(0, 8).map((item) => (
                        <Link
                          href={getBlogPath(item.slug)}
                          className="block w-full cursor-pointer rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                          key={item.slug}
                          onClick={() => {
                            setQuery("");
                            setFocused(false);
                          }}
                        >
                          <span className="line-clamp-2">{item.title}</span>
                        </Link>
                      ))}
                      {searchResults.length > 8 && (
                        <div className="px-3 py-2 text-xs text-muted-foreground text-center border-t border-border">
                          {searchResults.length - 8} more results...
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        {formattedCategories.length > 0 && (
          <div className="mb-8 md:mb-10">
            {/* Mobile Dropdown */}
            <div className="md:hidden w-full">
              <select
                value={selectedCategory}
                onChange={(e) => clickedCategory(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground font-medium focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] focus-visible:outline-none transition-colors appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  paddingRight: "3rem",
                }}
              >
                {formattedCategories.map((item) => (
                  <option key={item} value={item}>
                    {formatCategoryName(item)}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Pills */}
            <div className="hidden md:flex flex-wrap items-center gap-2">
              {formattedCategories.map((item) => {
                const isSelected = selectedCategory === item;
                return (
                  <button
                    onClick={() => clickedCategory(item)}
                    key={item}
                    className={`px-4 py-2 text-[13px] font-medium rounded-lg transition-all ${
                      isSelected
                        ? "bg-[#6366f1] text-white shadow-sm"
                        : "bg-muted text-muted-foreground border border-border hover:border-[#6366f1] hover:text-[#6366f1]"
                    } cursor-pointer`}
                  >
                    {formatCategoryName(item)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Featured Post */}
        {selectedCategory === "All" && posts?.length > 0 && (
          <Link
            href={getBlogPath(posts[0].slug)}
            className="group mb-8 md:mb-10 block rounded-2xl border border-border overflow-hidden hover:border-[#6366f1]/30 hover:shadow-lg transition-all"
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-1/2 h-48 md:h-72 overflow-hidden bg-muted">
                <Image
                  src={
                    posts[0].featuredImage?.node?.sourceUrl ||
                    "/optimized/images/blog/placeholder.webp"
                  }
                  alt={posts[0].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-5 md:p-8 flex flex-col justify-center md:w-1/2">
                <p className="text-[12px] md:text-[13px] text-muted-foreground mb-2 md:mb-3 font-medium uppercase tracking-wider">
                  Featured
                </p>
                <h2 className="text-lg md:text-2xl font-medium text-foreground mb-3 md:mb-4 line-clamp-3 group-hover:text-[#6366f1] transition-colors">
                  {posts[0].title}
                </h2>
                {posts[0].tags?.nodes?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                    {posts[0].tags.nodes.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#6366f1]/10 text-[#6366f1]"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-[13px] md:text-[14px] text-muted-foreground">
                  {moment(posts[0].date).format("MMMM DD, YYYY")}
                </p>
              </div>
            </div>
          </Link>
        )}

        {/* Empty State */}
        {selectedCategory !== "All" && posts?.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-[14px] text-muted-foreground">
              No articles found for this category.
            </p>
          </div>
        )}

        {/* Blog Grid */}
        {visiblePosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {visiblePosts.map((item) => (
              <Link
                key={item.slug}
                href={getBlogPath(item.slug)}
                className="group flex flex-col rounded-2xl border border-border overflow-hidden hover:border-[#6366f1]/30 hover:shadow-lg hover:-translate-y-1 transition-all h-full bg-background"
              >
                <div className="relative w-full h-40 md:h-44 overflow-hidden bg-muted">
                  <Image
                    src={
                      item.featuredImage?.node?.sourceUrl ||
                      "/optimized/images/blog/placeholder.webp"
                    }
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <div className="p-4 md:p-5 flex flex-col gap-2.5 flex-1">
                  <h3 className="text-[15px] md:text-base font-medium text-foreground line-clamp-2 group-hover:text-[#6366f1] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  {item.tags?.nodes?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.nodes.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 text-[11px] font-medium rounded-md bg-[#6366f1]/10 text-[#6366f1]"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-[12px] md:text-[13px] text-muted-foreground mt-auto">
                    {moment(item.date).format("MMMM DD, YYYY")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More */}
        {!isExpanded && selectedCategory === "All" && posts?.length > 9 && (
          <div className="text-center mt-10 md:mt-12">
            <button
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-2 px-8 py-3 text-[14px] font-medium rounded-xl bg-[#6366f1] text-white hover:bg-[#5558e3] transition-colors shadow-sm hover:shadow-md"
            >
              View All Posts
            </button>
          </div>
        )}
      </main>

      {/* Footer — matches privacy page */}
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

export default React.memo(BlogPageContent);
