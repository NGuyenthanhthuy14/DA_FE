"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiFilter, BiChevronDown } from "react-icons/bi";
import type { Product } from "@/app/types/api/product";
import type { DistanceRange } from "./components/sidebar-filter";
import type { Shop } from "@/app/types/api/shops";
import HeroBanner from "./components/hero-banner";
import SidebarFilter from "./components/sidebar-filter";
import Pagination from "./components/pagination";
import ProductNearCard from "@/app/components/ui/productNearCard";
import { useProduct } from "@/app/services/useProduct";
import { useShopAPI } from "@/app/services/useShop";
import { getProductDistance } from "@/app/utils/distance";

const ITEMS_PER_PAGE = 9;

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "bestSelling", label: "Bán chạy" },
  { value: "priceLow", label: "Giá thấp → cao" },
  { value: "priceHigh", label: "Giá cao → thấp" },
  { value: "topRated", label: "Đánh giá cao" },
  { value: "nearest", label: "Gần nhất" },
];

/* ── Haversine distance (km) ── */

function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getMaxKm(range: DistanceRange): number {
  switch (range) {
    case "5km":
      return 5;
    case "10km":
      return 10;
    case "15km":
      return 15;
    case "20km":
      return 20;
    default:
      return Infinity;
  }
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white">
      <div className="h-44 bg-gray-100" />
      <div className="space-y-2.5 p-4">
        <div className="h-4 w-3/4 rounded bg-gray-100" />
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-5 w-1/3 rounded bg-gray-100" />
        <div className="flex justify-between">
          <div className="h-3 w-12 rounded bg-gray-100" />
          <div className="h-3 w-16 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const [activeType, setActiveType] = useState("all");
  const [distanceRange, setDistanceRange] = useState<DistanceRange>("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSort, setShowSort] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // User geolocation
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  const { product } = useProduct();
  const { shop } = useShopAPI();
  const allProducts = product?.data ?? [];
  const allShops = shop?.metadata ?? [];
  const loading = product === null;
  const productTypes = useMemo(
    () => [...new Set(allProducts.map((p) => p.type).filter(Boolean))] as string[],
    [allProducts]
  );

  // Build shopMap: shopId → Shop
  const shopMap = useMemo(
    () => new Map(allShops.map((s) => [s._id, s])),
    [allShops]
  );

  // Build distance map: shopId → distanceKm (from user)
  const shopDistanceMap = useMemo(() => {
    if (userLat === null || userLng === null) return new Map<string, number>();
    const map = new Map<string, number>();
    for (const s of allShops) {
      if (s.latitude && s.longitude) {
        map.set(s._id, getDistanceKm(userLat, userLng, s.latitude, s.longitude));
      }
    }
    return map;
  }, [allShops, userLat, userLng]);

  // Request geolocation on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLat(pos.coords.latitude);
          setUserLng(pos.coords.longitude);
        },
        (err) => console.warn("Geolocation error:", err.message),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setShowSort(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Filter by type
  const filteredByType = useMemo(() => {
    if (activeType === "all") return allProducts;
    return allProducts.filter((p) => p.type === activeType);
  }, [allProducts, activeType]);

  // Filter by distance
  const filteredByDistance = useMemo(() => {
    if (distanceRange === "all") return filteredByType;
    const maxKm = getMaxKm(distanceRange);
    return filteredByType.filter((p) => {
      if (!p.shop_id) return false;
      const dist = shopDistanceMap.get(p.shop_id);
      return dist !== undefined && dist <= maxKm;
    });
  }, [filteredByType, distanceRange, shopDistanceMap]);

  // Sort
  const sortedProducts = useMemo(() => {
    const list = [...filteredByDistance];
    switch (sortBy) {
      case "bestSelling":
        return list.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
      case "priceLow":
        return list.sort((a, b) => a.price - b.price);
      case "priceHigh":
        return list.sort((a, b) => b.price - a.price);
      case "topRated":
        return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case "nearest":
        return list.sort((a, b) => {
          const distA = a.shop_id ? shopDistanceMap.get(a.shop_id) ?? Infinity : Infinity;
          const distB = b.shop_id ? shopDistanceMap.get(b.shop_id) ?? Infinity : Infinity;
          return distA - distB;
        });
      case "newest":
      default:
        return list.reverse();
    }
  }, [filteredByDistance, sortBy, shopDistanceMap]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeType, distanceRange, sortBy]);

  const resetFilters = () => {
    setActiveType("all");
    setDistanceRange("all");
    setSortBy("newest");
  };

  const hasLocation = userLat !== null && userLng !== null;
  const activeLabel = activeType === "all" ? "Tất cả sản phẩm" : activeType;
  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Mới nhất";

  const getDistance = (p: Product) =>
    getProductDistance(p.shop_id, shopDistanceMap, hasLocation);

  return (
    <div className="bg-[#fdf8f3] min-h-screen">
      <HeroBanner />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="flex gap-10">
          <div className="hidden w-52 shrink-0 lg:block">
            <SidebarFilter
              types={productTypes}
              activeType={activeType}
              onTypeChange={setActiveType}
              distanceRange={distanceRange}
              onDistanceRangeChange={setDistanceRange}
              sortBy={sortBy}
              onSortChange={setSortBy}
              hasLocation={hasLocation}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">{activeLabel}</h2>
              <span className="text-sm text-gray-400">
                {sortedProducts.length} sản phẩm
              </span>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
                >
                  <BiFilter className="text-sm" />
                  Bộ lọc
                </button>

                <div ref={sortRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSort((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
                  >
                    {activeSortLabel}
                    <BiChevronDown
                      className={`text-sm transition-transform ${showSort ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {showSort && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-[calc(100%+4px)] z-30 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                      >
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setSortBy(opt.value);
                              setShowSort(false);
                            }}
                            className={`flex w-full px-3 py-2 text-left text-xs transition ${
                              sortBy === opt.value
                                ? "bg-amber-50 font-semibold text-amber-800"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedProducts.map((product, index) => {
                  const productShop = product.shop_id
                    ? shopMap.get(product.shop_id)
                    : undefined;
                  const distanceText = getDistance(product);

                  return (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <ProductNearCard
                        product={product}
                        storeName={productShop?.name}
                        distanceText={distanceText}
                      />
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center">
                <p className="text-5xl">😢</p>
                <p className="mt-3 text-lg font-semibold text-gray-400">
                  Không tìm thấy sản phẩm nào
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-dark"
                >
                  Xem tất cả sản phẩm
                </button>
              </div>
            )}

            {!loading && (
              <Pagination
                current={currentPage}
                total={totalPages}
                onChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}