import React from "react";

interface TableOfContentsProps {
  table: string[];
  scrollToSection: (item: string, target: HTMLElement) => void;
  sticky?: boolean;
  activeHeadings: string[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  table,
  scrollToSection,
  activeHeadings,
}) => {
  return (
    <div className="w-full rounded-lg bg-white p-4 shadow-sm md:w-[11.4375rem]">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Table of Contents
      </h2>
      <nav className="flex flex-col space-y-2">
        {table.map((item, index) => (
          <button
            key={index}
            onClick={(e) => scrollToSection(item, e.target as HTMLElement)}
            className={`content-link text-left text-sm transition-all duration-200 ${
              activeHeadings.includes(item)
                ? "font-medium text-gray-900"
                : "text-gray-500 hover:text-gray-900"
            } line-clamp-2 hover:bg-gray-50`}
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents;
