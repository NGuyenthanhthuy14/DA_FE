"use client";

import Link from "next/link";
import { BiBookOpen, BiMapPin, BiStore, BiTimeFive } from "react-icons/bi";
import { banner } from "@/app/assets/image/specialties";
import type { NearbySpecialtyStory } from "@/app/types/api/specialtyStory";

interface SpecialtyCardProps {
  story: NearbySpecialtyStory;
  active?: boolean;
  productHref: string;
  onReadStory?: () => void;
}

function formatDistance(distanceKm?: number) {
  if (!Number.isFinite(distanceKm ?? Number.NaN)) return "Gần bạn";
  return `${distanceKm!.toFixed(1)} km`;
}

export default function SpecialtyCard({
  story,
  active = false,
  productHref,
  onReadStory,
}: SpecialtyCardProps) {
  const coverImage =
    story.cover_image_url || story.specialty.image_url || banner.src;
  const tags = story.tags.slice(0, 3);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        active ? "border-primary ring-1 ring-primary/20" : "border-amber-100"
      }`}
    >
      <div className="relative h-44 w-full overflow-hidden bg-amber-50">
        <img
          src={coverImage}
          alt={story.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#4a2d1d] shadow-sm backdrop-blur">
          {formatDistance(story.distanceKm)}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
          <span>{story.specialty.name}</span>
          <span className="text-amber-300">•</span>
          <span className="truncate normal-case tracking-normal text-gray-500">
            {story.shop.name}
          </span>
        </div>

        <h3 className="mt-2 line-clamp-2 text-base font-bold leading-6 text-[#3a2a1a]">
          {story.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
          {story.summary}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <BiMapPin className="text-sm text-primary" />
            {story.shop.formatted_address || story.shop.address}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BiTimeFive className="text-sm text-primary" />
            {story.published_at
              ? new Date(story.published_at).toLocaleDateString("vi-VN")
              : "Mới cập nhật"}
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-4">
          <button
            type="button"
            onClick={onReadStory}
            className="flex items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2 text-sm font-semibold text-[#5a3e2b] transition hover:bg-amber-100"
          >
            <BiBookOpen className="text-base text-primary" />
            Đọc câu chuyện
          </button>

          <Link
            href={productHref}
            className="flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            <BiStore className="text-base" />
            Xem sản phẩm
          </Link>
        </div>
      </div>
    </article>
  );
}
