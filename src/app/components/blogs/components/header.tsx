"use client";

import { LocaleType } from "../../../../../helpers/locale";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Post } from "types/Post";

const BlogHeader = ({ allPosts }: { allPosts: Post[] }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setFocused] = useState(false);
  const pathname = usePathname();
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  
  // Extract locale from pathname (e.g., /en/blog -> "en", /blog -> null)
  const queryLocale = useMemo(() => {
    const pathSegments = pathname?.split("/") || [];
    const firstSegment = pathSegments[1];
    const LOCALES = ["en", "ko", "ja", "zh", "fr", "de", "it", "pt", "es"];
    return LOCALES.includes(firstSegment) ? (firstSegment as LocaleType) : null;
  }, [pathname]);

  // Debounce search to avoid excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        const searchTerm = query.toLowerCase();
        const filteredPosts = allPosts.filter((post: Post) =>
          post.title.toLowerCase().includes(searchTerm),
        );
        setSearchResults(filteredPosts);
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query, allPosts]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setQuery(e.target.value);
  }, []);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => setFocused(false), 250);
  }, []);

  // Memoize search results rendering
  const renderedSearchResults = useMemo(() => {
    if (!searchResults.length && query) {
      return (
        <div className="px-3 py-4 text-center text-sm text-gray-500">
          No results found
        </div>
      );
    }

    // Limit to 8 results for better UX
    const limitedResults = searchResults.slice(0, 8);

    return (
      <>
        {limitedResults.map((item) => (
          <Link
            href={
              queryLocale
                ? `/${queryLocale}/blog/${item.slug}`
                : `/blog/${item.slug}`
            }
            className="block w-full cursor-pointer rounded-lg px-3 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
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
          <div className="px-3 py-2 text-xs text-gray-400 text-center border-t border-gray-100">
            {searchResults.length - 8} more results...
          </div>
        )}
      </>
    );
  }, [searchResults, queryLocale, query]);

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between mb-6 sm:mb-8">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent">
          Blog
        </h1>
      </div>
      <div className="relative w-full md:w-72 lg:w-80">
        <div className="flex h-10 sm:h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 sm:px-4 shadow-sm hover:border-[#6366f1] transition-colors focus-within:border-[#6366f1] focus-within:ring-2 focus-within:ring-[#6366f1]/20">
          <input
            value={query}
            onChange={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search articles..."
            className="h-full w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
          <Search size={18} className="text-gray-400" />
        </div>
        {isFocused && query && (
          <div className="absolute top-12 sm:top-14 left-0 right-0 z-[999] w-full rounded-xl border border-gray-200 bg-white shadow-lg max-h-[400px] overflow-y-auto">
            <div className="flex flex-col gap-1 p-2">
              {renderedSearchResults}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogHeader;
