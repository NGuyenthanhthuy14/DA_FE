"use client";

import React from "react";
import { BiHeart, BiSolidStar } from "react-icons/bi";
import { HiLocationMarker } from "react-icons/hi";
import Link from "next/link";

export interface StoreCardBadge {
  label: string;
  color: string;
  bg: string;
}

export interface StoreCardSpecialty {
  idSpecialties: string;
  name: string;
  image_url?: string;
}

export interface StoreCardProps {
  id: string;
  slug: string;
  name: string;
  image?: string;
  description?: string;
  address?: string;
  rating?: number;
  reviewCount?: number;
  distance?: string;
  badge?: StoreCardBadge | null;
  tags?: string[];
  specialties?: StoreCardSpecialty[];
  liked?: boolean;
  onToggleLike?: () => void;
}

export default function StoreCard({
  id,
  slug,
  name,
  image,
  description,
  address,
  rating,
  reviewCount,
  distance,
  badge,
  tags,
  specialties,
  liked,
  onToggleLike,
}: StoreCardProps) {
  return (
    <Link
      href={`/stores/${slug}`}
      className="group flex rounded-2xl bg-white overflow-hidden no-underline text-inherit shadow-[0_1px_8px_rgba(120,53,15,0.06)] border border-[rgba(232,221,212,0.5)] transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:shadow-[0_8px_28px_rgba(120,53,15,0.12)] hover:-translate-y-0.5 hover:border-[#e8ddd4]"
      id={`store-card-${id}`}
    >
      {/* Image */}
      <div className="relative w-[200px] min-w-[200px] min-h-[180px] overflow-hidden shrink-0 max-sm:w-full max-sm:min-w-full max-sm:min-h-[160px] max-sm:max-h-[180px]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-primary-soft">
            🍽️
          </div>
        )}

        {/* Badge */}
        {badge && (
          <span
            className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[0.68rem] font-bold tracking-wide uppercase z-[2] leading-snug"
            style={{ background: badge.bg, color: badge.color }}
          >
            {badge.label}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 px-4 py-3.5 flex flex-col justify-center gap-1">
        {/* Header: name + like */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="m-0 text-[1.05rem] font-bold text-[#1a1a1a] leading-snug line-clamp-2">
            {name}
          </h3>
          <button
            type="button"
            className="shrink-0 bg-transparent border-none cursor-pointer p-1 text-[#b8a99a] text-[1.35rem] transition-all duration-200 leading-none hover:text-red-500 hover:scale-[1.15]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleLike?.();
            }}
          >
            <BiHeart className={liked ? "text-red-500" : ""} />
          </button>
        </div>

        {/* Description */}
        {description && (
          <p className="m-0 text-[0.82rem] text-[#8b7a6b] leading-snug line-clamp-1">
            {description}
          </p>
        )}

        {/* Address */}
        {address && (
          <p className="m-0 flex items-start gap-1 text-[0.78rem] text-[#8b7a6b] leading-snug">
            <HiLocationMarker className="text-red-500 text-[0.85rem] shrink-0 mt-px" />
            <span>{address}</span>
          </p>
        )}

        {/* Rating & Distance */}
        {(rating !== undefined || distance) && (
          <div className="flex items-center gap-1.5 text-[0.78rem] text-[#6b4b2a] flex-wrap">
            {rating !== undefined && (
              <span className="inline-flex items-center gap-0.5">
                <BiSolidStar className="text-amber-400 text-[0.85rem]" />
                <strong>{rating}</strong>
                {reviewCount !== undefined && (
                  <span className="text-[#8b7a6b] font-normal">
                    ({reviewCount > 1000 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount} đánh giá)
                  </span>
                )}
              </span>
            )}
            {distance && (
              <>
                <span className="text-gray-300 text-[0.65rem]">•</span>
                <span className="text-[#8b7a6b]">{distance}</span>
              </>
            )}
          </div>
        )}

        {/* Đặc sản */}
        {specialties && specialties.length > 0 && (
          <div className="mt-1">
            <p className="m-0 text-[0.7rem] font-semibold text-amber-700 uppercase tracking-wider mb-1">
              🍲 Đặc sản
            </p>
            <div className="flex flex-wrap gap-1.5">
              {specialties.slice(0, 3).map((spec) => (
                <span
                  key={spec.idSpecialties}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.72rem] font-medium text-amber-800 bg-amber-50 border border-amber-200 leading-snug whitespace-nowrap"
                >
                  {spec.image_url && (
                    <img
                      src={spec.image_url}
                      alt={spec.name}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                  )}
                  {spec.name}
                </span>
              ))}
              {specialties.length > 3 && (
                <span className="inline-block px-2 py-0.5 rounded-full text-[0.72rem] text-amber-600 bg-amber-50 border border-amber-200 leading-snug">
                  +{specialties.length - 3} món
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2.5 py-0.5 rounded-full border border-[#e8ddd4] text-[0.72rem] text-[#6b4b2a] bg-[#fdf8f3] leading-snug whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
