"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchAll, searchShops } from "@/apiRequest/search";
import type { Product } from "@/app/types/api/product";
import type { SearchAllData, SearchShopsData } from "@/app/types/api/search";
import type { Shop } from "@/app/types/api/shops";
import ProductNearCard from "@/app/components/ui/productNearCard";
import StoreCard from "../stores/components/store-card";
import Pagination from "../products/components/pagination";

const SHOP_LIMIT = 2;
const SHOP_ONLY_LIMIT = 10;
const PRODUCT_LIMIT = 10;
const SEARCH_TYPES = {
  all: "all",
  shops: "shops",
} as const;

function SearchSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-44 animate-pulse rounded-2xl border border-amber-100 bg-white"
        />
      ))}
    </div>
  );
}

function getProductShop(product: Product) {
  const productWithShop = product as Product & {
    shop?: Pick<Shop, "_id" | "name" | "slug" | "address" | "formatted_address">;
  };

  return productWithShop.shop;
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = (searchParams.get("keyword") || "").trim();
  const searchType =
    searchParams.get("type") === SEARCH_TYPES.shops
      ? SEARCH_TYPES.shops
      : SEARCH_TYPES.all;
  const isShopOnly = searchType === SEARCH_TYPES.shops;
  const shopPage = Math.max(Number(searchParams.get("shopPage") || 1), 1);
  const productPage = Math.max(Number(searchParams.get("productPage") || 1), 1);
  const [data, setData] = useState<SearchAllData | SearchShopsData | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!keyword) {
      setData(null);
      setError(null);
      return;
    }

    let ignore = false;

    async function fetchSearchResults() {
      setLoading(true);
      setError(null);

      try {
        const res = isShopOnly
          ? await searchShops({
              keyword,
              page: shopPage,
              limit: SHOP_ONLY_LIMIT,
            })
          : await searchAll({
              keyword,
              shopLimit: SHOP_LIMIT,
              shopPage,
              productLimit: PRODUCT_LIMIT,
              productPage,
            });

        if (ignore) return;

        if (res.err !== 0 || !res.data) {
          throw new Error(res.mess || "Không thể tìm kiếm");
        }

        setData(res.data);
      } catch (searchError: unknown) {
        if (!ignore) {
          setData(null);
          setError(
            searchError instanceof Error
              ? searchError.message
              : "Không thể tìm kiếm",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchSearchResults();

    return () => {
      ignore = true;
    };
  }, [isShopOnly, keyword, productPage, shopPage]);

  const products =
    data && "products" in data && !isShopOnly ? data.products.data : [];
  const shops = data?.shops.data ?? [];
  const productTotalPages =
    data && "products" in data && !isShopOnly ? data.products.totalPage : 1;
  const shopTotalPages = data?.shops.totalPage || 1;

  const updatePage = (next: { shopPage?: number; productPage?: number }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("keyword", keyword);
    if (isShopOnly) params.set("type", SEARCH_TYPES.shops);

    if (next.shopPage) params.set("shopPage", String(next.shopPage));
    if (next.productPage) params.set("productPage", String(next.productPage));

    router.push(`/search?${params.toString()}`);
  };

  const updateSearchType = (
    nextType: (typeof SEARCH_TYPES)[keyof typeof SEARCH_TYPES],
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("keyword", keyword);
    params.set("shopPage", "1");
    params.delete("productPage");

    if (nextType === SEARCH_TYPES.shops) {
      params.set("type", SEARCH_TYPES.shops);
    } else {
      params.delete("type");
    }

    router.push(`/search?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#fdf8f3] px-4 py-8 md:px-6">
      <div className="mx-auto max-w-7xl">
        {!keyword ? (
          <div className="rounded-2xl border border-amber-100 bg-white py-20 text-center">
            <p className="mt-3 text-sm font-medium text-stone-400">
              Nhập từ khoá để tìm shop hoặc sản phẩm.
            </p>
          </div>
        ) : loading ? (
          <SearchSkeleton />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 py-12 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => updateSearchType(SEARCH_TYPES.all)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  !isShopOnly
                    ? "bg-primary text-white shadow-sm"
                    : "border border-amber-200 bg-white text-stone-600 hover:border-primary hover:text-primary"
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => updateSearchType(SEARCH_TYPES.shops)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  isShopOnly
                    ? "bg-primary text-white shadow-sm"
                    : "border border-amber-200 bg-white text-stone-600 hover:border-primary hover:text-primary"
                }`}
              >
                Shop
              </button>
            </div>

            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="m-0 text-xl font-extrabold text-stone-900">
                    Shop phù hợp
                  </h2>
                  <p className="m-0 mt-1 text-sm text-stone-500">
                    {data?.shops.total ?? 0} shop
                  </p>
                </div>
              </div>

              {shops.length > 0 ? (
                <>
                  <div className="grid gap-5 md:grid-cols-2">
                    {shops.map((shop, index) => (
                      <StoreCard
                        key={shop._id}
                        id={shop._id}
                        slug={shop.slug}
                        name={shop.name}
                        image={shop.cover_image}
                        description={shop.description}
                        address={shop.formatted_address || shop.address}
                        rating={4.8 - (index % 3) * 0.1}
                        reviewCount={1200 + index * 240}
                      />
                    ))}
                  </div>
                  <Pagination
                    current={shopPage}
                    total={shopTotalPages}
                    onChange={(page) => updatePage({ shopPage: page })}
                  />
                </>
              ) : (
                <div className="rounded-2xl border border-amber-100 bg-white py-10 text-center text-sm text-stone-400">
                  Không tìm thấy shop phù hợp.
                </div>
              )}
            </section>

            {!isShopOnly && (
              <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="m-0 text-xl font-extrabold text-stone-900">
                    Sản phẩm phù hợp
                  </h2>
                  <p className="m-0 mt-1 text-sm text-stone-500">
                    {data && "products" in data ? data.products.total : 0} sản phẩm
                  </p>
                </div>
              </div>

              {products.length > 0 ? (
                <>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {products.map((product) => {
                      const shop = getProductShop(product);
                      return (
                        <div
                          key={product._id}
                          className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                          <ProductNearCard
                            product={product}
                            storeName={shop?.name}
                            storeAddress={shop?.formatted_address || shop?.address}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <Pagination
                    current={productPage}
                    total={productTotalPages}
                    onChange={(page) => updatePage({ productPage: page })}
                  />
                </>
              ) : (
                <div className="rounded-2xl border border-amber-100 bg-white py-10 text-center text-sm text-stone-400">
                  Không tìm thấy sản phẩm phù hợp.
                </div>
              )}
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fdf8f3] px-4 py-8 md:px-6">
          <div className="mx-auto max-w-7xl">
            <SearchSkeleton />
          </div>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
