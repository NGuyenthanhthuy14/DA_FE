"use client";

import React, { use, useEffect, useMemo, useState } from "react";
import { getAllSpecialties, type SpecialtyCatalogItem } from "@/apiRequest/specialty";
import type { Product } from "@/app/types/api/product";
import type { Specialty } from "@/app/types/api/specialtyShop";
import ProductCard from "@/app/components/ui/productCard";
import { useProduct } from "@/app/services/useProduct";
import { useShopDetail } from "@/app/services/useShop";
import Banner from "./components/banner";
import SpecialtyFilterCard from "./components/specialtyFilterCard";
import SpecialCard from "./components/specialCard";

interface SpecialtyFilterItem {
  id: string;
  label: string;
  emoji: string;
}

const SPECIALTY_EMOJI: Record<string, string> = {
  "Bánh pía": "🥮",
  "Nem chua": "🥩",
  "Kẹo dừa": "🥥",
  "Bún bò Huế": "🍜",
  "Trà sữa": "🧋",
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

function toSpecialtyShape(item: SpecialtyCatalogItem): Specialty {
  return {
    idSpecialties: item._id,
    name: item.name,
    slug: item.slug,
    description: item.description || "",
    image_url: item.image_url || "",
    approval_status: item.approval_status,
    status: item.status,
    rejected_reason: item.rejected_reason,
    created_by: item.created_by,
    created_by_role: item.created_by_role,
    shop_id: item.shop_id,
    reviewed_by: item.reviewed_by,
    reviewed_at: item.reviewed_at,
    created_at: item.created_at,
    updated_at: item.updated_at,
    is_featured: true,
  };
}

export default function StoreDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [allSpecialties, setAllSpecialties] = useState<SpecialtyCatalogItem[]>([]);
  const [activeSpecialty, setActiveSpecialty] = useState("all");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>({ lat: 21.0285, lng: 105.8542 });

  const { shopDetail } = useShopDetail(slug);
  const { product } = useProduct();
  const loading = !product || !shopDetail;

  useEffect(() => {
    if (!navigator.geolocation) {
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
    [product?.data, shopDetail?._id],
  );

  useEffect(() => {
    getAllSpecialties()
      .then((res) => {
        setAllSpecialties(res.metadata || []);
      })
      .catch((err) => console.error("Lỗi khi lấy specialties:", err));
  }, []);

  const specialtyById = useMemo(
    () => new Map(allSpecialties.map((item) => [item._id, item])),
    [allSpecialties],
  );

  const shopSpecialties: Specialty[] = useMemo(() => {
    if (!productsByShop.length || !allSpecialties.length) return [];

    const specialtyIds = Array.from(
      new Set(
        productsByShop
          .map((p) => p.specialty_id)
          .filter((id): id is string => Boolean(id)),
      ),
    );

    return specialtyIds
      .map((specialtyId) => {
        const found = specialtyById.get(specialtyId);
        return found ? toSpecialtyShape(found) : null;
      })
      .filter((s): s is Specialty => s !== null);
  }, [productsByShop, allSpecialties.length, specialtyById]);

  const specialtyFilters = useMemo<SpecialtyFilterItem[]>(() => {
    if (!shopDetail || !productsByShop.length) return [];

    const uniqueSpecialtyIds = Array.from(
      new Set(
        productsByShop
          .map((p) => p.specialty_id)
          .filter((id): id is string => Boolean(id)),
      ),
    );

    return [
      { id: "all", label: "Tất cả", emoji: "🍽️" },
      ...uniqueSpecialtyIds.map((specialtyId) => {
        const specialty = specialtyById.get(specialtyId);
        const specialtyName = specialty?.name || specialtyId;
        return {
          id: specialtyId,
          label: specialtyName,
          emoji: SPECIALTY_EMOJI[specialtyName] || "🍽️",
        };
      }),
    ];
  }, [shopDetail, productsByShop, specialtyById]);

  const filteredProducts = useMemo(() => {
    if (activeSpecialty === "all") return productsByShop;
    return productsByShop.filter((p) => p.specialty_id === activeSpecialty);
  }, [productsByShop, activeSpecialty]);

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
    <div
      className="relative min-h-screen bg-white pb-20"
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
        {shopSpecialties.length > 0 && (
          <section className="border-b border-gray-100 py-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Món <span className="text-amber-700">Đặc Sản</span>
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Những món ăn nổi tiếng nhất của quán
                </p>
              </div>
            </div>
            <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4">
              {shopSpecialties.map((s, index) => (
                <SpecialCard key={s.idSpecialties} item={s} index={index} />
              ))}
            </div>
          </section>
        )}

        {specialtyFilters.length > 1 && (
          <div className="border-b border-gray-100 py-6">
            <p className="mb-4 text-sm font-medium text-gray-600">Đặc sản</p>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
              {specialtyFilters.map((item) => (
                <SpecialtyFilterCard
                  key={item.id}
                  cat={item}
                  active={activeSpecialty === item.id}
                  onClick={() => setActiveSpecialty(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Thực Đơn{" "}
              <span className="text-lg font-semibold text-amber-700">
                ({filteredProducts.length})
              </span>
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Tất cả các món ăn có sẵn hôm nay
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((p: Product) => (
                <ProductCard
                  key={p._id}
                  id={p._id}
                  name={p.name}
                  image={p.image_url}
                  description={p.description}
                  price={p.price}
                  rating={p.rating}
                  sold={p.sold}
                />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg text-gray-400">:(</p>
              <p className="mt-2 text-gray-500">
                Không có món trong nhóm đặc sản này
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
