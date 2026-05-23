"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import Banner from "./components/banner";
import SpecialCard from "./components/specialCard";
import CategoryCard from "./components/categoryCard";
import { getShopBySlug } from "@/apiRequest/shops";
import { getAllProduct } from "@/apiRequest/product";
import { getAllSpecialties, type SpecialtyCatalogItem } from "@/apiRequest/specialty";
import type { Shop } from "@/app/types/api/shops";
import type { Specialty } from "@/app/types/api/specialtyShop";
import type { Product } from "@/app/types/api/product";
import { useShopDetail } from "@/app/services/useShop";
import { useProduct } from "@/app/services/useProduct";
import ProductCard from "@/app/components/ui/productCard";
import { get } from "@/apiRequest/indext";

interface CategoryItem {
  id: string;
  label: string;
  emoji: string;
}

const CATEGORY_EMOJI: Record<string, string> = {
  "Trà Sữa": "🧋",
  "Bánh Kẹo": "🍬",
  "Đồ Ăn Vặt": "🥗",
  "Trà - Cà Phê": "☕",
  "Mứt - Ô Mai": "🍊",
  "Đặc Sản Khô": "🥩",
  "Cơm": "🍚",
  "Bún / Phở": "🍜",
  "Món xào": "🍳",
  "Đồ uống": "🧋",
  "Tráng miệng": "🍰",
};

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
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

export default function StoreDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [allSpecialties, setAllSpecialties] = useState<SpecialtyCatalogItem[]>([]);
  const [allCategories, setAllCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { shopDetail } = useShopDetail(slug);
  const { product } = useProduct();
  const loading = !product || !shopDetail;

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation({ lat: 21.0285, lng: 105.8542 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setUserLocation({ lat: 21.0285, lng: 105.8542 }),
    );
  }, []);

  const productsByShop = useMemo(
    () => product?.data.filter((p) => p.shop_id === shopDetail?._id) || [],
    [product?.data, shopDetail?._id]
  );

  // Lấy tất cả specialties
  useEffect(() => {
    getAllSpecialties()
      .then((res) => {
        setAllSpecialties(res.metadata || []);
      })
      .catch((err) => console.error("Lỗi khi lấy specialties:", err));
  }, []);

  // Lấy tất cả categories
  useEffect(() => {
    get("/categories")
      .then((res: { data?: { _id: string; name: string; slug: string }[] }) => {
        setAllCategories(res?.data || []);
      })
      .catch((err: unknown) => console.error("Lỗi khi lấy categories:", err));
  }, []);

  // Tìm đặc sản cho sản phẩm trong cửa hàng này
  const shopSpecialties: Specialty[] = useMemo(() => {
    if (!productsByShop.length || !allSpecialties.length) return [];

    // Lấy unique specialty_id từ sản phẩm của shop
    const specialtyIds = Array.from(
      new Set(
        productsByShop
          .map((p) => p.specialty_id)
          .filter((id): id is string => !!id)
      )
    );

    // Tìm specialty tương ứng
    return specialtyIds
      .map((specId) => {
        const found = allSpecialties.find((s) => s._id === specId);
        if (!found) return null;
        return {
          idSpecialties: found._id,
          name: found.name,
          slug: found.slug,
          description: found.description || "",
          image_url: found.image_url || "",
          category_id: found.category_id || "",
          is_featured: true,
        };
      })
      .filter((s): s is Specialty => s !== null);
  }, [productsByShop, allSpecialties]);

  // Xây categories từ sản phẩm + dữ liệu categories thật (derived state để tránh render-loop)
  const categories = useMemo(() => {
    if (!shopDetail || !productsByShop.length) return [];

    const uniqueCatIds = Array.from(
      new Set(
        productsByShop
          .map((p) => p.category_id)
          .filter((id): id is string => !!id)
      )
    );

    return [
      { id: "all", label: "Tất cả", emoji: "🍽" },
      ...uniqueCatIds.map((catId) => {
        const catData = allCategories.find((c) => c._id === catId);
        const catName = catData?.name || catId;
        const emoji = CATEGORY_EMOJI[catName] || "🍽";
        return { id: catId, label: catName, emoji };
      }),
    ];
  }, [shopDetail, productsByShop, allCategories]);

  // Lọc sản phẩm theo category
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return productsByShop;
    return productsByShop.filter((p) => p.category_id === activeCategory);
  }, [productsByShop, activeCategory]);

  const shopDistance = useMemo(() => {
    if (!shopDetail || !userLocation) return undefined;
    if (!shopDetail.latitude || !shopDetail.longitude) return undefined;

    return formatDistanceKm(
      haversineKm(
        userLocation.lat,
        userLocation.lng,
        shopDetail.latitude,
        shopDetail.longitude,
      ),
    );
  }, [shopDetail, userLocation]);

  return (
    <>
      <div
        className="pb-20 bg-white min-h-screen relative"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <Banner
          name={shopDetail?.name}
          cuisine={shopDetail?.description || "Ẩm thực truyền thống"}
          area={shopDetail?.formatted_address || shopDetail?.address}
          distance={shopDistance}
          coverImage={shopDetail?.cover_image || undefined}
        />

        <div className="container">
          {/* Đặc sản */}
          {shopSpecialties.length > 0 && (
            <section className="py-8 border-b border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Món <span className="text-amber-700">Đặc Sản</span>
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Những món ăn nổi tiếng nhất của quán
                  </p>
                </div>
                <span className="text-sm text-amber-700 font-semibold cursor-pointer hover:text-amber-800 transition">
                  Xem tất cả →
                </span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
                {shopSpecialties.map((s, index) => (
                  <SpecialCard key={s.idSpecialties} item={s} index={index} />
                ))}
              </div>
            </section>
          )}

          {/* Danh mục */}
          {categories.length > 1 && (
            <div className="py-6 border-b border-gray-100">
              <p className="text-sm text-gray-600 mb-4 font-medium">Danh mục</p>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                {categories.map((cat) => {
                  const active = activeCategory === cat.id;
                  return (
                    <CategoryCard
                      key={cat.id}
                      cat={cat}
                      active={active}
                      onClick={() => setActiveCategory(cat.id)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Thực đơn */}
          <div className="py-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Thực Đơn{" "}
                <span className="text-amber-700 text-lg font-semibold">
                  ({filteredProducts.length})
                </span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Tất cả các món ăn có sẵn hôm nay
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-2xl h-64 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p._id}
                    id={p._id}
                    name={p?.name}
                    image={p?.image_url}
                    description={p?.description}
                    price={p?.price}
                    rating={p?.rating}
                    sold={p?.sold}
                  />
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-gray-400">😢</p>
                <p className="text-gray-500 mt-2">
                  Không có món trong danh mục này
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
