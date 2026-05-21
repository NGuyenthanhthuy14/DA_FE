"use client";

import React from "react";
import Link from "next/link";
import type { CartItem } from "@/app/store/slices/cartSlices";
import { calcSalePrice } from "@/app/store/slices/cartSlices";
import CartCheckbox from "./CartCheckbox";
import CartProductItem from "./CartProductItem";

function fmtPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

interface CartShopGroupProps {
  shopId: string;
  shopName: string;
  items: CartItem[];
  onToggleShop: (shopId: string, selected: boolean) => void;
  onToggleItem: (productId: string) => void;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
}

export default function CartShopGroup({
  shopId,
  shopName,
  items,
  onToggleShop,
  onToggleItem,
  onIncrease,
  onDecrease,
  onRemove,
}: CartShopGroupProps) {
  const isShopAllSelected = items.every((i) => i.selected);
  const shopTotal = items.reduce(
    (sum, item) =>
      sum + calcSalePrice(item.price, item.discount) * item.quantity,
    0
  );

  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Shop Header */}
      <div className="flex items-center gap-2.5 border-b border-amber-50 bg-amber-50/40 px-4 py-3.5">
        <CartCheckbox
          checked={isShopAllSelected}
          onChange={() => onToggleShop(shopId, !isShopAllSelected)}
        />
        <h3 className="m-0 text-[15px] font-bold text-amber-900">
          {shopName}
        </h3>
        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-orange-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
          Shop uy tín
        </span>
        <Link
          href={`/shops/${shopId}`}
          className="ml-auto text-[13px] font-medium text-stone-500 no-underline transition-colors hover:text-orange-600"
        >
          Xem shop
        </Link>
      </div>

      {/* Product Items */}
      {items.map((item) => (
        <CartProductItem
          key={item.productId}
          item={item}
          onToggle={() => onToggleItem(item.productId)}
          onIncrease={() => onIncrease(item.productId)}
          onDecrease={() => onDecrease(item.productId)}
          onRemove={() => onRemove(item.productId)}
        />
      ))}

      {/* Shop Footer */}
      <div className="flex items-center justify-between border-t border-amber-50 bg-amber-50/40 px-4 py-3">
        <span className="text-[13px] text-stone-500">
          Tổng số {items.length} sản phẩm
        </span>
        <div>
          <span className="mr-2 text-[13px] text-stone-500">Tổng shop</span>
          <span className="text-[15px] font-bold text-orange-600">
            {fmtPrice(shopTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
