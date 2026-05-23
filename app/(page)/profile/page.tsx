"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutThunk } from "@/app/action/authAction";
import type { AppDispatch } from "@/app/store";
import ProfileSidebar from "./components/ProfileSidebar";
import ProfileOverview from "./components/ProfileOverview";
import OrderHistory from "./components/OrderHistory";
import AccountInfo from "./components/AccountInfo";
import FavoriteShops from "./components/FavoriteShops";
import MyReviews from "./components/MyReviews";
import AddressBook from "./components/AddressBook";

const comingSoonMessages: Record<string, { icon: string; message: string }> = {
  "/profile/addresses": {
    icon: "📍",
    message: "Trang sổ địa chỉ đang phát triển",
  },
  "/profile/wishlist": {
    icon: "❤️",
    message: "Trang yêu thích đang phát triển",
  },
  "/profile/reviews": {
    icon: "⭐",
    message: "Trang đánh giá đang phát triển",
  },
  "/profile/notifications": {
    icon: "🔔",
    message: "Trang thông báo đang phát triển",
  },
};

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("/profile/orders");

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.push("/");
  };

  const renderComingSoon = (tab: string) => {
    const item = comingSoonMessages[tab];

    return (
      <div className="flex flex-col items-center py-16 text-center">
        <span className="mb-3 text-5xl">{item.icon}</span>
        <p className="m-0 text-sm text-stone-400">{item.message}</p>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "/profile":
        return <ProfileOverview />;
      case "/profile/account":
        return <AccountInfo />;
      case "/profile/orders":
        return <OrderHistory />;
      case "/profile/wishlist":
        return <FavoriteShops />;
      case "/profile/reviews":
        return <MyReviews />;
      case "/profile/addresses":
        return <AddressBook />;
      case "/profile/notifications":
        return renderComingSoon(activeTab);
      default:
        return <OrderHistory />;
    }
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row">
      <ProfileSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="min-w-0 flex-1">{renderContent()}</main>
    </div>
  );
}
