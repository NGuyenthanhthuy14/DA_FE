import { useEffect, useState } from "react";
import {
  GetShopsWithSpecialtiesResponse,
  NearbySpecialty,
  Shop as SpecialtyShop,
} from "../types/api/specialtyShop";
import { getNearbySpecialties } from "@/apiRequest/specialtyShop";

const nearbySpecialtiesRequests = new Map<
  string,
  Promise<GetShopsWithSpecialtiesResponse>
>();
const nearbySpecialtiesCache = new Map<string, GetShopsWithSpecialtiesResponse>();

const toPlainString = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (
    typeof value === "object" &&
    value !== null &&
    "toString" in value &&
    typeof value.toString === "function"
  ) {
    return value.toString().trim();
  }
  return "";
};

const toSafeNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const buildFallbackSlug = (name: string, id: string): string => {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || `specialty-${id}`;
};

const mapNearbySpecialtiesToShopShape = (
  nearbySpecialties: NearbySpecialty[],
): SpecialtyShop[] => {
  const shopsById = new Map<string, SpecialtyShop>();

  for (const item of nearbySpecialties) {
    const shop = item.shop;
    const shopId = toPlainString(shop?._id);
    const specialtyId = toPlainString(item._id);
    const specialtyName = toPlainString(item.name);

    if (!shopId || !specialtyId || !specialtyName) continue;

    if (!shopsById.has(shopId)) {
      shopsById.set(shopId, {
        idShop: shopId,
        name: toPlainString(shop.name),
        slug: toPlainString(shop.slug),
        phone: "",
        cover_image: toPlainString(shop.cover_image),
        latitude: toSafeNumber(shop.latitude),
        longitude: toSafeNumber(shop.longitude),
        address: toPlainString(shop.address),
        formatted_address: toPlainString(shop.formatted_address),
        status: "active",
        specialties: [],
      });
    }

    shopsById.get(shopId)?.specialties.push({
      idSpecialties: specialtyId,
      name: specialtyName,
      slug:
        toPlainString(item.slug) || buildFallbackSlug(specialtyName, specialtyId),
      description: toPlainString(item.description),
      image_url: toPlainString(item.image_url),
      approval_status: item.approval_status,
      status: item.status,
      created_at: toPlainString(item.created_at),
      updated_at: toPlainString(item.updated_at),
      is_featured: false,
      distanceKm: toSafeNumber(item.distanceKm),
    });
  }

  return Array.from(shopsById.values());
};

const loadNearbySpecialties = async (
  lat: number,
  lng: number,
): Promise<GetShopsWithSpecialtiesResponse> => {
  const key = `${lat},${lng}`;
  const cached = nearbySpecialtiesCache.get(key);
  if (cached) return cached;

  if (!nearbySpecialtiesRequests.has(key)) {
    nearbySpecialtiesRequests.set(
      key,
      getNearbySpecialties({ lat, lng }).then((nearbyResponse) => {
        const nearbySpecialties = Array.isArray(
          nearbyResponse?.metadata?.specialties,
        )
          ? nearbyResponse.metadata.specialties
          : [];

        const response = {
          statusCode: nearbyResponse.statusCode,
          error: nearbyResponse.error,
          message: nearbyResponse.message,
          metadata: mapNearbySpecialtiesToShopShape(nearbySpecialties),
        };

        nearbySpecialtiesCache.set(key, response);
        return response;
      }),
    );
  }

  return nearbySpecialtiesRequests.get(
    key,
  ) as Promise<GetShopsWithSpecialtiesResponse>;
};

export const useShopsWithSpecialties = (coords?: {
  lat?: number | null;
  lng?: number | null;
}) => {
  const [shopSpecialties, setShopSpecialties] =
    useState<GetShopsWithSpecialtiesResponse>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hasBrowserCoords =
      Number.isFinite(coords?.lat) && Number.isFinite(coords?.lng);

    if (!hasBrowserCoords) {
      setShopSpecialties(undefined);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await loadNearbySpecialties(
          Number(coords?.lat),
          Number(coords?.lng),
        );

        setShopSpecialties(response);
      } catch (err) {
        console.error("Error fetching nearby specialties:", err);
        setShopSpecialties(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coords?.lat, coords?.lng]);

  return { shopSpecialties, loading };
};
