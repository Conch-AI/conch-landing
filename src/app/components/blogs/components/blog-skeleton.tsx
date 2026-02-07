const BlogSkeleton = () => {
  return (
    <div className="group flex w-full flex-col bg-white rounded-xl border border-gray-200 overflow-hidden h-full animate-pulse">
      {/* Image skeleton */}
      <div className="relative w-full h-36 sm:h-40 md:h-44 overflow-hidden bg-gray-200">
        <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-3.5 sm:p-4 flex flex-col gap-2 sm:gap-2.5 flex-1">
        {/* Title skeleton - 2 lines */}
        <div className="space-y-2">
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        {/* Tags skeleton */}
        <div className="flex gap-2 mt-1">
          <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
        </div>
        
        {/* Date skeleton */}
        <div className="h-3 w-24 bg-gray-200 rounded mt-auto"></div>
      </div>
    </div>
  );
};

export const BlogSkeletonGrid = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="mx-auto mb-16 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <BlogSkeleton key={index} />
      ))}
    </div>
  );
};

export default BlogSkeleton;
