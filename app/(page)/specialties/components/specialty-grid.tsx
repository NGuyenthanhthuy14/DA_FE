"use client";

import { BiBookOpen } from "react-icons/bi";
import SpecialtyCard from "./specialty-card";
import type { NearbySpecialtyStory } from "@/app/types/api/specialtyStory";

interface SpecialtyGridProps {
  stories: NearbySpecialtyStory[];
  selectedSlug?: string | null;
  loading?: boolean;
  total: number;
  getProductHref: (story: NearbySpecialtyStory) => string;
  onReadStory?: (story: NearbySpecialtyStory) => void;
}

export default function SpecialtyGrid({
  stories,
  selectedSlug,
  loading = false,
  total,
  getProductHref,
  onReadStory,
}: SpecialtyGridProps) {
  if (!loading && stories.length === 0) {
    return (
      <section className="rounded-2xl border border-amber-100 bg-white py-14 text-center">
        <p className="text-4xl">📖</p>
        <p className="mt-3 text-sm font-semibold text-gray-500">
          Chưa có câu chuyện đặc sản nào gần vị trí của bạn
        </p>
      </section>
    );
  }

  return (
    <section id="story-list" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
            <BiBookOpen className="text-sm" />
            Danh sách story
          </p>
          <h2 className="mt-3 text-2xl font-extrabold text-[#3a2a1a]">
            Câu chuyện đặc sản gần bạn
          </h2>
        </div>

        <p className="text-sm text-gray-500">
          {loading ? "Đang tải..." : `${total} câu chuyện gần bạn`}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stories.map((story) => (
          <SpecialtyCard
            key={story._id}
            story={story}
            active={selectedSlug === story.slug}
            productHref={getProductHref(story)}
            onReadStory={() => onReadStory?.(story)}
          />
        ))}
      </div>
    </section>
  );
}
