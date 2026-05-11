"use client";

import Link from "next/link";
import { BiStore, BiMap, BiChat } from "react-icons/bi";
import type { Shop } from "@/app/types/api/shops";

interface StoreBarProps {
  shop: Shop;
}

export default function StoreBar({ shop }: StoreBarProps) {
  return (
    <div className="mt-8 flex items-center gap-5 rounded-2xl border border-amber-100  p-5 shadow-sm">
      {/* Store Avatar */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10">
        {shop.cover_image ? (
          <img
            src={shop.cover_image}
            alt={shop.name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <BiStore className="text-3xl text-primary" />
        )}
      </div>

      {/* Store Info */}
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-bold text-gray-900 line-clamp-1">
          {shop.name}
        </h3>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
          <BiMap className="shrink-0 text-sm text-primary" />
          <span className="line-clamp-1">
            {shop.formatted_address || shop.address || "Chưa cập nhật địa chỉ"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-2">
        <Link
          href={`/stores/${shop.slug}`}
          className="flex items-center gap-1.5 rounded-xl border border-primary px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary/5"
        >
          <BiStore className="text-sm" />
          Xem Shop
        </Link>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
        >
          <BiChat className="text-sm" />
          Chat ngay
        </button>
      </div>
    </div>
  );
}
