"use client";

import Link from "next/link";
import Image from "next/image";
import { productBannerDetail } from "@/app/assets/image/product";
import { BiMapPin, BiLeaf, BiCookie, BiShieldAlt2 } from "react-icons/bi";
import type { Specialty } from "@/app/types/api/specialtyShop";

interface StorySectionProps {
  specialty?: { specialty: Specialty; shopName: string };
}

const FEATURES = [
  { icon: BiMapPin, title: "Nguồn gốc", desc: "Tây Bắc" },
  { icon: BiCookie, title: "Phương pháp", desc: "Gác bếp truyền thống" },
  { icon: BiLeaf, title: "Hương vị", desc: "Đậm đà, thơm ngon" },
  { icon: BiShieldAlt2, title: "Đảm bảo", desc: "Không chất bảo quản" },
];

export default function StorySection({ specialty }: StorySectionProps) {
  const item = specialty?.specialty;
  const title = item?.name || "Thịt trâu gác bếp";
  const desc =
    item?.description ||
    "Được chế biến từ những miếng thịt trâu tươi ngon nhất, ướp gia vị đặc trưng của người vùng cao và hun khói trên bếp củi truyền thống. Thịt trâu gác bếp dai ngon, đậm vị khói, là món ăn không thể thiếu trong những dịp lễ Tết hay đãi khách quý.";

  const image = item?.image_url
  return (
    <section className="overflow-hidden rounded-3xl bg-linear-to-r from-amber-50 via-orange-50/50 to-amber-50">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-5 p-8 lg:p-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
            Câu chuyện đặc sản
          </span>

          <h2 className="text-2xl font-extrabold leading-tight text-[#3a2a1a] lg:text-3xl">
            {title}
            <br />
            <span className="text-primary">– Hương vị đậm chất Việt Nam </span>
          </h2>

          <p className="text-sm leading-relaxed text-[#6b5544]">{desc}</p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex flex-col items-center gap-1.5 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <f.icon className="text-lg text-primary" />
                </div>
                <p className="text-[11px] font-bold text-[#3a2a1a]">{f.title}</p>
                <p className="text-[10px] text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-800"
          >
            Xem sản phẩm từ đặc sản này
          </Link>
        </div>

        <div className="relative h-80 md:h-full">
          {image ? (
            <img
              src={image}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={productBannerDetail}
              alt={title}
              fill
              className="object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
