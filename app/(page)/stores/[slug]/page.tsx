"use client";

import React, { useState, useEffect, use } from "react";
import Banner from "./components/banner";
import SpecialCard from "./components/specialCard";
import CategoryCard from "./components/categoryCard";
import { getShopBySlug } from "@/apiRequest/shops";
import { getShopsWithSpecialties } from "@/apiRequest/specialtyShop";
import { getAllProduct } from "@/apiRequest/product";
import type { Shop } from "@/app/types/api/shops";
import type { Specialty } from "@/app/types/api/specialtyShop";
import type { Product } from "@/app/types/api/product";
import { useShopDetail } from "@/app/services/useShop";
import { useProduct } from "@/app/services/useProduct";
import ProductNearCard from "@/app/components/ui/productNearCard";
import ProductCard from "@/app/components/ui/productCard";

interface CategoryItem {
  id: string;
  label: string;
  emoji: string;
}

const CATEGORY_MAP: Record<string, { label: string; emoji: string }> = {
  "cat-001": { label: "Cơm", emoji: "🍚" },
  "cat-002": { label: "Bún / Phở", emoji: "🍜" },
  "cat-003": { label: "Món xào", emoji: "🍳" },
  "cat-004": { label: "Món ăn vặt", emoji: "🥗" },
  "cat-005": { label: "Đồ uống", emoji: "🧋" },
  "cat-006": { label: "Tráng miệng", emoji: "🍰" },
};

function getCategoryInfo(catId: string) {
  return CATEGORY_MAP[catId] || { label: catId, emoji: "🍽" };
}

export default function StoreDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { shopDetail } = useShopDetail(slug);
  const { product } = useProduct();

  const productsByShop =
    product?.data.filter((p) => p.shop_id === shopDetail?._id) || [];

  console.log("Shop Detail:", productsByShop);
  useEffect(() => {
    async function fetchSpecialties() {
      try {
        const res = await getShopsWithSpecialties();
        if (res.metadata) {
          const currentShop = res.metadata.find((s) => s.slug === slug);
          if (currentShop?.specialties) {
            setSpecialties(currentShop.specialties);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy đặc sản:", error);
      }
    }
    fetchSpecialties();
  }, [slug]);

  useEffect(() => {
    if (!shopDetail) return;

    async function fetchProducts() {
      try {
        setLoading(true);
        const productsRes = await getAllProduct();

        if (productsRes.data) {
          const shopProducts = productsRes.data.filter(
            (p) => p.shop_id === shopDetail?._id,
          );
          setProducts(shopProducts);

          const uniqueCatIds = Array.from(
            new Set(
              shopProducts
                .map((p) => p.category_id)
                .filter((id): id is string => !!id),
            ),
          );

          const cats: CategoryItem[] = [
            { id: "all", label: "Tất cả", emoji: "🍽" },
            ...uniqueCatIds.map((catId) => {
              const info = getCategoryInfo(catId);
              return { id: catId, label: info.label, emoji: info.emoji };
            }),
          ];
          setCategories(cats);
        }
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [shopDetail]);

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
          coverImage={shopDetail?.cover_image || undefined}
        />

        <div className="container">
          {specialties.length > 0 && (
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
                {specialties.map((s, index) => (
                  <SpecialCard key={s.idSpecialties} item={s} index={index} />
                ))}
              </div>
            </section>
          )}

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

          <div className="py-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Thực Đơn{" "}
                <span className="text-amber-700 text-lg font-semibold">
                  ({productsByShop.length})
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
                {productsByShop.map((p) => (
                  <ProductCard
                    key={p._id}
                    name={p?.name}
                    image={p?.image_url}
                    description={p?.description}
                  />
                ))}
              </div>
            )}

            {!loading && productsByShop.length === 0 && (
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
