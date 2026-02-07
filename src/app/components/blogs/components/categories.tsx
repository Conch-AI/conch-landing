type BlogCategoriesProps = {
  categories?: Array<string>;
  itemsToRender?: number | undefined;
  clickHandler?: (label: string) => void;
  selectedCategory?: string;
};

const BlogCategories = ({
  categories,
  itemsToRender = undefined,
  clickHandler,
  selectedCategory,
}: BlogCategoriesProps) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="w-full">
        <div className="md:hidden">
          <div className="animate-pulse bg-gray-200 h-11 rounded-lg w-full" />
        </div>
        <div className="hidden md:flex flex-wrap items-center gap-2 justify-center">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-200 h-9 w-24 rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  const displayedCategories = itemsToRender
    ? categories.slice(0, itemsToRender)
    : categories;

  const formatCategoryName = (item: string) =>
    item === "Memory Techniques for Studying" ? "Study Techniques" : item;

  return (
    <div className="w-full">
      {/* Mobile Dropdown */}
      <div className="md:hidden w-full">
        <select
          value={selectedCategory || "All"}
          onChange={(e) => {
            if (clickHandler) {
              clickHandler(e.target.value);
            }
          }}
          className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 font-medium focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] focus-visible:outline-none transition-colors appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 1rem center",
            paddingRight: "3rem",
          }}
        >
          {displayedCategories.map((item) => (
            <option key={item} value={item}>
              {formatCategoryName(item)}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Pills */}
      <div className="hidden md:flex flex-wrap items-center gap-2 justify-center">
        {displayedCategories.map((item) => {
          const isSelected = selectedCategory === item;
          return (
            <button
              onClick={() => {
                if (clickHandler) {
                  clickHandler(item);
                }
              }}
              key={item}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                isSelected
                  ? "bg-[#6366f1] text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#6366f1] hover:text-[#6366f1]"
              } ${clickHandler ? "cursor-pointer" : "cursor-default"}`}
            >
              {formatCategoryName(item)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BlogCategories;
