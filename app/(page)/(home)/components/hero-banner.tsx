"use client";

import {
  heroCategories as fallbackCategories,
  nearbyShops as fallbackNearbyShops,
  type HeroCategory,
  type NearbyShop,
} from "./home-data";
import CategoryPanel from "./category-panel";
import MapPanel from "./map-panel";

type GeoState = "locating" | "ready" | "denied" | "unsupported" | "error";

interface HeroBannerProps {
  categories?: HeroCategory[];
  shops?: NearbyShop[];
  locationLabel?: string;
  geoState?: GeoState;
  geoMessage?: string | null;
  isLoading?: boolean;
}

export default function HeroBanner({
  categories = [],
  shops = [],
  locationLabel = "Ba Vì, Hà Nội",
}: HeroBannerProps) {
  const safeCategories =
    categories.length > 0 ? categories : fallbackCategories;
  const safeShops = shops.length > 0 ? shops : fallbackNearbyShops;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-yellow-200/30 blur-3xl" />
      </div>

      <div className="relative ">
        <div className="flex">
          <MapPanel shops={safeShops} locationLabel={locationLabel} />
          <CategoryPanel categories={safeCategories} />
        </div>
      </div>
    </section>
  );
}
