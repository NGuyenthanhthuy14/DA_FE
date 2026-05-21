import { useEffect, useState } from "react";
import {
  GetShopsWithSpecialtiesResponse,
  Shop as SpecialtyShop,
  Specialty,
} from "../types/api/specialtyShop";
import { getShopsWithSpecialties } from "@/apiRequest/specialtyShop";
import { getShops } from "@/apiRequest/shops";
import { getAllProduct } from "@/apiRequest/product";
import {
  SpecialtyCatalogItem,
  getAllSpecialties,
} from "@/apiRequest/specialty";
import { Product } from "../types/api/product";
import { Shop } from "../types/api/shops";

const GEOLOCATION_TIMEOUT_MS = 4000;

const hasMetadata = (
  response: GetShopsWithSpecialtiesResponse | undefined,
): response is GetShopsWithSpecialtiesResponse =>
  Array.isArray(response?.metadata) && response.metadata.length > 0;

const hasAnySpecialties = (
  response: GetShopsWithSpecialtiesResponse | undefined,
): response is GetShopsWithSpecialtiesResponse =>
  Array.isArray(response?.metadata) &&
  response.metadata.some(
    (shop) => Array.isArray(shop.specialties) && shop.specialties.length > 0,
  );

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

const normalizeCatalogSpecialty = (
  item: SpecialtyCatalogItem,
): Specialty | null => {
  const id = toPlainString(item._id);
  const name = toPlainString(item.name);

  if (!id || !name) return null;

  const slug = toPlainString(item.slug) || buildFallbackSlug(name, id);

  return {
    idSpecialties: id,
    name,
    slug,
    description: toPlainString(item.description),
    image_url: toPlainString(item.image_url),
    category_id: toPlainString(item.category_id),
    is_featured: false,
  };
};

const mapShopToSpecialtyShape = (shop: Shop): SpecialtyShop => ({
  idShop: toPlainString(shop._id),
  name: toPlainString(shop.name),
  slug: toPlainString(shop.slug),
  phone: toPlainString(shop.phone),
  cover_image: toPlainString(shop.cover_image),
  latitude: toSafeNumber(shop.latitude),
  longitude: toSafeNumber(shop.longitude),
  address: toPlainString(shop.address),
  formatted_address: toPlainString(shop.formatted_address),
  status: shop.status === "inactive" ? "inactive" : "active",
  specialties: [],
});

const buildFallbackFromProducts = async (): Promise<
  GetShopsWithSpecialtiesResponse | undefined
> => {
  try {
    const [shopsRes, productsRes, specialtiesRes] = await Promise.all([
      getShops(),
      getAllProduct(),
      getAllSpecialties(),
    ]);

    const catalog = Array.isArray(specialtiesRes?.metadata)
      ? specialtiesRes.metadata
      : [];
    const normalizedSpecialties = catalog
      .map(normalizeCatalogSpecialty)
      .filter((item): item is Specialty => item !== null);

    if (!normalizedSpecialties.length) return undefined;

    const specialtyById = new Map(
      normalizedSpecialties.map((item) => [item.idSpecialties, item]),
    );
    const rawShops = Array.isArray(shopsRes?.metadata) ? shopsRes.metadata : [];
    const products = Array.isArray(productsRes?.data) ? productsRes.data : [];

    if (!rawShops.length) {
      return {
        statusCode: 200,
        error: null,
        message: "Fallback specialties catalog",
        metadata: [
          {
            idShop: "fallback-specialties",
            name: "Đặc sản Việt",
            slug: "dac-san-viet",
            phone: "",
            cover_image: "",
            latitude: Number.NaN,
            longitude: Number.NaN,
            address: "",
            formatted_address: "",
            status: "active",
            specialties: normalizedSpecialties,
          },
        ],
      };
    }

    const specialtyShops = rawShops.map(mapShopToSpecialtyShape);
    const specialtiesByShop = new Map<string, Map<string, Specialty>>();

    for (const product of products as Product[]) {
      const shopId = toPlainString(product.shop_id);
      const specialtyId = toPlainString(product.specialty_id);
      if (!shopId || !specialtyId) continue;

      const specialty = specialtyById.get(specialtyId);
      if (!specialty) continue;

      if (!specialtiesByShop.has(shopId)) {
        specialtiesByShop.set(shopId, new Map<string, Specialty>());
      }
      specialtiesByShop.get(shopId)?.set(specialty.idSpecialties, specialty);
    }

    let hasLinkedSpecialties = false;
    const mergedShops = specialtyShops.map((shop) => {
      const mapped = specialtiesByShop.get(shop.idShop);
      const specialties = mapped ? Array.from(mapped.values()) : [];
      if (specialties.length > 0) hasLinkedSpecialties = true;
      return { ...shop, specialties };
    });

    if (!hasLinkedSpecialties && mergedShops.length > 0) {
      const firstWithCoord = mergedShops.findIndex(
        (shop) =>
          Number.isFinite(shop.latitude) && Number.isFinite(shop.longitude),
      );
      const targetIndex = firstWithCoord >= 0 ? firstWithCoord : 0;
      mergedShops[targetIndex] = {
        ...mergedShops[targetIndex],
        specialties: normalizedSpecialties,
      };
    }

    return {
      statusCode: 200,
      error: null,
      message: "Fallback specialties from products/specialties",
      metadata: mergedShops,
    };
  } catch (error) {
    console.error("Error building specialty fallback:", error);
    return undefined;
  }
};

const getUserCoordinates = async (): Promise<
  { lat: number; lng: number } | undefined
> => {
  if (!navigator.geolocation) return undefined;

  return await new Promise((resolve) => {
    let done = false;

    const finish = (value: { lat: number; lng: number } | undefined) => {
      if (done) return;
      done = true;
      resolve(value);
    };

    const timer = window.setTimeout(() => {
      console.warn("Geolocation timeout -> fallback lấy toàn bộ quán");
      finish(undefined);
    }, GEOLOCATION_TIMEOUT_MS);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        window.clearTimeout(timer);
        finish({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        window.clearTimeout(timer);
        finish(undefined);
      },
      {
        timeout: GEOLOCATION_TIMEOUT_MS,
        maximumAge: 60_000,
      },
    );
  });
};

export const useShopsWithSpecialties = () => {
  const [shopSpecialties, setShopSpecialties] =
    useState<GetShopsWithSpecialtiesResponse>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coords = await getUserCoordinates();
        let response = await getShopsWithSpecialties(coords);

        // Nếu query theo GPS ra rỗng thì fallback lấy toàn bộ quán để luôn có dữ liệu hiển thị.
        if (coords && !hasAnySpecialties(response)) {
          response = await getShopsWithSpecialties();
        }

        if (!hasAnySpecialties(response)) {
          const fallbackResponse = await buildFallbackFromProducts();
          if (
            fallbackResponse &&
            (hasAnySpecialties(fallbackResponse) || hasMetadata(fallbackResponse))
          ) {
            response = fallbackResponse;
          }
        }

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
