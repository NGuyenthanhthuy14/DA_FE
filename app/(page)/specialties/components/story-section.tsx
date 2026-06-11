"use client";

import Link from "next/link";
import {
  BiBookOpen,
  BiCalendar,
  BiFoodTag,
  BiMapPin,
  BiStore,
  BiTime,
} from "react-icons/bi";
import { banner } from "@/app/assets/image/specialties";
import type { NearbySpecialtyStory } from "@/app/types/api/specialtyStory";

interface StorySectionProps {
  story?: NearbySpecialtyStory | null;
  productHref: string;
}

function formatDistance(distanceKm?: number) {
  if (!Number.isFinite(distanceKm ?? Number.NaN)) return "Chưa rõ khoảng cách";
  return `${distanceKm!.toFixed(1)} km`;
}

export default function StorySection({ story, productHref }: StorySectionProps) {
  if (!story) {
    return (
      <section className="overflow-hidden rounded-3xl border border-amber-100 bg-white">
        <div className="p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
            Câu chuyện đặc sản
          </p>
          <h2 className="mt-3 text-2xl font-extrabold text-[#3a2a1a]">
            Chọn một story để xem chi tiết
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
            Khi danh sách story đã tải xong, hãy bấm “Đọc câu chuyện” ở một thẻ bất kỳ để xem nội dung đầy đủ ở đây.
          </p>
        </div>
      </section>
    );
  }

  const image = story.cover_image_url || story.specialty.image_url || banner.src;
  const publishedDate = story.published_at
    ? new Date(story.published_at).toLocaleDateString("vi-VN")
    : "Mới đăng";
  const tags = story.tags.length > 0 ? story.tags : ["dac-san", "story"];

  return (
    <section
      id="story-detail"
      className="overflow-hidden rounded-3xl border border-amber-100 bg-white"
    >
      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5 p-8 md:p-10 lg:p-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-700">
            Câu chuyện được chọn
          </p>

          <h2 className="text-2xl font-extrabold leading-tight text-[#3a2a1a] lg:text-3xl">
            {story.title}
          </h2>

          <p className="text-sm leading-7 text-gray-600">{story.summary}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-amber-50/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-amber-700">
                Đặc sản
              </p>
              <p className="mt-2 font-semibold text-[#3a2a1a]">
                {story.specialty.name}
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-amber-700">
                Cửa hàng
              </p>
              <p className="mt-2 font-semibold text-[#3a2a1a]">
                {story.shop.name}
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-amber-700">
                Khoảng cách
              </p>
              <p className="mt-2 font-semibold text-[#3a2a1a]">
                {formatDistance(story.distanceKm)}
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-amber-700">
                Ngày đăng
              </p>
              <p className="mt-2 font-semibold text-[#3a2a1a]">
                {publishedDate}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary"
              >
                <BiFoodTag className="text-sm" />
                {tag}
              </span>
            ))}
          </div>

          <div className="rounded-2xl border border-amber-100 bg-[#fcf8f3] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#4a2d1d]">
              <BiBookOpen className="text-base text-primary" />
              Nội dung câu chuyện
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-700">
              {story.content}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={productHref}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800"
            >
              <BiStore className="text-lg" />
              Xem sản phẩm
            </Link>
          </div>
        </div>

        <div className="relative min-h-[22rem] lg:min-h-full">
          <img
            src={image}
            alt={story.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#2b190f]/75 via-[#2b190f]/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 space-y-4 p-6 text-white md:p-8">
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                <BiMapPin className="text-sm" />
                {story.shop.formatted_address || story.shop.address}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                <BiCalendar className="text-sm" />
                {publishedDate}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                <BiTime className="text-sm" />
                {formatDistance(story.distanceKm)}
              </span>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/85">
              {story.specialty.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
