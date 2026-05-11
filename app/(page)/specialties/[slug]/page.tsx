"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSpecialty } from "@/app/services/useSpecialty";
import SpecialtyBreadcrumb from "./components/specialty-breadcrumb";
import SpecialtyBanner from "./components/specialty-banner";
import SpecialtyProductList from "./components/specialty-product-list";

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="h-5 w-60 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-72 animate-pulse rounded-3xl bg-gray-200" />
      </div>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10">
        <div className="h-8 w-64 animate-pulse rounded-xl bg-gray-200" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SpecialtyDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { specialty } = useSpecialty(slug);

  const data = specialty?.metadata;
  const loading = !specialty;

  // Lấy vị trí GPS
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
      },
      () => {} // bỏ qua lỗi
    );
  }, []);

  const shopCount = useMemo(() => {
    if (!data?.products) return 0;
    return new Set(data.products.map((p) => p.shop?._id).filter(Boolean)).size;
  }, [data]);

  const avgRating = useMemo(() => {
    if (!data?.products?.length) return "0";
    const sum = data.products.reduce((s, p) => s + (p.rating ?? 0), 0);
    return (sum / data.products.length).toFixed(1);
  }, [data]);

  if (loading) return <PageSkeleton />;

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-5xl">🍃</p>
          <p className="mt-4 text-lg font-semibold text-gray-600">Không tìm thấy đặc sản</p>
          <Link href="/specialties" className="mt-4 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">
            Quay lại
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f3]">

      <SpecialtyBanner
        name={data.name}
        description={data.description}
        imageUrl={data.image_url}
        totalProducts={data.totalProducts}
        shopCount={shopCount}
        avgRating={avgRating}
      />

      <SpecialtyBreadcrumb name={data.name} />

      <SpecialtyProductList
        specialtyName={data.name}
        products={data.products || []}
        userLat={userLat}
        userLng={userLng}
      />
    </div>
  );
}
