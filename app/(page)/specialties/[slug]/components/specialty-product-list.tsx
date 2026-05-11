"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BiSearch, BiSortAlt2 } from "react-icons/bi";
import type { SpecialtyProduct } from "@/apiRequest/specialty";
import ProductNearCard from "@/app/components/ui/productNearCard";
import { getDistanceKm, getDistanceToShop } from "@/app/utils/distance";

type SortKey = "newest" | "best_selling" | "price_asc" | "price_desc" | "rating" | "nearest" | "farthest";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "nearest", label: "Gần nhất" },
  { value: "farthest", label: "Xa nhất" },
];

function sortProducts(
  products: SpecialtyProduct[],
  key: SortKey,
  userLat: number | null,
  userLng: number | null
) {
  const arr = [...products];
  switch (key) {
    case "price_asc": return arr.sort((a, b) => a.price - b.price);
    case "price_desc": return arr.sort((a, b) => b.price - a.price);
    case "nearest":
    case "farthest": {
      if (userLat == null || userLng == null) return arr;
      const withDist = arr.map((p) => ({
        product: p,
        dist: (p.shop?.latitude != null && p.shop?.longitude != null)
          ? getDistanceKm(userLat, userLng, p.shop.latitude, p.shop.longitude)
          : Infinity,
      }));
      withDist.sort((a, b) => key === "nearest" ? a.dist - b.dist : b.dist - a.dist);
      return withDist.map((d) => d.product);
    }
    default: return arr;
  }
}

function toProductProps(p: SpecialtyProduct) {
  return {
    _id: p._id,
    name: p.name,
    slug: p.slug,
    image: p.image_url,
    price: p.price,
    rating: p.rating,
    description: p.description,
    discount: p.discount,
    sold: p.sold,
  };
}

interface SpecialtyProductListProps {
  specialtyName: string;
  products: SpecialtyProduct[];
  userLat: number | null;
  userLng: number | null;
}

export default function SpecialtyProductList({
  specialtyName,
  products,
  userLat,
  userLng,
}: SpecialtyProductListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");

  const filteredProducts = useMemo(() => {
    let list = products;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) || (p.shop?.name || "").toLowerCase().includes(q)
      );
    }
    return sortProducts(list, sortKey, userLat, userLng);
  }, [products, searchQuery, sortKey, userLat, userLng]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-dark">
          Sản phẩm {specialtyName}{" "}
          <span className="text-base font-normal text-stone-400">
            ({filteredProducts.length} sản phẩm)
          </span>
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2">
            <BiSearch className="text-lg text-stone-400" />
            <input
              type="text"
              placeholder="Tìm sản phẩm, quán bán..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-44 bg-transparent text-sm outline-none placeholder:text-stone-400"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2">
            <BiSortAlt2 className="text-lg text-stone-400" />
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="bg-transparent text-sm text-dark outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-amber-100 bg-white py-16 text-center">
          <p className="text-4xl">🍃</p>
          <p className="mt-3 text-sm font-semibold text-gray-400">Không tìm thấy sản phẩm nào</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product, i) => {
            const distanceText = getDistanceToShop(
              userLat, userLng,
              product.shop?.latitude, product.shop?.longitude
            );

            return (
              <motion.article
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                className="group overflow-hidden rounded-[28px] border border-amber-200 bg-white shadow-sm transition hover:shadow-xl"
              >
                <ProductNearCard
                  product={toProductProps(product)}
                  storeName={product.shop?.name}
                  distanceText={distanceText}
                />
              </motion.article>
            );
          })}
        </div>
      )}
    </main>
  );
}
