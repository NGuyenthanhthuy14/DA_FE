"use client";

import React from "react";

function fmtPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

interface CartSummaryProps {
  selectedCount: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  onCheckout: () => void;
}

export default function CartSummary({
  selectedCount,
  subtotal,
  shippingFee,
  total,
  onCheckout,
}: CartSummaryProps) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
      <h2 className="m-0 mb-4 text-[17px] font-bold text-amber-900">
        Tóm tắt đơn hàng
      </h2>

      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-sm text-stone-500">
          Tạm tính ({selectedCount} sản phẩm)
        </span>
        <span className="text-sm font-semibold text-stone-800">
          {fmtPrice(subtotal)}
        </span>
      </div>

      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-sm text-stone-500">
          Phí vận chuyển (dự kiến)
        </span>
        <span className="text-sm font-semibold text-stone-800">
          {shippingFee > 0 ? fmtPrice(shippingFee) : "Miễn phí"}
        </span>
      </div>

      <hr className="my-4 border-0 border-t border-dashed border-amber-200" />

      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-base font-bold text-amber-900">Tổng cộng</span>
        <span className="text-2xl font-extrabold text-orange-600">
          {fmtPrice(total)}
        </span>
      </div>

      <p className="mb-5 text-right text-xs text-stone-400">
        (Đã bao gồm VAT nếu có)
      </p>

      <button
        className="relative w-full cursor-pointer overflow-hidden rounded-xl border-none bg-gradient-to-br from-orange-600 to-orange-500 px-5 py-3.5 font-inherit text-base font-bold text-white shadow-lg shadow-orange-600/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-600/40 active:translate-y-0 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:bg-none disabled:shadow-none disabled:hover:translate-y-0"
        type="button"
        onClick={onCheckout}
        disabled={selectedCount === 0}
      >
        Tiến hành thanh toán
      </button>
    </div>
  );
}
