"use client";

import { useEffect, useState } from "react";
import CtaSection from "./components/cta-section";
import HeroBanner from "./components/hero-banner";
import SearchSection from "./components/search-section";

type Coordinates = {
  lat: number;
  lng: number;
};

export default function HomePage() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<string>("Đang xác định vị trí...");

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
        return;
      }

      if (!window.isSecureContext) {
        setAddress(
          "Trình duyệt chỉ cho phép định vị trên HTTPS hoặc localhost. Hãy chạy app bằng `npm run dev:https`.",
        );
        return;
      }

      try {
        const loc = await getCurrentLocation();
        setLocation(loc);
        setAddress("Đang lấy địa chỉ...");
      } catch (error) {
        console.error("Error fetching location:", error);
        setAddress(getGeolocationErrorMessage(error));
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

  return (
    <>
      <HeroBanner location={location} address={address} />

      <SearchSection />

      {/* <FeaturedFoodsSection

      />

      <NearbyShopsSection

      /> */}

      <CtaSection />
    </>
  );
}
