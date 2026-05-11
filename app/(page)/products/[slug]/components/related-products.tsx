"use client";

import { useRef } from "react";
import Link from "next/link";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import type { Product } from "@/app/types/api/product";
import ProductNearCard from "@/app/components/ui/productNearCard";

interface RelatedProductsProps {
  products: Product[];
  shopMap?: Map<string, string>;
}

export default function RelatedProducts({ products, shopMap }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="-mt-20">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Sản phẩm liên quan</h2>
        <Link
          href="/products"
          className="text-sm font-semibold text-primary transition hover:text-amber-800"
        >
          Xem thêm &gt;
        </Link>
      </div>

      {/* Carousel */}
      <div className="relative">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition hover:bg-gray-50"
        >
          <BiChevronLeft className="text-xl text-gray-600" />
        </button>

        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-5 overflow-x-auto scroll-smooth pb-2"
        >
          {products.slice(0, 8).map((product) => {
            const storeName = product.shop_id && shopMap
              ? shopMap.get(product.shop_id)
              : undefined;

            return (
              <div
                key={product._id}
                className="w-56 shrink-0 group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <ProductNearCard product={product} storeName={storeName} />
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition hover:bg-gray-50"
        >
          <BiChevronRight className="text-xl text-gray-600" />
        </button>
      </div>
    </section>
  );
}
