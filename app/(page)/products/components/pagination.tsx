"use client";

import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({ current, total, onChange }: PaginationProps) {
  if (total <= 1) return null;

  const pages: (number | "...")[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("...");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-1.5">
      <button
        type="button"
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-50 disabled:opacity-30"
      >
        <BiChevronLeft className="text-lg" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-1 text-sm text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`flex h-9 min-w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
              p === current
                ? "bg-amber-700 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        disabled={current === total}
        onClick={() => onChange(current + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-50 disabled:opacity-30"
      >
        <BiChevronRight className="text-lg" />
      </button>
    </div>
  );
}
