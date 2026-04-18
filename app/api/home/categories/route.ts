import { NextRequest, NextResponse } from "next/server";

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

    const lat = request.nextUrl.searchParams.get("lat");
    const lng = request.nextUrl.searchParams.get("lng");
    const query =
      lat && lng
        ? `?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`
        : "";

    const res = await fetch(`${apiUrl}/home/categories${query}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi gọi categories API", error },
      { status: 500 }
    );
  }
}
