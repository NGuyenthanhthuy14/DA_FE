"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuUser,
  LuFileText,
  LuMapPin,
  LuClipboardList,
  LuHeart,
  LuStar,
  LuBell,
  LuLogOut,
  LuHeadset,
} from "react-icons/lu";

const MENU_ITEMS = [
  { href: "/profile", label: "Trang cá nhân", icon: <LuUser /> },
  {
    href: "/profile/account",
    label: "Thông tin tài khoản",
    icon: <LuFileText />,
  },
  { href: "/profile/addresses", label: "Sổ địa chỉ", icon: <LuMapPin /> },
  {
    href: "/profile/orders",
    label: "Lịch sử đặt hàng",
    icon: <LuClipboardList />,
  },
  { href: "/profile/wishlist", label: "Shop yêu thích", icon: <LuHeart /> },
  { href: "/profile/reviews", label: "Đánh giá của tôi", icon: <LuStar /> },
  { href: "/profile/notifications", label: "Thông báo", icon: <LuBell /> },
];

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
}

export default function ProfileSidebar({
  activeTab,
  onTabChange,
  onLogout,
}: ProfileSidebarProps) {
  return (
    <aside className="w-full shrink-0 lg:w-[240px]">
      <nav className="flex flex-col gap-1">
        {MENU_ITEMS.map((item) => {
          const isActive = activeTab === item.href;
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => onTabChange(item.href)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border-none px-4 py-2.5 text-left font-inherit text-sm font-medium transition-all ${
                isActive
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                  : "bg-transparent text-stone-600 hover:bg-amber-50 hover:text-amber-900"
              }`}
            >
              <span
                className={`text-lg ${isActive ? "text-white" : "text-stone-400"}`}
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-xl border-none bg-transparent px-4 py-2.5 text-left font-inherit text-sm font-medium text-stone-500 transition-all hover:bg-red-50 hover:text-red-600"
        >
          <LuLogOut className="text-lg text-stone-400" />
          Đăng xuất
        </button>
      </nav>

      {/* Support Card */}
      <div className="mt-6 rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <LuHeadset className="text-xl text-orange-600" />
          <span className="text-sm font-bold text-stone-800">
            Trung tâm hỗ trợ
          </span>
        </div>
        <p className="m-0 mb-3 text-xs text-stone-400">
          Bạn cần hỗ trợ?
          <br />
          Chúng tôi luôn sẵn sàng!
        </p>
        <button
          type="button"
          className="cursor-pointer rounded-lg border border-orange-600 bg-transparent px-4 py-1.5 font-inherit text-xs font-semibold text-orange-600 transition-all hover:bg-orange-600 hover:text-white"
        >
          Liên hệ ngay
        </button>
      </div>
    </aside>
  );
}
