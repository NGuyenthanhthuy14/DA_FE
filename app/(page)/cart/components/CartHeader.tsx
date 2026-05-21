"use client";

import React from "react";
import { LuShoppingCart, LuShare2, LuTrash2 } from "react-icons/lu";

interface CartHeaderProps {
  shopCount: number;
  selectedCount: number;
  onRemoveSelected: () => void;
}

export default function CartHeader({
  shopCount,
  selectedCount,
  onRemoveSelected,
}: CartHeaderProps) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <LuShoppingCart className="text-[28px] text-amber-900" />
        <h1 className="m-0 text-[22px] font-extrabold text-amber-900">
          Giỏ hàng{" "}
          <span className="text-lg font-medium text-stone-400">
            ({shopCount} shop)
          </span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-none bg-transparent px-3 py-1.5 font-inherit text-[13px] text-stone-500 transition-all hover:bg-amber-100 hover:text-amber-800"
        >
          <LuShare2 className="text-base" /> Chia sẻ giỏ hàng
        </button>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-none bg-transparent px-3 py-1.5 font-inherit text-[13px] text-stone-500 transition-all hover:bg-amber-100 hover:text-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => {
            if (selectedCount > 0) onRemoveSelected();
          }}
          disabled={selectedCount === 0}
        >
          <LuTrash2 className="text-base" /> Xoá đã chọn
        </button>
      </div>
    </div>
  );
}
