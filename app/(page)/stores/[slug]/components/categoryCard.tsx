import React from "react";

export interface CategoryCardItem {
  id: string;
  label: string;
  emoji: string;
}

interface CategoryCardProps {
  cat: CategoryCardItem;
  active?: boolean;
  onClick?: () => void;
}

export default function CategoryCard({
  cat,
  active = false,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 flex-col items-center gap-2 rounded-xl px-5 py-3 min-w-20 transition-all duration-200 font-medium text-sm ${
        active
          ? "border-2 border-amber-700 bg-amber-50 text-amber-700"
          : "border-2 border-gray-200 bg-white text-gray-600 hover:border-amber-200"
      }`}
    >
      <span className="text-2xl">{cat.emoji}</span>
      <span className="line-clamp-1">{cat.label}</span>
    </button>
  );
}
