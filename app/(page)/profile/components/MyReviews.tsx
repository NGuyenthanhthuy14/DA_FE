"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LuRefreshCw, LuStar } from "react-icons/lu";
import { getMyProductReviews } from "@/apiRequest/productReview";
import type { ProductReview } from "@/app/types/api/productReview";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function imgSrc(path?: string) {
  if (!path) return "/placeholder-food.png";
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getProduct(review: ProductReview) {
  return typeof review.product === "string" ? null : review.product;
}

function getShop(review: ProductReview) {
  return typeof review.shop === "string" ? null : review.shop;
}

export default function MyReviews() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getMyProductReviews();
      if (res.err !== 0 || !Array.isArray(res.data)) {
        throw new Error(res.mess || "Không thể tải đánh giá");
      }

      setReviews(res.data);
    } catch (reviewError: unknown) {
      const message =
        reviewError instanceof Error
          ? reviewError.message
          : "Không thể tải đánh giá";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <section>
        <h1 className="m-0 mb-5 text-xl font-extrabold text-stone-800">
          Đánh giá của tôi
        </h1>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border border-amber-100 bg-white"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h1 className="m-0 mb-5 text-xl font-extrabold text-stone-800">
          Đánh giá của tôi
        </h1>
        <div className="flex flex-col items-center rounded-2xl border border-red-200 bg-red-50 py-12 text-center">
          <p className="m-0 mb-4 text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={fetchReviews}
            className="inline-flex items-center gap-2 rounded-lg border border-orange-400 bg-white px-5 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
          >
            <LuRefreshCw className="text-sm" />
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="m-0 text-xl font-extrabold text-stone-800">
            Đánh giá của tôi
          </h1>
          <p className="m-0 mt-1 text-sm text-stone-500">
            {reviews.length} đánh giá đã gửi
          </p>
        </div>
        <button
          type="button"
          onClick={fetchReviews}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-500 transition hover:border-orange-300 hover:text-orange-600"
        >
          <LuRefreshCw className="text-sm" />
          Làm mới
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-amber-200 bg-white py-16 text-center shadow-sm">
          <LuStar className="mb-3 text-5xl text-stone-300" />
          <p className="m-0 text-sm font-medium text-stone-400">
            Bạn chưa có đánh giá nào
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const product = getProduct(review);
            const shop = getShop(review);

            return (
              <article
                key={review._id}
                className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm"
              >
                <div className="flex gap-4">
                  <img
                    src={imgSrc(product?.image_url)}
                    alt={product?.name || "Sản phẩm"}
                    className="h-20 w-20 shrink-0 rounded-xl border border-amber-100 bg-amber-50 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        {product?.slug ? (
                          <Link
                            href={`/products/${product.slug}`}
                            className="line-clamp-1 text-sm font-bold text-stone-800 no-underline hover:text-orange-600"
                          >
                            {product.name}
                          </Link>
                        ) : (
                          <p className="m-0 line-clamp-1 text-sm font-bold text-stone-800">
                            {product?.name || "Sản phẩm"}
                          </p>
                        )}
                        <p className="m-0 mt-1 text-xs text-stone-400">
                          {shop?.name || "Shop"} · {fmtDate(review.created_at)}
                        </p>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <LuStar
                            key={star}
                            className={
                              star <= review.rating
                                ? "h-4 w-4 fill-amber-400 text-amber-400"
                                : "h-4 w-4 text-stone-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment ? (
                      <p className="m-0 mt-3 text-sm leading-6 text-stone-600">
                        {review.comment}
                      </p>
                    ) : (
                      <p className="m-0 mt-3 text-sm italic text-stone-400">
                        Không có bình luận.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
