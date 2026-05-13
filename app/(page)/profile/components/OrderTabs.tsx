"use client";

import React from "react";

const TABS = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chờ xác nhận" },
  { id: "confirmed", label: "Đã xác nhận" },
  { id: "shipping", label: "Đang giao" },
  { id: "delivered", label: "Đã giao" },
  { id: "cancelled", label: "Đã huỷ" },
];

interface OrderTabsProps {
  active: string;
  onChange: (id: string) => void;
  counts?: Record<string, number>;
}

export default function OrderTabs({ active, onChange, counts }: OrderTabsProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {TABS.map((tab) => {
        const count = counts?.[tab.id];
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`cursor-pointer rounded-lg border px-4 py-1.5 font-inherit text-sm font-medium transition-all ${
              active === tab.id
                ? "border-orange-600 bg-orange-600 text-white shadow-sm shadow-orange-600/20"
                : "border-stone-200 bg-white text-stone-600 hover:border-orange-300 hover:text-orange-600"
            }`}
          >
            {tab.label}
            {count !== undefined && count > 0 && (
              <span
                className={`ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[11px] font-bold ${
                  active === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-stone-100 text-stone-500"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
