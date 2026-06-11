import { NextRequest, NextResponse } from "next/server";

function parseNumber(value: string | null): number | null {
  if (value === null || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
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
        { status: 500 },
      );
    }

    const lat = parseNumber(request.nextUrl.searchParams.get("lat"));
    const lng = parseNumber(request.nextUrl.searchParams.get("lng"));

    if (lat === null || lng === null) {
      return NextResponse.json(
        {
          statusCode: 400,
          error: "BAD_REQUEST",
          message: "Thiếu tọa độ từ trình duyệt",
          metadata: null,
        },
        { status: 400 },
      );
    }

    const params = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
    });

    const maxKm = parseNumber(request.nextUrl.searchParams.get("maxKm"));
    const limit = parseNumber(request.nextUrl.searchParams.get("limit"));

    if (maxKm !== null) params.set("maxKm", String(maxKm));
    if (limit !== null) params.set("limit", String(limit));

    const res = await fetch(`${apiUrl}/specialty-stories/nearby?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi gọi nearby specialty stories API", error },
      { status: 500 },
    );
  }
}
