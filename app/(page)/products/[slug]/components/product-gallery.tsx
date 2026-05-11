"use client";

import { useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface ProductGalleryProps {
  image?: string;
  name: string;
}

export default function ProductGallery({ image, name }: ProductGalleryProps) {
  // Generate thumbnail list (use main image + placeholders for demo)
  const images = image ? [image, image, image, image, image] : [];
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollThumbs = (dir: "left" | "right") => {
    setActiveIndex((prev) => {
      if (dir === "left") return Math.max(0, prev - 1);
      return Math.min(images.length - 1, prev + 1);
    });
  };

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-square w-full h-120 overflow-hidden rounded-2xl bg-amber-50">
        {images.length > 0 ? (
          <img
            src={images[activeIndex]}
            alt={name}
            className="h-full w-full object-cover transition-all duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-7xl">
            🍽️
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollThumbs("left")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50"
          >
            <BiChevronLeft className="text-lg" />
          </button>

          <div className="flex gap-2 overflow-hidden">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  i === activeIndex
                    ? "border-primary ring-1 ring-primary/30"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`${name} ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollThumbs("right")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50"
          >
            <BiChevronRight className="text-lg" />
          </button>
        </div>
      )}
    </div>
  );
}
