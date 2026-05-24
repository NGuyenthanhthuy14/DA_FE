"use client";

import React from "react";
import { LuMessageSquare, LuTruck } from "react-icons/lu";
import type { CartItem } from "@/app/store/slices/cartSlices";
import { calcSalePrice } from "@/app/store/slices/cartSlices";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function imgSrc(path?: string) {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

function fmtPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

const SHIPPING_OPTIONS = [
  {
    id: "standard",
    label: "Giao hàng tiêu chuẩn",
    time: "Theo đơn vị vận chuyển",
    icon: <LuTruck />,
  },
];

interface CheckoutShopOrderProps {
  shopId: string;
  shopName: string;
  items: CartItem[];
  estimatedDays: string;
  shippingFee: number;
  shippingLoading?: boolean;
  shippingError?: string;
  note: string;
  onNoteChange: (shopId: string, note: string) => void;
}

export default function CheckoutShopOrder({
  shopId,
  shopName,
  items,
  estimatedDays,
  shippingFee,
  shippingLoading = false,
  shippingError,
  note,
  onNoteChange,
}: CheckoutShopOrderProps) {
  const shippingOption = SHIPPING_OPTIONS[0];

  const productTotal = items.reduce(
    (sum, item) =>
      sum + calcSalePrice(item.price, item.discount) * item.quantity,
    0
  );

  const shopTotal = productTotal + shippingFee;

  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-amber-100 bg-amber-50/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-xs text-white">
            🏪
          </div>
          <h4 className="m-0 text-sm font-bold text-amber-900">{shopName}</h4>
        </div>
        <span className="text-xs text-stone-400">
          Dự kiến giao: {estimatedDays}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 border-r border-amber-100/50">
          {items.map((item) => {
            const salePrice = calcSalePrice(item.price, item.discount);
            return (
              <div
                key={item.productId}
                className="flex items-center gap-3 border-b border-amber-50/60 px-4 py-3 last:border-b-0"
              >
                <img
                  src={imgSrc(item.image) ?? "/placeholder-food.png"}
                  alt={item.name}
                  className="h-14 w-14 shrink-0 rounded-lg border border-amber-200 bg-amber-100 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="m-0 line-clamp-1 text-sm font-medium text-stone-800">
                    {item.name}
                  </p>
                  {item.countInStock > 0 && (
                    <p className="m-0 text-xs text-stone-400">
                      {item.countInStock}g
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-stone-500">
                  x{item.quantity}
                </span>
                <span className="shrink-0 text-sm font-semibold text-stone-800">
                  {fmtPrice(salePrice * item.quantity)}
                </span>
              </div>
            );
          })}

          <div className="flex items-center gap-2 border-t border-amber-50 px-4 py-2.5">
            <LuMessageSquare className="shrink-0 text-sm text-stone-400" />
            <input
              type="text"
              placeholder="Ghi chú cho shop (nếu có)"
              value={note}
              onChange={(e) => onNoteChange(shopId, e.target.value)}
              className="w-full border-none bg-transparent text-sm text-stone-600 outline-none placeholder:text-stone-300"
            />
          </div>
        </div>

        <div className="w-full border-t border-amber-100/50 lg:w-[220px] lg:border-t-0">
          <div className="px-4 py-3">
            <p className="m-0 mb-2 text-xs font-semibold text-stone-600">
              Phương thức vận chuyển
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2 rounded-lg border border-orange-400 bg-orange-50/60 px-3 py-2">
                <input
                  type="radio"
                  name={`shipping-${shopId}`}
                  value={shippingOption.id}
                  checked
                  readOnly
                  className="mt-0.5 accent-orange-600"
                />
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-orange-600">
                    {shippingOption.icon}
                  </span>
                  <div>
                    <p className="m-0 text-xs font-medium text-stone-700">
                      {shippingOption.label}
                    </p>
                    <p className="m-0 text-[11px] text-stone-400">
                      {shippingLoading
                        ? "Đang tính phí..."
                        : shippingError
                          ? shippingError
                          : `${shippingOption.time} - ${fmtPrice(shippingFee)}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-amber-100 px-4 py-3">
            <span className="text-xs text-stone-500">Tổng shop</span>
            <span className="text-[15px] font-bold text-orange-600">
              {fmtPrice(shopTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { SHIPPING_OPTIONS };
