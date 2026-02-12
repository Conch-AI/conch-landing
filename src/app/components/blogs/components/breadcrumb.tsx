"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const Breadcrumb = ({ category }: { category?: string }) => {
  const pathname = usePathname();
  
  // Extract slug from pathname (e.g., /blog/my-post-slug -> "my-post-slug")
  const slug = useMemo(() => {
    const segments = pathname?.split("/") || [];
    // Find the last segment that looks like a slug (contains hyphens)
    for (let i = segments.length - 1; i >= 0; i--) {
      if (segments[i] && segments[i].includes("-")) {
        return segments[i];
      }
    }
    return null;
  }, [pathname]);

  function replaceAndCapitalize(str: string) {
    const replacedStr = str.replace(/-/g, " ");

    const capitalizedStr = replacedStr.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });

    return capitalizedStr;
  }
  return (
    <div className="editorParaFont mt-0 mb-[1.5rem] flex h-[1.5rem] w-full flex-wrap items-center justify-start md:w-fit md:flex-nowrap">
      <Link
        href="/blogs"
        className="breadcrumb-link flex w-fit items-center text-[.95619rem] text-[#838383] no-underline underline-offset-4 hover:text-[#373530] hover:underline"
      >
        Home
        {category ? (
          <span className="mx-[.34rem]">
            <ChevronRight size={16} />
          </span>
        ) : null}
      </Link>
      {category ? (
        <Link
          href="/blogs"
          className="breadcrumb-link flex w-fit items-center text-[.95619rem] text-[#838383] no-underline underline-offset-4 hover:text-[#373530] hover:underline md:w-fit"
        >
          {category}
          {slug && slug?.includes("-") ? (
            <span className="mx-[.34rem]">
              <ChevronRight size={16} />
            </span>
          ) : null}
        </Link>
      ) : null}
      {slug?.includes("-") ? (
        <p className="breadcrumb-link my-0 flex w-fit items-center text-[.95619rem] text-[#838383] no-underline hover:text-[#373530] md:w-fit">
          {replaceAndCapitalize(slug as string)}
        </p>
      ) : null}
    </div>
  );
};

export default Breadcrumb;
