"use client";

import { useRef } from "react";
import Link from "next/link";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import SpecialtyCard from "./specialty-card";
import type { Specialty } from "@/app/types/api/specialtyShop";

interface SpecialtyGridProps {
  specialties: { specialty: Specialty; shopName: string }[];
  onReadStory?: (item: { specialty: Specialty; shopName: string }) => void;
}

export default function SpecialtyGrid({ specialties, onReadStory }: SpecialtyGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  if (specialties.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-white py-16 text-center">
        <p className="text-4xl">🍃</p>
        <p className="mt-3 text-sm font-semibold text-gray-400">
          Chưa có đặc sản nào trong danh mục này
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-[#3a2a1a]">
          Đặc sản nổi bật
        </h2>
        <Link
          href="/products"
          className="text-sm font-semibold text-primary transition hover:text-amber-800"
        >
          Xem tất cả →
        </Link>
      </div>

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
          {specialties.map(({ specialty, shopName }) => (
            <SpecialtyCard
              slug={specialty.slug}
              key={specialty.idSpecialties}
              specialty={specialty}
              shopName={shopName}
              onReadStory={() => onReadStory?.({ specialty, shopName })}
            />
          ))}
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
