"use client";

import { use } from "react";
import { useProductDetail, useProduct } from "@/app/services/useProduct";
import { useShopAPI } from "@/app/services/useShop";
import Breadcrumb from "./components/breadcrumb";
import ProductGallery from "./components/product-gallery";
import ProductInfo from "./components/product-info";
import ProductTabs from "./components/product-tabs";
import RelatedProducts from "./components/related-products";
import TrustBadges from "./components/trust-badges";
import StoreBar from "./components/store-bar";

/* ── Loading Skeleton ── */

function DetailSkeleton() {
  return (
    <div className="container px-4 py-6 md:px-6">
      <div className="h-4 w-60 rounded bg-gray-100 mb-6" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="animate-pulse space-y-3">
          <div className="aspect-square rounded-2xl bg-gray-100" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 w-16 rounded-lg bg-gray-100" />
            ))}
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 rounded bg-gray-100" />
          <div className="h-8 w-3/4 rounded bg-gray-100" />
          <div className="h-4 w-48 rounded bg-gray-100" />
          <div className="h-10 w-40 rounded bg-gray-100" />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-gray-100" />
            ))}
          </div>
          <div className="h-10 w-48 rounded bg-gray-100" />
          <div className="h-12 w-full rounded-xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { productDetail, loading } = useProductDetail(slug);
  const { product: allProductsRes } = useProduct();
  const { shop: shopRes } = useShopAPI();

  const allProducts = allProductsRes?.data ?? [];
  const allShops = shopRes?.metadata ?? [];

  // Find the shop that owns this product
  const productShop = productDetail?.shop_id
    ? allShops.find((s) => s._id === productDetail.shop_id)
    : undefined;

  // Build a shopMap for related products
  const shopMap = new Map(allShops.map((s) => [s._id, s.name]));

  // Get related products (same type, exclude current)
  const relatedProducts = allProducts.filter(
    (p) =>
      p._id !== slug && (productDetail ? p.type === productDetail.type : true),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf8f3]">
        <DetailSkeleton />
      </div>
    );
  }

  if (!productDetail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdf8f3]">
        <div className="text-center">
          <p className="text-5xl">😢</p>
          <p className="mt-4 text-lg font-semibold text-gray-500">
            Không tìm thấy sản phẩm
          </p>
        </div>
      </div>
    );
  }

  const img = productDetail.image_url || productDetail.image || "";
  const reviews = productDetail.reviews ?? [];
  const reviewCount =
    productDetail.reviewCount ?? productDetail.ratingSummary?.total ?? reviews.length;
  const averageRating =
    productDetail.ratingSummary?.averageRating ?? productDetail.rating ?? 0;

  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      <main className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          productName={productDetail.name}
          productType={productDetail.type}
        />

        {/* Top Section: Gallery + Info */}
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery image={img} name={productDetail.name} />

          <ProductInfo
            productId={productDetail._id}
            name={productDetail.name}
            slug={productDetail.slug || slug}
            image={img}
            type={productDetail.type}
            price={productDetail.price}
            rating={averageRating}
            reviewCount={reviewCount}
            sold={productDetail.sold}
            discount={productDetail.discount}
            countInStock={productDetail.countInStock}
            shopId={productShop?._id || productDetail.shop_id || ""}
            shopName={productShop?.name || ""}
          />
        </div>

        {productShop && <StoreBar shop={productShop} />}

        {/* Tabs Section */}
        <ProductTabs
          description={productDetail.description}
          rating={averageRating}
          reviewCount={reviewCount}
          ratingSummary={productDetail.ratingSummary}
          reviews={reviews}
        />

        {/* Related Products (with store names) */}
        <RelatedProducts products={relatedProducts} shopMap={shopMap} />

        {/* Trust Badges */}
        <TrustBadges />

        <div className="h-8" />
      </main>
    </div>
  );
}
