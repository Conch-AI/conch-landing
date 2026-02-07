type BlogTagsProps = {
  tags?: Array<string>;
  size: "sm" | "lg";
  itemsToRender?: number | undefined;
  clickHandler?: (label: string) => void;
  selectedCategory?: string;
  noHover?: boolean;
};

const BlogTags = ({
  tags,
  size,
  itemsToRender = undefined,
  clickHandler,
  selectedCategory,
  noHover = false,
}: BlogTagsProps) => {
  const classesArray = [
    `bg-[#6366f1]/10 text-[#6366f1] ${noHover ? "" : "hover:bg-[#6366f1]/20"}`,
    `bg-blue-50 text-blue-600 ${noHover ? "" : "hover:bg-blue-100"}`,
    `bg-purple-50 text-purple-600 ${noHover ? "" : "hover:bg-purple-100"}`,
    `bg-pink-50 text-pink-600 ${noHover ? "" : "hover:bg-pink-100"}`,
  ];

  if (!tags) {
    return <></>;
  }
  return (
    <div className="flex w-fit flex-wrap items-center gap-2">
      {tags &&
        tags.map((item, index) => {
          if (itemsToRender && index > itemsToRender - 1) {
            return;
          }
          const isSelected = selectedCategory === item;
          return (
            <div
              onClick={() => {
                if (clickHandler) {
                  clickHandler(item);
                }
              }}
              key={item}
              className={`rounded-lg line-clamp-1 font-medium transition-all ${
                size === "sm"
                  ? "py-1.5 px-2.5 text-xs"
                  : "px-4 py-2 text-sm"
              } ${classesArray[index % classesArray.length]} ${
                clickHandler ? "cursor-pointer" : "cursor-default"
              } ${isSelected ? "opacity-100" : selectedCategory ? "opacity-50" : "opacity-100"}`}
            >
              {item}
            </div>
          );
        })}
    </div>
  );
};

export default BlogTags;
