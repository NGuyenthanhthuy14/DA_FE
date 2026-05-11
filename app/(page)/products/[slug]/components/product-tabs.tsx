"use client";

import { useState } from "react";
import Image from "next/image";
import { productBanner, productBannerDetail } from "@/app/assets/image/product";
import {
  BiLeaf,
  BiCookie,
  BiWind,
  BiBox,
  BiTimer,
} from "react-icons/bi";

interface ProductTabsProps {
  description?: string;
  rating?: number;
  sold?: number;
}

const DETAIL_ITEMS = [
  { icon: BiLeaf, label: "Nguyên liệu", value: "Nguyên liệu tươi 100%" },
  { icon: BiCookie, label: "Cách chế biến", value: "Tẩm ướp gia vị truyền thống, chế biến thủ công" },
  { icon: BiWind, label: "Hương vị", value: "Dai ngon, đậm đà, thơm mùi khói bếp" },
  { icon: BiBox, label: "Bảo quản", value: "Nơi khô ráo, thoáng mát hoặc ngăn mát tủ lạnh" },
  { icon: BiTimer, label: "Hạn sử dụng", value: "6 tháng kể từ ngày sản xuất" },
];

type TabKey = "description" | "details" | "reviews";

export default function ProductTabs({
  description,
  rating = 0,
  sold = 0,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  const reviewCount = Math.floor((rating || 1) * 67);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "description", label: "Mô tả sản phẩm" },
    { key: "details", label: "Thông tin chi tiết" },
    { key: "reviews", label: `Đánh giá (${reviewCount})` },
  ];

  return (
    <div className="mt-10">
      {/* Tab Headers */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-5 py-3 text-sm font-semibold transition ${activeTab === tab.key
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {activeTab === "description" && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-gray-600">
                {description ||
                  "Sản phẩm đặc sản được chế biến từ nguyên liệu tươi ngon, tẩm ướp gia vị đặc trưng của vùng miền, sau đó hun khói tự nhiên trên gác bếp truyền thống. Sản phẩm dai ngon, đậm đà hương vị, là món nhậu tuyệt vời và cũng là món quà ý nghĩa."}
              </p>

              <div className="space-y-3 mt-6">
                {DETAIL_ITEMS.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <item.icon className="mt-0.5 text-lg text-primary shrink-0" />
                    <p className="text-sm text-gray-600">
                      <span className="font-bold text-gray-800">{item.label}:</span>{" "}
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-xl border border-gray-100">
                {[
                  ["Xuất xứ", "Việt Nam"],
                  ["Trọng lượng", "250g / 500g / 1kg"],
                  ["Thành phần", "Nguyên liệu tươi, gia vị truyền thống"],
                  ["Hạn sử dụng", "6 tháng"],
                  ["Bảo quản", "Nơi khô ráo, thoáng mát"],
                ].map(([label, value], i) => (
                  <div
                    key={label}
                    className={`flex text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                  >
                    <span className="w-40 shrink-0 px-4 py-3 font-semibold text-gray-700">
                      {label}
                    </span>
                    <span className="px-4 py-3 text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="text-center py-12">
              <p className="text-4xl">💬</p>
              <p className="mt-3 text-sm text-gray-400">
                Chức năng đánh giá đang được phát triển
              </p>
            </div>
          )}
        </div>

        {/* Decorative Image */}
        <div className="hidden lg:col-span-2 lg:flex lg:items-start lg:justify-center">
          <div className="relative h-100 w-300 overflow-hidden rounded-2xl -top-25">
            <Image
              src={productBannerDetail}
              alt="Decorative"
              className="h-full w-full object-cover opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
