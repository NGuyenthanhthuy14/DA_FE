import { NearbyProduct, Product } from "@/app/types/api/product";
import Link from "next/link";
import React from "react";
import { BiMapPin, BiStar, BiStore } from "react-icons/bi";



function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + "đ";
}

interface ProductNearCardProps {
  product: NearbyProduct | Product;
  storeName?: string;
  storeAddress?: string;
  distanceText?: string;
}

export default function ProductNearCard({
  product,
  storeName,
  storeAddress,
  distanceText,
}: ProductNearCardProps) {
  const img = product.image || ("image_url" in product ? product.image_url : "") || null;
  const discount = product.discount ?? 0;
  const rating = product.rating ?? 0;
  const sold = product.sold ?? 0;
  const hasShop = "shop" in product && product.shop;
  const hasDistance = "distanceKm" in product && product.distanceKm !== undefined;
  const shopName = hasShop ? (product as NearbyProduct).shop.name : storeName;
  const shopAddress = hasShop
    ? (product as NearbyProduct).shop.formatted_address ||
      (product as NearbyProduct).shop.address
    : storeAddress;

  return (
    <Link href={`/products/${product._id}`}>
      <div className="relative overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={product.name}
            className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-44 w-full items-center justify-center bg-amber-50 text-5xl">
            🍽️
          </div>
        )}

        {hasDistance && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow backdrop-blur-sm">
            <BiMapPin className="mr-1 inline-block text-sm" />
            {(product as NearbyProduct).distanceKm} km
          </span>
        )}

        {!hasDistance && distanceText && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow backdrop-blur-sm">
            <BiMapPin className="mr-1 inline-block text-sm" />
            {distanceText}
          </span>
        )}

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
            -{discount}%
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-dark line-clamp-1">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-1 text-sm text-foreground/60 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {discount > 0 && (
            <span className="text-sm text-foreground/40 line-through">
              {formatPrice(
                Math.round(product.price / (1 - discount / 100)),
              )}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-3 text-sm text-stone-600">
          {rating > 0 && (
            <span className="flex items-center gap-1">
              <BiStar className="text-accent" />
              {rating}
            </span>
          )}
          {sold > 0 && <span>Đã bán {sold}</span>}
        </div>

        {(shopName || shopAddress) && (
          <div className="mt-3 space-y-1.5 rounded-xl bg-gray-50 px-3 py-2 text-sm text-stone-600">
            {shopName && (
              <div className="flex items-center gap-2">
                <BiStore className="shrink-0 text-base text-primary" />
                <span className="line-clamp-1">{shopName}</span>
              </div>
            )}

            {shopAddress && (
              <div className="flex items-start gap-2 text-xs text-stone-500">
                <BiMapPin className="mt-0.5 shrink-0 text-sm text-primary" />
                <span className="line-clamp-2">{shopAddress}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
