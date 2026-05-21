"use client";

import { useEffect, useMemo, useState } from "react";
import CtaSection from "./components/cta-section";
import HeroBanner from "./components/hero-banner";
import {
  loadHomeOverview,
  type HomeOverview,
} from "./components/home-api";
import SearchSection from "./components/search-section";
import FeaturedFoodsSection from "./components/featured-foods-section";
import NearbyShopsSection from "./components/nearby-shops-section";
import NearbyProductsSection from "./components/nearby-products-section";
import { useNearbyProducts, useProduct } from "@/app/services/useProduct";
import { useShopAPI } from "@/app/services/useShop";
import type { NearbyProduct, NearbyProductShop } from "@/app/types/api/product";

type Coordinates = {
  lat: number;
  lng: number;
};

export default function HomePage() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<string>("Đang xác định vị trí...");
  const [overview, setOverview] = useState<HomeOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [locationFailed, setLocationFailed] = useState(false);

  // Nearby products (GPS-based)
  const { nearbyProducts, nearbyProductsLoading } = useNearbyProducts(
    location?.lat ?? null,
    location?.lng ?? null,
  );

  // Fallback: tất cả sản phẩm & cửa hàng (không cần GPS)
  const { product: allProductsRes } = useProduct();
  const { shop: allShopsRes } = useShopAPI();

  // Chuyển đổi Product[] thành NearbyProduct[] để dùng chung component
  const allProductsAsNearby: NearbyProduct[] = useMemo(() => {
    const products = allProductsRes?.data ?? [];
    const shops = allShopsRes?.metadata ?? [];

    return products.map((p) => {
      const matchedShop = shops.find((s) => s._id === p.shop_id);
      return {
        _id: p._id,
        name: p.name,
        image: p.image_url || p.image || "",
        type: p.type || "",
        price: p.price,
        rating: p.rating ?? 0,
        description: p.description || "",
        discount: p.discount ?? 0,
        sold: p.sold ?? 0,
        distanceKm: 0,
        shop: {
          _id: matchedShop?._id || p.shop_id || "",
          name: matchedShop?.name || "",
          slug: matchedShop?.slug || "",
          address: matchedShop?.address || "",
          formatted_address: matchedShop?.formatted_address || "",
          cover_image: matchedShop?.cover_image || "",
          latitude: matchedShop?.latitude ?? 0,
          longitude: matchedShop?.longitude ?? 0,
        },
      };
    });
  }, [allProductsRes, allShopsRes]);

  // Dùng nearby nếu có, nếu không dùng tất cả
  const hasNearby = nearbyProducts.length > 0;
  const displayProducts = hasNearby ? nearbyProducts : allProductsAsNearby;
  const isProductsLoading = hasNearby
    ? nearbyProductsLoading
    : !allProductsRes;

  // Lấy danh sách shop từ displayProducts
  const displayShopsFromProducts: NearbyProductShop[] = useMemo(() => {
    const shopMap = new Map<string, NearbyProductShop>();
    for (const product of displayProducts) {
      if (product.shop?._id && !shopMap.has(product.shop._id)) {
        shopMap.set(product.shop._id, product.shop);
      }
    }
    return Array.from(shopMap.values());
  }, [displayProducts]);

  // Nếu không có sản phẩm nào → lấy shops trực tiếp từ API
  const allShopsAsFallback: NearbyProductShop[] = useMemo(() => {
    const shops = allShopsRes?.metadata ?? [];
    return shops.map((s) => ({
      _id: s._id,
      name: s.name,
      slug: s.slug,
      address: s.address,
      formatted_address: s.formatted_address,
      cover_image: s.cover_image,
      latitude: s.latitude,
      longitude: s.longitude,
    }));
  }, [allShopsRes]);

  const displayShops =
    displayShopsFromProducts.length > 0
      ? displayShopsFromProducts
      : allShopsAsFallback;
  const isShopsLoading = !allShopsRes && !hasNearby;

  const getCurrentLocation = () => {
    return new Promise<Coordinates>((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => reject(err),
        {
          enableHighAccuracy: true,
          timeout: 10000,
        },
      );
    });
  };

  const getGeolocationErrorMessage = (error: unknown) => {
    if (typeof window !== "undefined" && !window.isSecureContext) {
      return "Trình duyệt chỉ cho phép định vị trên HTTPS hoặc localhost. Hãy chạy app bằng `npm run dev:https`.";
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof error.code === "number"
    ) {
      switch (error.code) {
        case 1:
          return "Bạn đã từ chối quyền truy cập vị trí. Hãy bật lại quyền Location cho trình duyệt.";
        case 2:
          return "Không thể lấy vị trí hiện tại. Vui lòng kiểm tra GPS hoặc kết nối mạng.";
        case 3:
          return "Hết thời gian lấy vị trí. Vui lòng thử lại.";
        default:
          break;
      }
    }

    return "Không thể lấy vị trí hiện tại.";
  };

  useEffect(() => {
    const fetchLocation = async () => {
      if (!("geolocation" in navigator)) {
        setAddress("Trình duyệt không hỗ trợ định vị.");
        setLocationFailed(true);
        return;
      }

      if (!window.isSecureContext) {
        setAddress(
          "Trình duyệt chỉ cho phép định vị trên HTTPS hoặc localhost. Hãy chạy app bằng `npm run dev:https`.",
        );
        setLocationFailed(true);
        return;
      }

      try {
        const loc = await getCurrentLocation();
        setLocation(loc);
        setAddress("Đang lấy địa chỉ...");
      } catch (error) {
        console.error("Error fetching location:", error);
        setAddress(getGeolocationErrorMessage(error));
        setLocationFailed(true);
      }
    };

    fetchLocation();
  }, []);

  const getFullAddress = async (lat: number, lng: number) => {
    const res = await fetch(
      `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${process.env.NEXT_PUBLIC_GOONG_API_KEY}`
    );
    const data = await res.json();

    return data?.results?.[0]?.formatted_address || "Không xác định";
  };

  useEffect(() => {
    if (location) {
      getFullAddress(location.lat, location.lng)
        .then((addr) => setAddress(addr))
        .catch((err) => {
          console.error("Error fetching address:", err);
          setAddress("Không xác định");
        });
    }
  }, [location]);

  useEffect(() => {
    if (!location) return;

    const controller = new AbortController();

    setOverviewLoading(true);

    void loadHomeOverview(location.lat, location.lng, controller.signal)
      .then((data) => setOverview(data))
      .catch((err) => {
        console.error("Error loading home overview:", err);
        setOverview(null);
      })
      .finally(() => setOverviewLoading(false));

    return () => controller.abort();
  }, [location]);

  return (
    <>
      <HeroBanner location={location} address={address} />

      <SearchSection />

      <FeaturedFoodsSection
        productsNear={displayProducts}
        isLoading={isProductsLoading}
      />

      <NearbyProductsSection
        products={displayProducts}
        isLoading={isProductsLoading}
        isNearby={hasNearby}
      />

      <NearbyShopsSection
        shops={displayShops}
        chatbotSuggestions={overview?.chatbotSuggestions ?? []}
        areaLabel={overview?.areaName ?? "khu vực của bạn"}
        isLoading={isShopsLoading}
      />

      <CtaSection />
    </>
  );
}
