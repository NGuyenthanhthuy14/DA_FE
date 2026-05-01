import { useEffect, useState } from "react";
import { GetShopsWithSpecialtiesResponse } from "../types/api/specialtyShop";
import { getShopsWithSpecialties } from "@/apiRequest/specialtyShop";

export const useShopsWithSpecialties = () => {
  const [shopSpecialties, setShopSpecialties] =
    useState<GetShopsWithSpecialtiesResponse>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let lat: number | undefined;
        let lng: number | undefined;

        if (navigator.geolocation) {
          await new Promise<void>((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                lat = pos.coords.latitude;
                lng = pos.coords.longitude;
                resolve();
              },
              () => {
                console.warn("Không lấy được vị trí → fallback");
                resolve();
              }
            );
          });
        }

        const response = await getShopsWithSpecialties({
          lat,
          lng,
        });

        setShopSpecialties(response);
      } catch (err) {
        console.error("Error fetching shops with specialties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { shopSpecialties, loading };
};