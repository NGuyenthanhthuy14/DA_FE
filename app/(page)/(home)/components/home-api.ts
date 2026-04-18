import {
  featuredFoods as fallbackSpecialties,
  heroCategories as fallbackCategories,
  nearbyShops as fallbackNearbyShops,
  type FeaturedFood,
  type HeroCategory,
  type NearbyShop,
} from "./home-data";

type UnknownRecord = Record<string, unknown>;

export type MapPlace = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export type HomeOverview = {
  areaName: string | null;
  shops: NearbyShop[];
  specialties: FeaturedFood[];
  categories: HeroCategory[];
  chatbotSuggestions: string[];
};

const FALLBACK_SHOP_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop";
const FALLBACK_SPECIALTY_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop";

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function unwrapList(payload: unknown): UnknownRecord[] {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }
  if (!isRecord(payload)) return [];

  const candidates = [
    payload.data,
    payload.items,
    payload.results,
    payload.list,
    payload.shops,
    payload.nearbyShops,
    payload.restaurants,
    payload.specialties,
    payload.regionalSpecialties,
    payload.foods,
    payload.featuredFoods,
    payload.categories,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter(isRecord);
    }
  }

  return [];
}

function extractListByKeys(payload: unknown, keys: string[]): UnknownRecord[] {
  if (!isRecord(payload)) return [];
  for (const key of keys) {
    const list = unwrapList(payload[key]);
    if (list.length > 0) return list;
  }
  return [];
}

function parseDistance(value: unknown): string | null {
  const text = asString(value);
  if (text) return text;

  const num = asNumber(value);
  if (num === null) return null;
  const rounded = num >= 10 ? num.toFixed(0) : num.toFixed(1);
  return `${rounded} km`;
}

function toCategory(item: UnknownRecord, index: number): HeroCategory {
  const id = asNumber(item.id) ?? asNumber(item.categoryId) ?? index + 1;
  const name =
    asString(item.name) ??
    asString(item.title) ??
    asString(item.category_name) ??
    `Danh mục ${index + 1}`;
  const description =
    asString(item.description) ??
    asString(item.summary) ??
    "Ẩm thực địa phương phù hợp khẩu vị của bạn";

  const amountRaw =
    asString(item.amount) ??
    asString(item.count) ??
    asString(item.total) ??
    asString(item.shopCount);
  const amountNum =
    asNumber(item.amount) ??
    asNumber(item.count) ??
    asNumber(item.total) ??
    asNumber(item.shopCount);

  const amount =
    amountRaw ??
    (amountNum !== null
      ? `${Math.max(0, Math.round(amountNum))}${amountNum >= 0 ? "+" : ""}`
      : "0+");

  return { id, name, description, amount };
}

function toNearbyShop(item: UnknownRecord, index: number): NearbyShop {
  const location = isRecord(item.location) ? item.location : null;

  const lat =
    asNumber(item.lat) ??
    asNumber(item.latitude) ??
    asNumber(location?.lat) ??
    asNumber(location?.latitude) ??
    undefined;

  const lng =
    asNumber(item.lng) ??
    asNumber(item.longitude) ??
    asNumber(item.lon) ??
    asNumber(location?.lng) ??
    asNumber(location?.longitude) ??
    undefined;

  const distance =
    parseDistance(item.distance) ??
    parseDistance(item.distanceKm) ??
    parseDistance(item.km) ??
    "Gần bạn";

  const rating = asNumber(item.rating) ?? 4.5;
  const image =
    asString(item.image) ??
    asString(item.thumbnail) ??
    asString(item.coverImage) ??
    FALLBACK_SHOP_IMAGE;

  return {
    id: asNumber(item.id) ?? asNumber(item.shopId) ?? index + 1,
    name:
      asString(item.name) ?? asString(item.shopName) ?? `Quán ăn #${index + 1}`,
    address:
      asString(item.address) ??
      asString(item.fullAddress) ??
      asString(location?.address) ??
      "Chưa cập nhật địa chỉ",
    distance,
    rating: Number(rating.toFixed(1)),
    image,
    lat,
    lng,
  };
}

function toSpecialty(item: UnknownRecord, index: number): FeaturedFood {
  return {
    id: asNumber(item.id) ?? asNumber(item.foodId) ?? index + 1,
    name:
      asString(item.name) ?? asString(item.title) ?? `Đặc sản #${index + 1}`,
    location:
      asString(item.location) ??
      asString(item.region) ??
      asString(item.origin) ??
      "Khu vực gần bạn",
    image:
      asString(item.image) ??
      asString(item.thumbnail) ??
      asString(item.coverImage) ??
      FALLBACK_SPECIALTY_IMAGE,
    description:
      asString(item.description) ??
      asString(item.summary) ??
      "Đặc sản phù hợp cho hành trình khám phá ẩm thực của bạn.",
  };
}

function extractAreaName(payload: unknown): string | null {
  if (!isRecord(payload)) return null;

  const candidates = [
    payload.areaName,
    payload.locationName,
    payload.regionName,
    payload.region,
    payload.district,
    payload.city,
  ];

  for (const candidate of candidates) {
    const text = asString(candidate);
    if (text) return text;
  }

  const nestedCandidates = [payload.data, payload.result, payload.meta];
  for (const nested of nestedCandidates) {
    const areaName = extractAreaName(nested);
    if (areaName) return areaName;
  }

  return null;
}

function extractSuggestionList(payload: unknown): string[] {
  if (!isRecord(payload)) return [];

  const candidates = [
    payload.chatbotSuggestions,
    payload.suggestions,
    payload.hints,
    payload.gptPrompts,
  ];

  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) continue;
    const list = candidate
      .map((item) => asString(item))
      .filter((item): item is string => Boolean(item));
    if (list.length > 0) return list;
  }

  return [];
}

export function buildChatbotSuggestions(
  shops: NearbyShop[],
  specialties: FeaturedFood[],
  areaName?: string | null,
): string[] {
  const area = areaName ?? "khu vực gần bạn";
  const firstShop = shops[0]?.name;
  const secondShop = shops[1]?.name;
  const firstSpecialty = specialties[0]?.name;
  const secondSpecialty = specialties[1]?.name;

  return [
    `Ở ${area} nên ăn món gì trước?`,
    firstShop
      ? `${firstShop} có phù hợp đi nhóm 4 người không?`
      : `Quán nào ở ${area} đang mở cửa và dễ đi xe máy?`,
    firstSpecialty
      ? `${firstSpecialty} có quán nào làm ngon gần tôi?`
      : `Đặc sản nào ở ${area} dễ ăn cho lần đầu thử?`,
    secondShop && secondSpecialty
      ? `So sánh ${secondShop} với món ${secondSpecialty} cho buổi tối.`
      : `Gợi ý lịch ăn tối tiết kiệm cho 2 người tại ${area}.`,
  ];
}

function createFallbackOverview(areaName: string | null = null): HomeOverview {
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

export async function loadHomeOverview(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<HomeOverview> {
  try {
    const query = `lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`;
    const res = await fetch(`/api/home/overview?${query}`, {
      method: "GET",
      cache: "no-store",
      signal,
    });

    if (!res.ok) return createFallbackOverview();

    const payload = (await res.json()) as unknown;
    if (!isRecord(payload)) return createFallbackOverview();

    const shopsSource =
      extractListByKeys(payload, ["shops", "nearbyShops", "restaurants"]) ?? [];
    const specialtiesSource =
      extractListByKeys(payload, [
        "specialties",
        "regionalSpecialties",
        "foods",
        "featuredFoods",
      ]) ?? [];
    const categoriesSource = extractListByKeys(payload, ["categories"]) ?? [];

    const shops = shopsSource.map(toNearbyShop);
    const specialties = specialtiesSource.map(toSpecialty);
    const categories = categoriesSource.map(toCategory);

    const safeShops = shops.length > 0 ? shops : fallbackNearbyShops;
    const safeSpecialties =
      specialties.length > 0 ? specialties : fallbackSpecialties;
    const safeCategories =
      categories.length > 0
        ? categories
        : safeSpecialties.map((item: FeaturedFood, index: number) => ({
            id: index + 1,
            name: item.name,
            description: item.description,
            amount: "Gợi ý",
          }));

    const areaName = extractAreaName(payload);
    const chatbotSuggestions = extractSuggestionList(payload);

    return {
      areaName,
      shops: safeShops,
      specialties: safeSpecialties,
      categories: safeCategories,
      chatbotSuggestions:
        chatbotSuggestions.length > 0
          ? chatbotSuggestions
          : buildChatbotSuggestions(safeShops, safeSpecialties, areaName),
    };
  } catch {
    return createFallbackOverview();
  }
}

export function toMapPlaces(shops: NearbyShop[]): MapPlace[] {
  return shops
    .filter(
      (shop): shop is NearbyShop & { lat: number; lng: number } =>
        typeof shop.lat === "number" && typeof shop.lng === "number",
    )
    .map((shop) => ({
      id: String(shop.id),
      name: shop.name,
      lat: shop.lat,
      lng: shop.lng,
    }));
}
