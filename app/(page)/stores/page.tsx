"use client";

import React, { useState, useMemo, useEffect } from "react";
import StoreBanner from "./components/store-banner";
import StoreCard from "./components/store-card";
import type { StoreCardBadge } from "./components/store-card";
import StoreCardSkeleton from "./components/store-card-skeleton";
import { useShopAPI } from "@/app/services/useShop";


const TAG_POOL = [
  ["Phở", "Quán lâu năm"],
  ["Bún chả", "Nổi tiếng"],
  ["Bánh mì", "Giá rẻ"],
  ["Cơm tấm", "No căng bụng"],
  ["Bún đậu", "Đông khách"],
  ["Lẩu", "Ăn là ghiền"],
];


function getTags(index: number): string[] {
  return TAG_POOL[index % TAG_POOL.length];
}

function getRating(index: number): number {
  const ratings = [4.7, 4.6, 4.5, 4.4, 4.3, 4.2];
  return ratings[index % ratings.length];
}

function getReviewCount(index: number): number {
  const counts = [2100, 3200, 1500, 1100, 980, 870];
  return counts[index % counts.length];
}

/* ── Haversine distance (km) ── */
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

export default function StorePage() {
  const { shop } = useShopAPI();
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const stores = shop?.metadata ?? [];
  const loading = !shop;

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 21.0285, lng: 105.8542 })
      );
    } else {
      setUserLocation({ lat: 21.0285, lng: 105.8542 });
    }
  }, []);

  const storesWithDistance = useMemo(() => {
    if (!userLocation) return stores.map((s) => ({ store: s, distanceKm: 0 }));

    const withDist = stores.map((store) => ({
      store,
      distanceKm: haversineKm(userLocation.lat, userLocation.lng, store.latitude, store.longitude),
    }));

    withDist.sort((a, b) => a.distanceKm - b.distanceKm);
    return withDist;
  }, [stores, userLocation]);

  const handleToggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      <StoreBanner />

      <main className="container pt-6 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <StoreCardSkeleton key={i} />
            ))}
          </div>
        ) : storesWithDistance.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {storesWithDistance.map(({ store, distanceKm }, index) => (
                <StoreCard
                  key={store._id}
                  id={store._id}
                  slug={store.slug}
                  name={store.name}
                  image={store.cover_image || undefined}
                  description={store.description}
                  address={store.formatted_address || store.address}
                  rating={getRating(index)}
                  reviewCount={getReviewCount(index)}
                  distance={formatDistanceKm(distanceKm)}
                  tags={getTags(index)}
                  liked={likedIds.has(store._id)}
                  onToggleLike={() => handleToggleLike(store._id)}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 py-6 text-[#8b7a6b] text-sm">
              <span>🔄</span>
              <span>Đang tải thêm quán ngon</span>
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a77d] animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a77d] animate-bounce [animation-delay:200ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a77d] animate-bounce [animation-delay:400ms]" />
              </span>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">😢</p>
            <p className="text-[#8b7a6b] text-base">Không tìm thấy quán ăn nào</p>
          </div>
        )}
      </main>
    </div>
  );
}
