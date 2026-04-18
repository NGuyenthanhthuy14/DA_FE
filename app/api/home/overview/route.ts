import { NextRequest, NextResponse } from "next/server";

type UnknownRecord = Record<string, unknown>;

const DEFAULT_LAT = 21.028;
const DEFAULT_LNG = 105.83991;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function parseNumber(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function extractArrayFromPayload(
  payload: unknown,
  preferredKeys: string[]
): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];

  for (const key of preferredKeys) {
    const candidate = payload[key];
    if (Array.isArray(candidate)) return candidate;
    if (isRecord(candidate)) {
      const nested = extractArrayFromPayload(candidate, []);
      if (nested.length > 0) return nested;
    }
  }

  const commonKeys = ["data", "items", "results", "list"];
  for (const key of commonKeys) {
    const candidate = payload[key];
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function extractAreaName(payload: unknown): string | null {
  if (!isRecord(payload)) return null;

  const candidates = [
    payload.areaName,
    payload.locationName,
    payload.region,
    payload.regionName,
    payload.district,
    payload.city,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  for (const key of ["data", "result"]) {
    const nested = payload[key];
    const nestedArea = extractAreaName(nested);
    if (nestedArea) return nestedArea;
  }

  return null;
}

async function fetchJSON(url: string): Promise<{
  ok: boolean;
  status: number;
  payload: unknown;
}> {
  try {
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    const text = await res.text();
    let payload: unknown = null;
    try {
      payload = text ? (JSON.parse(text) as unknown) : null;
    } catch {
      payload = null;
    }
    return { ok: res.ok, status: res.status, payload };
  } catch {
    return { ok: false, status: 500, payload: null };
  }
}

function toArrayOrEmpty(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export async function GET(request: NextRequest) {
  try {
    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      return NextResponse.json(
        {
          message:
            "Thiếu API_URL (hoặc NEXT_PUBLIC_API_URL) trong biến môi trường",
        },
        { status: 500 }
      );
    }

    const lat = parseNumber(
      request.nextUrl.searchParams.get("lat"),
      DEFAULT_LAT
    );
    const lng = parseNumber(
      request.nextUrl.searchParams.get("lng"),
      DEFAULT_LNG
    );

    let shops: unknown[] = [];
    let specialties: unknown[] = [];
    let categories: unknown[] = [];
    let areaName: string | null = null;

    const overviewQuery = `lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`;
    const overview = await fetchJSON(`${apiUrl}/home/overview?${overviewQuery}`);

    if (overview.ok) {
      shops = extractArrayFromPayload(overview.payload, [
        "shops",
        "nearbyShops",
        "restaurants",
      ]);
      specialties = extractArrayFromPayload(overview.payload, [
        "specialties",
        "regionalSpecialties",
        "foods",
        "featuredFoods",
      ]);
      categories = extractArrayFromPayload(overview.payload, ["categories"]);
      areaName = extractAreaName(overview.payload);
    }

    if (shops.length === 0) {
      const nearby = await fetchJSON(
        `${apiUrl}/shops/nearby?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`
      );
      if (nearby.ok) {
        shops = extractArrayFromPayload(nearby.payload, [
          "shops",
          "nearbyShops",
          "restaurants",
        ]);
        areaName = areaName ?? extractAreaName(nearby.payload);
      }
    }

    if (specialties.length === 0) {
      const specialtyEndpoints = [
        `${apiUrl}/foods/specialties/nearby?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`,
        `${apiUrl}/home/specialties?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`,
        `${apiUrl}/home/categories`,
      ];

      for (const endpoint of specialtyEndpoints) {
        const res = await fetchJSON(endpoint);
        if (!res.ok) continue;

        const list = extractArrayFromPayload(res.payload, [
          "specialties",
          "regionalSpecialties",
          "foods",
          "featuredFoods",
          "categories",
        ]);

        if (list.length > 0) {
          specialties = list;
          areaName = areaName ?? extractAreaName(res.payload);
          break;
        }
      }
    }

    if (categories.length === 0) {
      categories = toArrayOrEmpty(specialties);
    }

    return NextResponse.json(
      {
        lat,
        lng,
        areaName,
        shops,
        specialties,
        categories,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi gọi home overview API", error },
      { status: 500 }
    );
  }
}
