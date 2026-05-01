import Image from "next/image";
import type { Specialty } from "@/app/types/api/specialtyShop";

type Props = {
  item: Specialty;
  index?: number;
};

export default function SpecialCard({ item, index = 0 }: Props) {

  return (
    <div className="group relative w-60 shrink-0 cursor-pointer overflow-hidden rounded-[20px]">
      <div className="relative h-37.5 w-full">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#fff4d8] text-5xl">
            🍜
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        <span className="absolute left-3 top-3 rounded-full bg-[#ffbd1f] px-3 py-1 text-[11px] font-bold text-[#7d330b] shadow">
          Đặc sản
        </span>

        <div className="absolute bottom-0 left-0 right-0 p-3 text-[#ffbd1f]">
          <h3 className="line-clamp-1 text-[16px] font-black leading-tight">
            {item.name}
          </h3>
        </div>
      </div>
    </div>
  );
}