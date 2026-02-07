"use client";

import { LocaleType } from "../../../../../helpers/locale";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import BlogTags from "./tags";

const BlogCardLarge = ({
  title,
  image,
  slug,
  content,
  categories,
}: {
  title: string;
  image: string;
  slug: string;
  content: string;
  categories: Array<string>;
}) => {
  const pathname = usePathname();
  
  // Extract locale from pathname (e.g., /en/blog -> "en", /blog -> null)
  const queryLocale = useMemo(() => {
    const pathSegments = pathname?.split("/") || [];
    const firstSegment = pathSegments[1];
    const LOCALES = ["en", "ko", "ja", "zh", "fr", "de", "it", "pt", "es"];
    return LOCALES.includes(firstSegment) ? (firstSegment as LocaleType) : null;
  }, [pathname]);

  const blogPath = useMemo(() => {
    return queryLocale ? `/${queryLocale}/blog/${slug}` : `/blog/${slug}`;
  }, [queryLocale, slug]);

  return (
    <Link
      href={blogPath}
      className="flex w-full flex-1 cursor-pointer flex-col justify-start gap-[1.5rem] transition-all hover:scale-[.97] md:flex-row md:gap-[3.5rem]"
    >
      <Image
        src={image}
        width={500}
        height={500}
        className="h-[20rem] w-full object-cover md:h-[30.287rem] md:max-w-[60%]"
        alt="blog thumbnail"
      />
      <div className="md:pt-[1.27rem]">
        <h4 className="w-full text-[3rem] font-[500] leading-[3.27rem] text-black line-clamp-4">
          {title}
        </h4>
        <div className="my-[1.11rem]">
          <BlogTags itemsToRender={3} size="lg" tags={categories} />
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: content?.substring(0, 500) }}
          className=" my-0 leading-[1.825rem] text-[#646464] line-clamp-6"
        ></div>
      </div>
    </Link>
  );
};

export default BlogCardLarge;
