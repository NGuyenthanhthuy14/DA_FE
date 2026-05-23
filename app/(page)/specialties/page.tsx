"use client";

import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import type { Shop as SpecialtyShop, Specialty } from "@/app/types/api/specialtyShop";
import { getShopsWithSpecialties } from "@/apiRequest/specialtyShop";

import HeroSection from "./components/hero-section";
import SpecialtyGrid from "./components/specialty-grid";
import StorySection from "./components/story-section";
import TrustBadges from "../products/[slug]/components/trust-badges";
import { getRegionFromAddress, type Region } from "@/app/utils/regionMap";

function SpecialtySkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-72 animate-pulse rounded-3xl bg-gray-100" />

      <div className="flex gap-5 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-72 w-56 shrink-0 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

export default function SpecialtiesPage() {
  const [shops, setShops] = useState<SpecialtyShop[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSpecialty, setSelectedSpecialty] = useState<
    { specialty: Specialty; shopName: string; region: Region | null } | undefined
  >(undefined);

  const [shopRegions, setShopRegions] = useState<Record<string, Region | null>>({});

  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getShopsWithSpecialties();
        setShops(res.metadata || []);
      } catch (err) {
        console.error("Error fetching specialties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!shops.length) return;
    let cancelled = false;

    Promise.all(
      shops.map(async (shop) => {
        const address = shop.formatted_address || shop.address || "";
        const region = await getRegionFromAddress(address);
        console.log(`[Region] "${address}" → ${region}`);
        return { id: shop.idShop, region };
      })
    ).then((results) => {
      if (cancelled) return;
      const map: Record<string, Region | null> = {};
      for (const r of results) map[r.id] = r.region;
      setShopRegions(map);
    });

    return () => { cancelled = true; };
  }, [shops]);


  const allSpecialties = useMemo(() => { 
    const seen = new Map<string, { specialty: Specialty; shopName: string; region: Region | null }>();
    for (const shop of shops) {
      if (!shop.specialties?.length) continue;
      const region = shopRegions[shop.idShop] ?? null;
      for (const spec of shop.specialties) {
        if (!seen.has(spec.idSpecialties)) {
          seen.set(spec.idSpecialties, { specialty: spec, shopName: shop.name, region });
        }
      }
    }
    return Array.from(seen.values());
  }, [shops, shopRegions]);

  const handleReadStory = useCallback(
    (item: { specialty: Specialty; shopName: string }) => {
      setSelectedSpecialty(item as typeof selectedSpecialty);
      setTimeout(() => {
        window.scrollBy({ top: 500, behavior: "smooth" });
      }, 100);
    },
    []
  );

  const displayedSpecialty = selectedSpecialty || allSpecialties[0] || undefined;
 


  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      <HeroSection />
      <main className="container space-y-8 px-4 py-8 md:px-6">
        {loading ? (
          <SpecialtySkeleton />
        ) : (
          <>
            <SpecialtyGrid
              specialties={allSpecialties}
              onReadStory={handleReadStory}
            />

            <div ref={storyRef}>
              <StorySection specialty={displayedSpecialty} />
            </div>

            <TrustBadges />
          </>
        )}
      </main>
    </div>
  );
}
