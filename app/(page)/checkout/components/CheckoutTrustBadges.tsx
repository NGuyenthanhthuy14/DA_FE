"use client";

import React from "react";
import { LuShieldCheck, LuTruck, LuRefreshCw, LuHeadset } from "react-icons/lu";

const BADGES = [
  { icon: <LuShieldCheck />, label: "100% đặc sản chính gốc" },
  { icon: <LuTruck />, label: "Giao hàng toàn quốc" },
  { icon: <LuRefreshCw />, label: "Đổi trả dễ dàng trong 7 ngày" },
  { icon: <LuHeadset />, label: "Hỗ trợ khách hàng 24/7" },
];

export default function CheckoutTrustBadges() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
      <h3 className="m-0 mb-3 text-sm font-bold text-amber-900">
        Cam kết từ Đặc sản Việt
      </h3>
      <div className="flex flex-col gap-2.5">
        {BADGES.map((badge) => (
          <div key={badge.label} className="flex items-center gap-2.5">
            <span className="text-base text-orange-500">{badge.icon}</span>
            <span className="text-[13px] text-stone-600">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
