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

    const lat = request.nextUrl.searchParams.get("lat") ?? "21.076";
    const lng = request.nextUrl.searchParams.get("lng") ?? "105.436";

    const res = await fetch(
      `${apiUrl}/shops/nearby?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi gọi nearby shops API", error },
      { status: 500 }
    );
  }
}
