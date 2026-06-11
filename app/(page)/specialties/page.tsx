"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import HeroSection from "./components/hero-section";
import SpecialtyGrid from "./components/specialty-grid";
import StorySection from "./components/story-section";
import { useProduct } from "@/app/services/useProduct";
import { useNearbySpecialtyStories } from "@/app/services/useNearbySpecialtyStories";
import type { NearbySpecialtyStory } from "@/app/types/api/specialtyStory";

function StorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[24rem] animate-pulse rounded-2xl border border-amber-100 bg-white"
          />
        ))}
      </div>

      <div className="h-[28rem] animate-pulse rounded-3xl border border-amber-100 bg-white" />
    </div>
  );
}

export default function SpecialtiesPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationMessage, setLocationMessage] = useState("Đang lấy vị trí...");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const detailRef = useRef<HTMLDivElement>(null);
  const { product } = useProduct();

  const requestLocation = useCallback(() => {
    setLocationLoading(true);

    if (!navigator.geolocation) {
      setCoords(null);
      setLocationMessage("Trình duyệt không hỗ trợ định vị.");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationMessage("Vị trí của bạn đã sẵn sàng.");
        setLocationLoading(false);
      },
      (error) => {
        const message =
          error.code === 1
            ? "Bạn đã từ chối quyền truy cập vị trí."
            : error.code === 2
              ? "Không thể lấy vị trí hiện tại."
              : error.code === 3
                ? "Hết thời gian lấy vị trí."
                : "Không thể lấy vị trí hiện tại.";

        setCoords(null);
        setLocationMessage(message);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }, []);

  useEffect(() => {
    const id = window.setTimeout(requestLocation, 0);
    return () => window.clearTimeout(id);
  }, [requestLocation]);

  const {
    stories,
    total,
    loading: storiesLoading,
    error: storyError,
  } = useNearbySpecialtyStories(coords?.lat ?? null, coords?.lng ?? null, undefined, 12);

  const selectedStory = useMemo<NearbySpecialtyStory | null>(() => {
    if (!stories.length) return null;
    return stories.find((story) => story.slug === selectedSlug) ?? stories[0] ?? null;
  }, [stories, selectedSlug]);

  const productHrefBySpecialtyId = useMemo(() => {
    const map = new Map<string, string>();

    for (const item of product?.data ?? []) {
      if (!item.specialty_id || map.has(item.specialty_id)) continue;
      map.set(item.specialty_id, `/products/${item._id}`);
    }

    return map;
  }, [product]);

  const getProductHref = useCallback(
    (story: NearbySpecialtyStory) => {
    const productId =
      story.product_id ||
      (typeof story.product === "string"
        ? story.product
        : story.product?._id || story.product?.id);

      if (productId) return `/products/${productId}`;

      return (
        productHrefBySpecialtyId.get(story.specialty._id) ||
        productHrefBySpecialtyId.get(story.specialty_id) ||
        "/products"
      );
    },
    [productHrefBySpecialtyId],
  );

  const handleReadStory = useCallback((story: NearbySpecialtyStory) => {
    setSelectedSlug(story.slug);
    window.requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      <HeroSection
        storyCount={total}
        loading={locationLoading}
        locationMessage={locationMessage}
        onRefreshLocation={requestLocation}
      />

      <main className="container space-y-8 px-4 py-8 md:px-6">
        {storyError && !storiesLoading ? (
          <div className="rounded-2xl border border-amber-100 bg-white px-5 py-4 text-sm text-gray-600">
            {storyError}
          </div>
        ) : null}

        {storiesLoading ? (
          <StorySkeleton />
        ) : (
          <>
            <SpecialtyGrid
              stories={stories}
              selectedSlug={selectedStory?.slug ?? null}
              loading={storiesLoading}
              total={total}
              getProductHref={getProductHref}
              onReadStory={handleReadStory}
            />

            <div ref={detailRef}>
              <StorySection
                story={selectedStory}
                productHref={selectedStory ? getProductHref(selectedStory) : "/products"}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
