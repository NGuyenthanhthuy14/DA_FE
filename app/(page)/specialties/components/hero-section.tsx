"use client";

import Link from "next/link";
import { BiBookOpen, BiMapPin, BiRefresh } from "react-icons/bi";
import { banner } from "@/app/assets/image/specialties";

interface HeroSectionProps {
  storyCount: number;
  loading: boolean;
  locationMessage: string;
  onRefreshLocation: () => void;
}

export default function HeroSection({
  storyCount,
  loading,
  locationMessage,
  onRefreshLocation,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#f9efe6]">
      <div className="absolute inset-0">
        <img src={banner.src} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-[#28170f]/80 via-[#3a2417]/55 to-[#28170f]/20" />
      </div>

      <div className="relative mx-auto flex min-h-[30rem] max-w-7xl items-end px-4 py-14 md:px-6 md:py-16">
        <div className="max-w-3xl text-white">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
            <BiBookOpen className="text-base" />
            Câu chuyện đặc sản
          </p>

          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            Những câu chuyện gần bạn, gắn với món ngon của từng vùng đất.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
            Trang này lấy đúng vị trí trình duyệt để tìm các story đã xuất bản
            quanh bạn, thay vì chia theo vùng cố định.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                Số story
              </p>
              <p className="mt-1 text-lg font-bold">{storyCount}</p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                Vị trí
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold leading-6">
                <BiMapPin className="shrink-0 text-base" />
                <span>{loading ? "Đang xác định..." : locationMessage}</span>
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onRefreshLocation}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#4a2d1d] transition hover:bg-amber-50"
            >
              <BiRefresh className="text-lg" />
              Cập nhật vị trí
            </button>

            <Link
              href="#story-list"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <BiBookOpen className="text-lg" />
              Xem danh sách story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
