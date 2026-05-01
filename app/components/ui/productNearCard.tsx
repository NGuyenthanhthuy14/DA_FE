import { NearbyProduct } from "@/app/types/api/product";
import React from "react";
import { BiMapPin, BiStar, BiStore } from "react-icons/bi";



function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + "đ";
}

interface ProductNearCardProps {
  product: NearbyProduct;
}

export default function ProductNearCard({ product }: ProductNearCardProps) {
  return (
    <div>
      <div className="relative overflow-hidden">
        <img
          src={
            product.image
          }
          alt={product.name}
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow backdrop-blur-sm">
          <BiMapPin className="mr-1 inline-block text-sm" />
          {product.distanceKm} km
        </span>

        {product.discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
            -{product.discount}%
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
          {product.discount > 0 && (
            <span className="text-sm text-foreground/40 line-through">
              {formatPrice(
                Math.round(product.price / (1 - product.discount / 100)),
              )}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-3 text-sm text-stone-600">
          {product.rating > 0 && (
            <span className="flex items-center gap-1">
              <BiStar className="text-accent" />
              {product.rating}
            </span>
          )}
          {product.sold > 0 && <span>Đã bán {product.sold}</span>}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm text-stone-600">
          <BiStore className="text-base text-primary" />
          <span className="line-clamp-1">{product.shop.name}</span>
        </div>
      </div>
    </div>
  );
}
