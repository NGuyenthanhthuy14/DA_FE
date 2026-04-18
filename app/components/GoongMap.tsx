"use client";

import { useEffect, useRef, useState } from "react";
import "@goongmaps/goong-js/dist/goong-js.css";

type Place = {
  id: string;
  name: string;
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
  places: Place[];
}

export default function GoongMap({ places }: GoongMapProps) {
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

        const center: [number, number] =
          places.length > 0
            ? [places[0].lng, places[0].lat]
            : [105.83991, 21.028];

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new goongjs.Map({
            container: mapRef.current,
            style: `https://tiles.goong.io/assets/goong_map_web.json?api_key=${mapKey}`,
            center,
            zoom: 13,
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
                "Goong trả về 403. Hãy kiểm tra lại API key và domain được whitelist trên Goong Console (ví dụ: localhost).",
              );
            }
          });
        } else {
          mapInstanceRef.current.setCenter(center);
        }

        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        places.forEach((place) => {
          const marker = new goongjs.Marker()
            .setLngLat([place.lng, place.lat])
            .setPopup(new goongjs.Popup({ offset: 25 }).setText(place.name))
            .addTo(mapInstanceRef.current) as MarkerInstance;

          markersRef.current.push(marker);
        });
      } catch (error) {
        setMapError(
          "Không tải được bản đồ Goong. Kiểm tra kết nối mạng, API key và cấu hình domain.",
        );
        console.error("GOONG MAP ERROR:", error);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [places]);

  if (mapError) {
    return (
      <div className="flex min-h-90 items-center justify-center rounded-2xl bg-amber-50 p-4 text-center text-sm text-amber-800">
        {mapError}
      </div>
    );
  }

  return <div ref={mapRef} className="h-full w-full min-h-90" />;
}
