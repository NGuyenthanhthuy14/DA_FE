"use client";

import Link from "next/link";
import React from "react";
import { BiHeart, BiSolidHeart, BiSolidStar } from "react-icons/bi";

function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + "đ";
}

export interface ProductCardBadge {
  label: string;
  bg: string;
  text: string;
}

interface ProductCardProps {
  id: string,
  name: string;
  image?: string;
  description?: string;
  price?: number;
  rating?: number;
  sold?: number;
  type?: string;
  badge?: ProductCardBadge | null;
  liked?: boolean;
  onToggleLike?: () => void;
}

export default function ProductCard({
  id,
  name,
  image,
  description,
  price,
  rating,
  sold,
  type,
  badge,
  liked,
  onToggleLike,
}: ProductCardProps) {
  const showMeta = price !== undefined || rating !== undefined || sold !== undefined;

  return (
    <Link href={`/products/${id}`}>
      <div className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-amber-50">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl">
            🍽️
          </div>
        )}

        {/* Heart Button */}
        {onToggleLike && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleLike();
            }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition hover:bg-white hover:scale-110"
          >
            {liked ? (
              <BiSolidHeart className="text-lg text-red-500" />
            ) : (
              <BiHeart className="text-lg text-gray-400" />
            )}
          </button>
        )}

        {/* Badge */}
        {badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold shadow ${badge.bg} ${badge.text}`}
          >
            {badge.label}
          </span>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4">
        {/* Type / Region */}
        {type && (
          <p className="text-xs font-semibold text-amber-600">{type}</p>
        )}

        {/* Name */}
        <h3 className="mt-1 text-sm font-bold text-gray-900 line-clamp-2 min-h-[2.5rem] leading-snug">
          {name}
        </h3>

        {/* Description (only when no price/meta available) */}
        {!showMeta && description && (
          <p className="mt-2 text-xs text-gray-600 line-clamp-2">
            {description}
          </p>
        )}

        {/* Price */}
        {price !== undefined && (
          <p className="mt-1.5 text-[15px] font-bold text-amber-700">
            {formatPrice(price)}
          </p>
        )}

        {/* Rating & Sold */}
        {(rating !== undefined || sold !== undefined) && (
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <BiSolidStar className="text-sm text-amber-400" />
              {rating ?? 0}
            </span>
            <span>Đã bán {sold ?? 0}</span>
          </div>
        )}
      </div>
    </div>
    </Link>
  );
}
