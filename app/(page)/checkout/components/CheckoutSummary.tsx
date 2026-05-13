"use client";

import React from "react";

function fmtPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

interface CheckoutSummaryProps {
  shopCount: number;
  subtotal: number;
  shippingTotal: number;
  total: number;
}

export default function CheckoutSummary({
  shopCount,
  subtotal,
  shippingTotal,
  total,
}: CheckoutSummaryProps) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
      <h2 className="m-0 mb-4 text-base font-bold text-amber-900">
        Tổng thanh toán
      </h2>

      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-stone-500">
          Tạm tính ({shopCount} shop)
        </span>
        <span className="text-sm font-semibold text-stone-800">
          {fmtPrice(subtotal)}
        </span>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-stone-500">Phí vận chuyển</span>
        <span className="text-sm font-semibold text-stone-800">
          {fmtPrice(shippingTotal)}
        </span>
      </div>

      <hr className="my-3 border-0 border-t border-dashed border-amber-200" />

      <div className="flex items-baseline justify-between">
        <span className="text-base font-bold text-amber-900">Tổng cộng</span>
        <span className="text-2xl font-extrabold text-orange-600">
          {fmtPrice(total)}
        </span>
      </div>
      <p className="m-0 mt-1 text-right text-xs text-stone-400">
        (Đã bao gồm VAT nếu có)
      </p>
    </div>
  );
}
