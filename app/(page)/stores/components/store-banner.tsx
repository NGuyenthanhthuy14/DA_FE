"use client";

import { bannerStore } from "@/app/assets/image/stores";

export default function StoreBanner() {
  return (
    <section
      className="relative w-full h-130 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bannerStore.src})` }}
    />
  );
}
