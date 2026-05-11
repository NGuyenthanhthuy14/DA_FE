"use client";

import React from "react";
import { LuTruck, LuRefreshCw, LuShieldCheck } from "react-icons/lu";

const INFO_ITEMS = [
  {
    icon: <LuTruck />,
    label: "Giao hàng toàn quốc",
    desc: "Nhận hàng từ 2–5 ngày",
  },
  {
    icon: <LuRefreshCw />,
    label: "Đổi trả dễ dàng",
    desc: "Trong 7 ngày",
  },
  {
    icon: <LuShieldCheck />,
    label: "Thanh toán an toàn",
    desc: "Bảo mật thông tin",
  },
];

export default function CartDeliveryInfo() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
      {INFO_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-amber-100 text-lg text-orange-600">
            {item.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-stone-800">
              {item.label}
            </span>
            <span className="text-xs text-stone-400">{item.desc}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
