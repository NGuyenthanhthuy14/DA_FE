"use client";

import { useEffect, useState } from "react";
import CtaSection from "./components/cta-section";

import HeroBanner from "./components/hero-banner";
import {
  featuredFoods as fallbackSpecialties,
  heroCategories as fallbackCategories,
  nearbyShops as fallbackNearbyShops,
} from "./components/home-data";
import NearbyShopsSection from "./components/nearby-shops-section";
import SearchSection from "./components/search-section";
import {
  buildChatbotSuggestions,
  HomeOverview,
  loadHomeOverview,
} from "./components/home-api";
import FeaturedFoodsSection from "./components/featured-foods-section";

type GeoState = "locating" | "ready" | "denied" | "unsupported" | "error";

type Coordinates = {
  lat: number;
  lng: number;
};

const DEFAULT_COORDINATES: Coordinates = {
  lat: 21.028,
  lng: 105.83991,
};

const DEFAULT_AREA_NAME = "Hà Nội";

function createFallbackOverview(areaName: string | null): HomeOverview {
  return {
    areaName,
    shops: fallbackNearbyShops,
    specialties: fallbackSpecialties,
    categories: fallbackCategories,
    chatbotSuggestions: buildChatbotSuggestions(
      fallbackNearbyShops,
      fallbackSpecialties,
      areaName,
    ),
  };
}

export default function HomePage() {
  const [geoState, setGeoState] = useState<GeoState>("locating");
  const [geoMessage, setGeoMessage] = useState<string | null>(null);
  const [location, setLocation] = useState<Coordinates>(DEFAULT_COORDINATES);
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const [overview, setOverview] = useState<HomeOverview>(() =>
    createFallbackOverview(DEFAULT_AREA_NAME),
  );

  useEffect(() => {
    let isCancelled = false;

    const fetchOverviewByLocation = async (coords: Coordinates) => {
      setIsLoadingOverview(true);
      const data = await loadHomeOverview(coords.lat, coords.lng);
      if (isCancelled) return;
      setOverview(data);
      setIsLoadingOverview(false);
    };

    const loadWithFallback = async (geoErrorMessage?: string) => {
      if (geoErrorMessage) setGeoMessage(geoErrorMessage);
      setLocation(DEFAULT_COORDINATES);
      await fetchOverviewByLocation(DEFAULT_COORDINATES);
    };

    const requestGPS = async () => {
      if (typeof window === "undefined" || !navigator.geolocation) {
        setGeoState("unsupported");
        await loadWithFallback(
          "Trình duyệt không hỗ trợ GPS, đang dùng vị trí mặc định.",
        );
        return;
      }

      setGeoState("locating");

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          if (isCancelled) return;
          setGeoState("ready");
          setGeoMessage(null);
          setLocation(coords);
          await fetchOverviewByLocation(coords);
        },
        async (error) => {
          if (isCancelled) return;

          if (error.code === error.PERMISSION_DENIED) {
            setGeoState("denied");
            await loadWithFallback(
              "Bạn đang tắt quyền vị trí, ứng dụng chuyển sang vị trí mặc định.",
            );
            return;
          }

          setGeoState("error");
          await loadWithFallback(
            "Không lấy được GPS, ứng dụng chuyển sang vị trí mặc định.",
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 60_000,
        },
      );
    };

    requestGPS();

    return () => {
      isCancelled = true;
    };
  }, []);

  const areaLabel =
    overview.areaName ??
    (geoState === "ready"
      ? `Lat ${location.lat.toFixed(4)}, Lng ${location.lng.toFixed(4)}`
      : DEFAULT_AREA_NAME);

  return (
    <>
      <HeroBanner
        categories={overview.categories}
        shops={overview.shops}
        locationLabel={areaLabel}
        geoState={geoState}
        geoMessage={geoMessage}
        isLoading={isLoadingOverview}
      />
      <SearchSection />
      <FeaturedFoodsSection
        specialties={overview.specialties}
        isLoading={isLoadingOverview}
      />
      <NearbyShopsSection
        shops={overview.shops}
        chatbotSuggestions={overview.chatbotSuggestions}
        areaLabel={areaLabel}
        isLoading={isLoadingOverview}
      />
      <CtaSection />
    </>
  );
}
