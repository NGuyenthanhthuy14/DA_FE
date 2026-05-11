"use client";

import Link from "next/link";
import { BiBookOpen, BiStore } from "react-icons/bi";
import type { Specialty } from "@/app/types/api/specialtyShop";

interface SpecialtyCardProps {
  specialty: Specialty;
  shopName?: string;
  onReadStory?: () => void;
  slug: string;
}

export default function SpecialtyCard({ specialty, shopName, onReadStory, slug }: SpecialtyCardProps) {
  return (
    <div className="group flex w-56 shrink-0 flex-col overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-40 w-full overflow-hidden bg-amber-50">
        {specialty.image_url ? (
          <img
            src={specialty.image_url}
            alt={specialty.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">
            🍲
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-bold text-[#3a2a1a] line-clamp-1">
          {specialty.name}
        </h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500 line-clamp-3">
          {specialty.description || "Đặc sản truyền thống với hương vị đậm đà, mang đậm bản sắc vùng miền."}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-3">
          <button
            type="button"
            onClick={onReadStory}
            className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-[11px] font-semibold text-[#5a3e2b] transition hover:bg-amber-100"
          >
            <BiBookOpen className="text-sm text-primary" />
            Đọc câu chuyện
          </button>
          <Link
            href={`/specialties/${slug}`}
            className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-[11px] font-semibold text-primary transition hover:bg-primary/10"
          >
            <BiStore className="text-sm" />
            Xem sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
}
