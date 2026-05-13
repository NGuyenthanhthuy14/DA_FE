"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutThunk } from "@/app/action/authAction";
import type { AppDispatch } from "@/app/store";
import ProfileSidebar from "./components/ProfileSidebar";
import ProfileOverview from "./components/ProfileOverview";
import OrderHistory from "./components/OrderHistory";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("/profile/orders");

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.push("/");
  };

  // Render content dựa trên tab active
  const renderContent = () => {
    switch (activeTab) {
      case "/profile":
        return <ProfileOverview />;
      case "/profile/orders":
        return <OrderHistory />;
      case "/profile/account":
        return (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="mb-3 text-5xl">📝</span>
            <p className="m-0 text-sm text-stone-400">
              Trang thông tin tài khoản đang phát triển
            </p>
          </div>
        );
      case "/profile/addresses":
        return (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="mb-3 text-5xl">📍</span>
            <p className="m-0 text-sm text-stone-400">
              Trang sổ địa chỉ đang phát triển
            </p>
          </div>
        );
      case "/profile/wishlist":
        return (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="mb-3 text-5xl">❤️</span>
            <p className="m-0 text-sm text-stone-400">
              Trang yêu thích đang phát triển
            </p>
          </div>
        );
      case "/profile/reviews":
        return (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="mb-3 text-5xl">⭐</span>
            <p className="m-0 text-sm text-stone-400">
              Trang đánh giá đang phát triển
            </p>
          </div>
        );
      case "/profile/notifications":
        return (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="mb-3 text-5xl">🔔</span>
            <p className="m-0 text-sm text-stone-400">
              Trang thông báo đang phát triển
            </p>
          </div>
        );
      default:
        return <OrderHistory />;
    }
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row">
      {/* Sidebar */}
      <ProfileSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Content */}
      <main className="min-w-0 flex-1">{renderContent()}</main>
    </div>
  );
}
