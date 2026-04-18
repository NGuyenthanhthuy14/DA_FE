"use client";

import { motion } from "framer-motion";

import type { HeroCategory } from "./home-data";

interface CategoryPanelProps {
  categories: HeroCategory[];
}

export default function CategoryPanel({ categories }: CategoryPanelProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.05 }}
      className="overflow-hidden border border-amber-200 bg-white shadow-sm w-110"
    >
      <div className="border-b border-amber-100 bg-amber-50/60 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Categories
            </p>
            <h2 className="mt-1 text-xl font-bold text-dark">Đặc sản khu vực</h2>
          </div>

          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-primary">
            {categories.length} danh mục
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className="w-full rounded-2xl border border-amber-100 bg-primary-soft px-4 py-3 text-left transition hover:border-amber-300 hover:bg-background"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-dark md:text-base">
                    {category.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-stone-500 md:text-sm">
                    {category.description}
                  </p>
                </div>

                {"amount" in category && category.amount !== undefined ? (
                  <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-primary shadow-sm">
                    {category.amount}
                  </span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
