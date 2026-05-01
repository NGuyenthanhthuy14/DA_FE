import React from "react";

interface ProductCardProps {
  name: string;
  image?: string;
  description?: string;
}

export default function ProductCard({
  name,
  image,
  description,
}: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-amber-50">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl">
            🍽️
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-base font-bold text-gray-900 line-clamp-2 min-h-14">
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p className="mt-2 text-xs text-gray-600 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
