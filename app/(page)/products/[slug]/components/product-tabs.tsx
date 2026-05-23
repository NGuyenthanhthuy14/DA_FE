"use client";

import { useState } from "react";
import Image from "next/image";
import { productBannerDetail } from "@/app/assets/image/product";
import {
  BiLeaf,
  BiCookie,
  BiWind,
  BiBox,
  BiTimer,
  BiSolidStar,
  BiStar,
} from "react-icons/bi";
import type {
  ProductDetailReview,
  ProductRatingSummary,
} from "@/app/types/api/product";

interface ProductTabsProps {
  description?: string;
  rating?: number;
  reviewCount?: number;
  ratingSummary?: ProductRatingSummary;
  reviews?: ProductDetailReview[];
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
  reviewCount = 0,
  ratingSummary,
  reviews = [],
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

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
            <div className="space-y-6">
              <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="shrink-0">
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-extrabold text-orange-600">
                        {rating.toFixed(1)}
                      </span>
                      <span className="pb-1 text-sm font-semibold text-orange-600">
                        trên 5
                      </span>
                    </div>
                    <RatingStars rating={rating} className="mt-1 text-lg" />
                  </div>

                  {ratingSummary && (
                    <div className="grid flex-1 gap-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count =
                          ratingSummary.stars[
                            String(star) as keyof ProductRatingSummary["stars"]
                          ] ?? 0;
                        const percent =
                          reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;

                        return (
                          <div key={star} className="flex items-center gap-2 text-xs">
                            <span className="w-10 font-medium text-stone-600">
                              {star} sao
                            </span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white">
                              <div
                                className="h-full rounded-full bg-orange-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="w-8 text-right text-stone-500">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
                  <p className="text-sm text-gray-400">
                    Sản phẩm chưa có đánh giá nào
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white">
                  {reviews.map((review) => (
                    <div key={review._id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                          {getReviewerName(review).charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="m-0 text-sm font-bold text-gray-900">
                              {getReviewerName(review)}
                            </p>
                            <span className="text-xs text-gray-400">
                              {formatDate(review.created_at)}
                            </span>
                          </div>

                          <RatingStars rating={review.rating} className="mt-1 text-sm" />

                          {review.comment ? (
                            <p className="m-0 mt-3 text-sm leading-6 text-gray-600">
                              {review.comment}
                            </p>
                          ) : (
                            <p className="m-0 mt-3 text-sm text-gray-400">
                              Người mua không để lại bình luận.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

function RatingStars({
  rating,
  className = "",
}: {
  rating: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, index) =>
        index < Math.round(rating) ? (
          <BiSolidStar key={index} className="text-[#f59e0b]" />
        ) : (
          <BiStar key={index} className="text-[#8a6a4d]" />
        ),
      )}
    </span>
  );
}

function getReviewerName(review: ProductDetailReview) {
  if (typeof review.user === "object" && review.user?.full_name) {
    return review.user.full_name;
  }

  if (typeof review.user === "object" && review.user?.email) {
    return review.user.email;
  }

  return "Người mua";
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
