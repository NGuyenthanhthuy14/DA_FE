"use client";

import CategoryPanel from "./category-panel";
import MapPanel from "./map-panel";

type Coordinates = {
  lat: number;
  lng: number;
};

export default function HeroBanner({
  location,
  address,
}: {
  location: Coordinates | null;
  address: string;
}) {

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-yellow-200/30 blur-3xl" />
      </div>

      <div className="relative ">
        <div className="flex">
          <MapPanel location={location} address={address} />
          {/* <CategoryPanel categories={safeCategories} /> */}
        </div>
      </div>
    </section>
  );
}
