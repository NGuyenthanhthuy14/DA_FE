"use client";

import React from "react";
import { LuBanknote, LuWallet } from "react-icons/lu";

const PAYMENT_METHODS = [
  {
    id: "cod",
    label: "Thanh toán khi nhận hàng (COD)",
    icon: <LuBanknote />,
    iconBg: "bg-orange-100 text-orange-600",
  },
  {
    id: "online",
    label: "Thanh toán online qua ZaloPay",
    icon: <LuWallet />,
    iconBg: "bg-pink-100 text-pink-600",
  },
];

interface CheckoutPaymentProps {
  selected: string;
  onChange: (id: string) => void;
}

export default function CheckoutPayment({
  selected,
  onChange,
}: CheckoutPaymentProps) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
      <h2 className="m-0 mb-4 text-base font-bold text-amber-900">
        3. Phương thức thanh toán
      </h2>
      <div className="flex flex-col gap-2.5">
        {PAYMENT_METHODS.map((method) => (
          <label
            key={method.id}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
              selected === method.id
                ? "border-orange-400 bg-orange-50/60 shadow-sm"
                : "border-stone-200 hover:border-orange-300"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={selected === method.id}
              onChange={() => onChange(method.id)}
              className="accent-orange-600"
            />
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${method.iconBg}`}
            >
              {method.icon}
            </div>
            <span className="text-sm font-medium text-stone-700">
              {method.label}
            </span>
          </label>
        ))}
      </div>

      <p className="m-0 mt-4 text-center text-xs text-stone-400">
        Thông tin thanh toán của bạn được
        <br />
        bảo mật tuyệt đối.
      </p>
    </div>
  );
}
