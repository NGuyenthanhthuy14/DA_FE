"use client";

import { banner } from "@/app/assets/image/specialties";

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden h-[500px] bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${banner.src})` }}
    >

      <div className="relative z-10 container px-16 -top-30">

        <h1 className="text-5xl font-bold text-[#5a2d0c] leading-tight">
          Tinh hoa đặc sản <br />
          trên khắp Việt Nam
        </h1>

        {/* description */}
        <p className="mt-4 text-[#6b4b2a] text-base max-w-xl leading-relaxed">
          Mỗi vùng đất đều có một hương vị riêng. <br />
          Cùng tìm hiểu câu chuyện và khám phá những đặc sản
          làm nên bản sắc quê hương.
        </p>
      </div>
    </section>
  );
}