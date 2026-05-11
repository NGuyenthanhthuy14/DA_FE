"use client";

import React from "react";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";

export default function CartEmpty() {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-20">
      <div className="text-center">
        <div className="mb-4 text-7xl">🛒</div>
        <h2 className="mb-2 text-xl font-bold text-amber-900">
          Giỏ hàng trống
        </h2>
        <p className="mb-6 text-sm text-stone-400">
          Bạn chưa có sản phẩm nào trong giỏ hàng.
          <br />
          Hãy khám phá các đặc sản ngon nhé!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 px-7 py-3 text-[15px] font-bold text-white shadow-lg shadow-orange-600/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-600/35"
        >
          <LuArrowLeft />
          Khám phá ngay
        </Link>
      </div>
    </div>
  );
}
