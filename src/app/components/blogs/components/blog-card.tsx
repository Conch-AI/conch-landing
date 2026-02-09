"use client";

import { LocaleType } from "../../../../../helpers/locale";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, memo, useMemo } from "react";
import BlogTags from "./tags";

const ImageWithFallback = memo(({ src, alt = "", ...props }: { src: string; alt?: string } & React.ComponentPropsWithoutRef<typeof Image>) => {
  const imageSrc = useMemo(
    () => src || "/optimized/images/blog/placeholder.webp",
    [src],
  );

  return (
    <Suspense
      fallback={
        <div className="w-full h-full animate-pulse bg-gray-200" />
      }
    >
      <Image
        src={imageSrc}
        alt={alt}
        loading="eager"
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        priority={false}
        sizes="(max-width: 768px) 100vw, 400px"
        quality={85}
        {...props}
      />
    </Suspense>
  );
});

ImageWithFallback.displayName = "ImageWithFallback";

const BlogCard = memo(
  ({
    title,
    date,
    image,
    slug,
    tags,
    onClick,
  }: {
    title: string;
    date: string;
    image: string;
    slug: string;
    tags?: Array<string>;
    onClick?: (slug: string) => void;
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
      return queryLocale ? `/${queryLocale}/blogs/${slug}` : `/blogs/${slug}`;
    }, [queryLocale, slug]);

    const handleClick = (e: React.MouseEvent) => {
      if (onClick) {
        e.preventDefault();
        onClick(slug);
      }
    };

    const memoizedTags = useMemo(
      () =>
        tags &&
        tags.length > 0 && (
          <div className="my-[.5rem]">
            <BlogTags itemsToRender={3} noHover={true} tags={tags} size="sm" />
          </div>
        ),
      [tags],
    );

    return (
      <Link
        href={blogPath}
        onClick={handleClick}
        className="group flex w-full flex-col bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-lg hover:border-[#6366f1]/30 hover:-translate-y-1 h-full"
      >
        <div className="relative w-full h-36 sm:h-40 md:h-44 overflow-hidden bg-gray-100">
          <ImageWithFallback src={image} alt="blog thumbnail" />
        </div>
        <div className="p-3.5 sm:p-4 flex flex-col gap-2 sm:gap-2.5 flex-1">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-[#6366f1] transition-colors leading-snug">
            {title}
          </h4>
          {memoizedTags}
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-auto">
            {date}
          </p>
        </div>
      </Link>
    );
  },
);

BlogCard.displayName = "BlogCard";

export default BlogCard;
