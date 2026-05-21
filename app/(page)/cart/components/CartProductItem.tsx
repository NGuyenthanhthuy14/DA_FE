"use client";

import React from "react";
import { LuMinus, LuPlus, LuTrash2 } from "react-icons/lu";
import type { CartItem } from "@/app/store/slices/cartSlices";
import { calcSalePrice } from "@/app/store/slices/cartSlices";
import CartCheckbox from "./CartCheckbox";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function imgSrc(path?: string) {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

function fmtPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

interface CartProductItemProps {
  item: CartItem;
  onToggle: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export default function CartProductItem({
  item,
  onToggle,
  onIncrease,
  onDecrease,
  onRemove,
}: CartProductItemProps) {
  const salePrice = calcSalePrice(item.price, item.discount);
  const lineTotal = salePrice * item.quantity;

  return (
    <div className="grid grid-cols-[20px_72px_1fr_auto_auto_auto] items-center gap-3.5 border-b border-orange-50/60 px-4 py-4 transition-colors last:border-b-0 hover:bg-amber-50/40">
      {/* Checkbox */}
      <CartCheckbox checked={item.selected} onChange={onToggle} />

      {/* Image */}
      <img
        src={imgSrc(item.image) ?? "/placeholder-food.png"}
        alt={item.name}
        className="h-[72px] w-[72px] shrink-0 rounded-xl border border-amber-200 bg-amber-100 object-cover"
      />

      {/* Info */}
      <div className="min-w-0">
        <p className="m-0 mb-1 line-clamp-2 text-sm font-semibold leading-snug text-stone-800">
          {item.name}
        </p>
        {item.countInStock > 0 && (
          <p className="m-0 mb-1 text-xs text-stone-400">
            Còn {item.countInStock} sản phẩm
          </p>
        )}
        <p className="m-0 text-[15px] font-bold text-orange-600">
          {fmtPrice(salePrice)}
          {item.discount > 0 && (
            <span className="ml-1.5 text-xs font-normal text-stone-400 line-through">
              {fmtPrice(item.price)}
            </span>
          )}
        </p>
      </div>

      {/* Quantity */}
      <div className="flex items-center overflow-hidden rounded-lg border border-stone-200 bg-white">
        <button
          className="flex h-8 w-8 cursor-pointer items-center justify-center border-none bg-transparent text-base text-stone-500 transition-all hover:bg-amber-100 hover:text-orange-600 disabled:cursor-not-allowed disabled:text-stone-300"
          type="button"
          onClick={onDecrease}
          disabled={item.quantity <= 1}
        >
          <LuMinus />
        </button>
        <span className="w-9 border-x border-stone-200 text-center text-sm font-semibold leading-8 text-stone-800">
          {item.quantity}
        </span>
        <button
          className="flex h-8 w-8 cursor-pointer items-center justify-center border-none bg-transparent text-base text-stone-500 transition-all hover:bg-amber-100 hover:text-orange-600 disabled:cursor-not-allowed disabled:text-stone-300"
          type="button"
          onClick={onIncrease}
          disabled={
            item.countInStock > 0 && item.quantity >= item.countInStock
          }
        >
          <LuPlus />
        </button>
      </div>

      {/* Line Total */}
      <span className="min-w-[90px] whitespace-nowrap text-right text-sm font-semibold text-stone-800">
        {fmtPrice(lineTotal)}
      </span>

      {/* Delete */}
      <button
        className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-lg text-stone-400 transition-all hover:bg-red-50 hover:text-red-500"
        type="button"
        onClick={onRemove}
        title="Xoá sản phẩm"
      >
        <LuTrash2 />
      </button>
    </div>
  );
}
