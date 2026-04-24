"use client";

import { useEffect, useRef, useState } from "react";
import "@goongmaps/goong-js/dist/goong-js.css";
import { Shop } from "../types/api/shops";

type Coordinates = {
  lat: number;
  lng: number;
};

type MapEvent = {
  error?: {
    status?: number;
  };
  status?: number;
};

type MapInstance = {
  addControl: (...args: unknown[]) => void;
  on: (event: string, handler: (event: MapEvent) => void) => void;
  setCenter: (center: [number, number]) => void;
  remove: () => void;
};

type MarkerInstance = {
  remove: () => void;
};

interface GoongMapProps {
  location: Coordinates;
  shops: Shop[];
}

const POPUP_FALLBACK_IMAGE = "https://via.placeholder.com/320x160?text=Quan+an";

const escapeHtml = (value?: string | null) => {
  if (!value) return "";

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const getSafeImageUrl = (url?: string) => {
  const imageUrl = url?.trim();
  if (!imageUrl) return POPUP_FALLBACK_IMAGE;

  return encodeURI(imageUrl);
};

const renderShopPopup = (shop: Shop) => {
  const name = escapeHtml(shop.name || "Quán ăn địa phương");
  const address = escapeHtml(
    shop.address || shop.formatted_address || "Chưa có địa chỉ",
  );
  const description = escapeHtml(shop.description);
  const phone = escapeHtml(shop.phone);
  const slug = shop.slug?.trim() ? encodeURIComponent(shop.slug) : "";
  const shopUrl = slug ? `/shops/${slug}` : "/shops";
  const isActive = shop.status === "active";
  const statusLabel = isActive ? "Đang phục vụ" : "Tạm ngưng";

  return `
    <div class="shop-map-popup-card">
      <div class="shop-map-popup-card__media">
        <img
          src="${getSafeImageUrl(shop.cover_image)}"
          alt="${name}"
          class="shop-map-popup-card__image"
        />
        <span class="shop-map-popup-card__status ${isActive ? "is-active" : "is-inactive"}">
          ${statusLabel}
        </span>
      </div>

      <div class="shop-map-popup-card__body">
        <h3 class="shop-map-popup-card__name">${name}</h3>
        <p class="shop-map-popup-card__address">📍 ${address}</p>

        ${
          description
            ? `<p class="shop-map-popup-card__description">${description}</p>`
            : ""
        }

        <div class="shop-map-popup-card__footer">
          <p class="shop-map-popup-card__phone">
            ${phone ? `📞 ${phone}` : "Thông tin liên hệ"}
          </p>

          <a
            href="${shopUrl}"
            class="shop-map-popup-card__cta"
            aria-label="Xem chi tiết quán ${name}"
          >
            <span>Xem quán</span>
            <span class="shop-map-popup-card__cta-icon" aria-hidden="true">
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </div>
  `;
};

export default function GoongMap({ location, shops = [] }: GoongMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<MapInstance | null>(null);
  const markersRef = useRef<MarkerInstance[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      try {
        if (!mapRef.current || typeof window === "undefined") return;

        const mapKey = process.env.NEXT_PUBLIC_GOONG_MAP_KEY;
        if (!mapKey) {
          const missingKeyMsg =
            "Thiếu NEXT_PUBLIC_GOONG_MAP_KEY. Vui lòng cấu hình key bản đồ trong .env.local";
          setMapError(missingKeyMsg);
          console.error(missingKeyMsg);
          return;
        }

        setMapError(null);

        const goongModule = await import("@goongmaps/goong-js");
        const goongjs = goongModule.default;

        if (!isMounted || !mapRef.current) return;

        goongjs.accessToken = mapKey;

        const center: [number, number] = [location.lng, location.lat];

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new goongjs.Map({
            container: mapRef.current,
            style: `https://tiles.goong.io/assets/goong_map_web.json?api_key=${mapKey}`,
            center,
            zoom: 15,
            transformRequest: (url: string) => {
              if (url.includes("tiles.goong.io") && !url.includes("api_key=")) {
                const separator = url.includes("?") ? "&" : "?";
                return { url: `${url}${separator}api_key=${mapKey}` };
              }
              return { url };
            },
          }) as MapInstance;

          mapInstanceRef.current.addControl(
            new goongjs.NavigationControl(),
            "top-right",
          );

          mapInstanceRef.current.on("error", (event: MapEvent) => {
            const status = event?.error?.status || event?.status;
            if (status === 403) {
              setMapError(
                "Goong trả về 403. Hãy kiểm tra lại API key và domain được whitelist trên Goong Console.",
              );
            }
          });
        } else {
          mapInstanceRef.current.setCenter(center);
        }

        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        const userMarker = new goongjs.Marker({ color: "red" })
          .setLngLat([location.lng, location.lat])
          .setPopup(new goongjs.Popup({ offset: 25 }).setText("Bạn đang ở đây"))
          .addTo(mapInstanceRef.current) as MarkerInstance;

        markersRef.current.push(userMarker);

        shops.forEach((shop) => {
          if (!shop.latitude || !shop.longitude) return;

          const shopMarker = new goongjs.Marker({ color: "#0077B6" })
            .setLngLat([shop.longitude, shop.latitude])
            .setPopup(
              new goongjs.Popup({
                offset: 28,
                closeButton: true,
                closeOnClick: true,
                maxWidth: "300px",
                className: "shop-map-popup",
              }).setHTML(renderShopPopup(shop)),
            )
            .addTo(mapInstanceRef.current) as MarkerInstance;

          markersRef.current.push(shopMarker);
        });
      } catch (error) {
        setMapError(
          "Không tải được bản đồ Goong. Kiểm tra kết nối mạng, API key và cấu hình domain.",
        );
        console.error("GOONG MAP ERROR:", error);
      }
    };

    void initMap();

    return () => {
      isMounted = false;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location, shops]);

  if (mapError) {
    return (
      <div className="flex min-h-90 items-center justify-center rounded-2xl bg-amber-50 p-4 text-center text-sm text-amber-800">
        {mapError}
      </div>
    );
  }

  return <div ref={mapRef} className="h-full w-full min-h-90" />;
}
