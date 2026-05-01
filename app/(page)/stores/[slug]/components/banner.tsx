import React, { useState } from "react";
import {
  BiStar,
  BiTime,
  BiMapPin,
  BiUser,
  BiShoppingBag,
} from "react-icons/bi";

interface BannerProps {
  name?: string;
  cuisine?: string;
  area?: string;
  hours?: string;
  rating?: number;
  reviews?: number;
  etaMinutes?: number | string;
  distance?: string;
  coverImage?: string;
  features?: { icon: React.ReactNode; label: string }[];
}

export default function Banner({
  name = "Nhà Hàng Bếp Mẹ Việt",
  cuisine = "Ẩm thực truyền thống",
  area = "Hà Nội",
  hours = "10:00 – 22:30",
  rating = 4.9,
  reviews = 512,
  etaMinutes = 35,
  distance = "1.4 km",
  coverImage = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
  features = [
    { icon: <BiUser className="text-lg" />, label: "Có chỗ ngồi" },
    { icon: <BiShoppingBag className="text-lg" />, label: "Ship toàn quận" },
  ],
}: BannerProps) {
  const [favorited, setFavorited] = useState(false);

  return (
    <div className="relative overflow-hidden bg-primary">
      <div className="container">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('${coverImage}')` }}
        />

        <div className="absolute inset-0 bg-linear-to-r from-stone-900/90 via-stone-900/60 to-transparent" />

        <div className="relative p-5 md:py-15">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-amber-900">
                ● Đang mở cửa
              </span>
              <span className="text-xs text-amber-100">{hours}</span>
            </div>
          </div>

          <div className="mt-4 md:mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-200">
              {cuisine} · {area}
            </p>

            <h1 className="mt-2 text-2xl font-extrabold text-amber-50 md:text-4xl">
              {name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-amber-100">
              <div className="flex items-center gap-2">
                <BiStar className="text-amber-200" />
                <span>
                  <strong className="text-amber-50">{rating}</strong> ({reviews}{" "}
                  đánh giá)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <BiTime />
                <span>
                  Giao trong{" "}
                  <strong className="text-amber-50">{etaMinutes} phút</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <BiMapPin />
                <span>
                  Cách <strong className="text-amber-50">{distance}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-amber-100"
                  >
                    {f.icon}
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>

              <button className="rounded-full bg-amber-300 px-4 py-2 text-sm font-bold text-amber-900">
                Đặt ngay →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
