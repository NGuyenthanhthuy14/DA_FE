"use client";

import { BiChevronDown, BiCurrentLocation } from "react-icons/bi";

/* ── Types ── */

export type DistanceRange = "all" | "5km" | "10km" | "15km" | "20km";

export interface SidebarFilterProps {
  types: string[];
  activeType: string;
  onTypeChange: (type: string) => void;
  distanceRange: DistanceRange;
  onDistanceRangeChange: (range: DistanceRange) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  hasLocation: boolean;
}

/* ── Constants ── */

const DISTANCE_RANGES: { value: DistanceRange; label: string }[] = [
  { value: "5km", label: "Trong 5 km" },
  { value: "10km", label: "Trong 10 km" },
  { value: "15km", label: "Trong 15 km" },
  { value: "20km", label: "Trong 20 km" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "bestSelling", label: "Bán chạy" },
  { value: "priceLow", label: "Giá thấp → cao" },
  { value: "priceHigh", label: "Giá cao → thấp" },
  { value: "topRated", label: "Đánh giá cao" },
  { value: "nearest", label: "Gần nhất" },
];

/* ── Component ── */

export default function SidebarFilter({
  types,
  activeType,
  onTypeChange,
  distanceRange,
  onDistanceRangeChange,
  sortBy,
  onSortChange,
  hasLocation,
}: SidebarFilterProps) {
  return (
    <aside className="w-full">
      {/* ─── Danh mục sản phẩm ─── */}
      <div>
        <h3 className="text-[15px] font-bold text-gray-900">Danh mục sản phẩm</h3>

        <ul className="mt-3 space-y-0.5">
          <li>
            <button
              type="button"
              onClick={() => onTypeChange("all")}
              className={`w-full py-2 text-left text-[13px] transition ${
                activeType === "all"
                  ? "border-l-[3px] border-amber-700 pl-3 font-bold text-gray-900"
                  : "pl-[15px] text-gray-600 hover:text-gray-900"
              }`}
            >
              Tất cả sản phẩm
            </button>
          </li>
          {types.map((t) => (
            <li key={t}>
              <button
                type="button"
                onClick={() => onTypeChange(t)}
                className={`w-full py-2 text-left text-[13px] transition ${
                  activeType === t
                    ? "border-l-[3px] border-amber-700 pl-3 font-bold text-gray-900"
                    : "pl-[15px] text-gray-600 hover:text-gray-900"
                }`}
              >
                {t}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ─── Khoảng cách ─── */}
      <div className="mt-7">
        <h3 className="text-[15px] font-bold text-gray-900">Khoảng cách</h3>

        {!hasLocation && (
          <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
            <BiCurrentLocation className="shrink-0 text-sm" />
            Cho phép truy cập vị trí để lọc theo khoảng cách
          </p>
        )}

        <div className="mt-3 space-y-2.5">
          <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-gray-600 transition hover:text-gray-900">
            <input
              type="radio"
              name="distanceRange"
              checked={distanceRange === "all"}
              onChange={() => onDistanceRangeChange("all")}
              className="h-4 w-4 border-gray-300 text-amber-700 accent-amber-700"
            />
            Tất cả
          </label>
          {DISTANCE_RANGES.map((dr) => (
            <label
              key={dr.value}
              className={`flex cursor-pointer items-center gap-2.5 text-[13px] transition ${
                hasLocation
                  ? "text-gray-600 hover:text-gray-900"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              <input
                type="radio"
                name="distanceRange"
                checked={distanceRange === dr.value}
                onChange={() => onDistanceRangeChange(dr.value)}
                disabled={!hasLocation}
                className="h-4 w-4 border-gray-300 text-amber-700 accent-amber-700 disabled:opacity-40"
              />
              {dr.label}
            </label>
          ))}
        </div>
      </div>

      {/* ─── Sắp xếp ─── */}
      <div className="mt-7">
        <h3 className="text-[15px] font-bold text-gray-900">Sắp xếp</h3>

        <div className="relative mt-3">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-9 text-[13px] text-gray-700 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <BiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-base text-gray-400" />
        </div>
      </div>
    </aside>
  );
}
