"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LuHeart, LuRefreshCw, LuStore } from "react-icons/lu";
import { toast } from "sonner";
import StoreCard from "../../stores/components/store-card";
import { getFavoriteShops, removeFavoriteShop } from "@/apiRequest/shops";
import { useUser } from "@/app/hook/useUser";
import type { Shop } from "@/app/types/api/shops";

function getRating(index: number): number {
  const ratings = [4.8, 4.7, 4.6, 4.5, 4.4, 4.3];
  return ratings[index % ratings.length];
}

function getReviewCount(index: number): number {
  const counts = [2400, 1800, 1600, 1200, 980, 760];
  return counts[index % counts.length];
}

export default function FavoriteShops() {
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const likedIds = useMemo(() => new Set(shops.map((shop) => shop._id)), [shops]);

  const fetchFavoriteShops = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setShops([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await getFavoriteShops();
      if (res.err !== 0 || !Array.isArray(res.data)) {
        throw new Error(res.mess || "Không thể tải shop yêu thích");
      }

      setShops(res.data);
    } catch (fetchError: unknown) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Không thể tải shop yêu thích";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteShops();
  }, [isAuthenticated]);

  const handleRemoveFavorite = async (shopId: string) => {
    if (removingIds.has(shopId)) return;

    const previousShops = shops;

    setRemovingIds((prev) => new Set(prev).add(shopId));
    setShops((current) => current.filter((shop) => shop._id !== shopId));

    try {
      const res = await removeFavoriteShop(shopId);
      if (res.err !== 0) {
        throw new Error(res.mess || "Không thể bỏ shop yêu thích");
      }

      toast.success("Đã bỏ shop khỏi danh sách yêu thích");
    } catch (removeError: unknown) {
      setShops(previousShops);
      const message =
        removeError instanceof Error
          ? removeError.message
          : "Không thể bỏ shop yêu thích";
      toast.error(message);
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(shopId);
        return next;
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-white p-6 text-center shadow-sm">
        <LuHeart className="mx-auto mb-3 text-5xl text-stone-300" />
        <h1 className="m-0 text-xl font-extrabold text-stone-800">
          Shop yêu thích
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-stone-500">
          Bạn cần đăng nhập để xem danh sách shop yêu thích.
        </p>
        <button
          type="button"
          onClick={() => router.push("/auth/login")}
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
        >
          Đăng nhập
        </button>
      </section>
    );
  }

  if (loading) {
    return (
      <section>
        <h1 className="m-0 mb-5 text-xl font-extrabold text-stone-800">
          Shop yêu thích
        </h1>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-2xl border border-amber-100 bg-white"
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
          Shop yêu thích
        </h1>
        <div className="flex flex-col items-center rounded-2xl border border-red-200 bg-red-50 py-12 text-center">
          <p className="m-0 mb-4 text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={fetchFavoriteShops}
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
            Shop yêu thích
          </h1>
          <p className="m-0 mt-1 text-sm text-stone-500">
            {shops.length} shop đã lưu
          </p>
        </div>
        <button
          type="button"
          onClick={fetchFavoriteShops}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-500 transition hover:border-orange-300 hover:text-orange-600"
        >
          <LuRefreshCw className="text-sm" />
          Làm mới
        </button>
      </div>

      {shops.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-amber-200 bg-white py-16 text-center shadow-sm">
          <LuStore className="mb-3 text-5xl text-stone-300" />
          <p className="m-0 text-sm font-medium text-stone-400">
            Bạn chưa có shop yêu thích nào
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {shops.map((shop, index) => (
            <StoreCard
              key={shop._id}
              id={shop._id}
              slug={shop.slug}
              name={shop.name}
              image={shop.cover_image || undefined}
              description={shop.description}
              address={shop.formatted_address || shop.address}
              rating={getRating(index)}
              reviewCount={getReviewCount(index)}
              liked={likedIds.has(shop._id)}
              likeDisabled={removingIds.has(shop._id)}
              onToggleLike={() => handleRemoveFavorite(shop._id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
