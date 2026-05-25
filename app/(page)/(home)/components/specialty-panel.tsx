"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Shop } from "@/app/types/api/specialtyShop";
import { MapFocusTarget } from "@/app/types/mapFocus";

interface SpecialtyPanelProps {
  shopSpecialtiesData: Shop[] | undefined;
  loading?: boolean;
  onFocusMarker?: (target: MapFocusTarget) => void;
}

type ShopFocusInfo = {
  lat: number;
  lng: number;
  shopSlug?: string;
};

type SpecialtySummary = {
  key: string;
  name: string;
  description: string;
  imageUrl: string;
  isFeatured: boolean;
  shopCount: number;
  /** Tọa độ tất cả shop có đặc sản này */
  focusTargets: ShopFocusInfo[];
};

type RawSpecialty = Shop["specialties"][number] | string;

const getShopFocusInfo = (shop: Shop): ShopFocusInfo | undefined => {
  if (!Number.isFinite(shop.latitude) || !Number.isFinite(shop.longitude)) {
    return undefined;
  }

  const shopSlug = shop.slug?.trim();

  return {
    lat: shop.latitude,
    lng: shop.longitude,
    shopSlug: shopSlug || undefined,
  };
};

const buildSpecialtySummaries = (
  shops: Shop[] | undefined,
): SpecialtySummary[] => {
  const specialtyMap = new Map<string, SpecialtySummary>();

  for (const shop of shops ?? []) {
    const specialties = (shop.specialties ?? []) as RawSpecialty[];

    for (const specialty of specialties) {
      const isStringSpecialty = typeof specialty === "string";
      const name = isStringSpecialty
        ? specialty.trim()
        : specialty.name?.trim();
      if (!name) continue;

      const key = isStringSpecialty
        ? `name:${name.toLowerCase()}`
        : specialty.idSpecialties?.trim() ||
          specialty.slug?.trim() ||
          `name:${name.toLowerCase()}`;

      const shopFocus = getShopFocusInfo(shop);
      const summary = specialtyMap.get(key);
      if (!summary) {
        specialtyMap.set(key, {
          key,
          name,
          description: isStringSpecialty
            ? ""
            : specialty.description?.trim() || "",
          imageUrl: isStringSpecialty ? "" : specialty.image_url?.trim() || "",
          isFeatured: isStringSpecialty
            ? false
            : Boolean(specialty.is_featured),
          shopCount: 1,
          focusTargets: shopFocus ? [shopFocus] : [],
        });
        continue;
      }

      summary.shopCount += 1;
      if (shopFocus) {
        summary.focusTargets.push(shopFocus);
      }
      if (!summary.description && !isStringSpecialty) {
        summary.description = specialty.description?.trim() || "";
      }
      if (!summary.imageUrl && !isStringSpecialty) {
        summary.imageUrl = specialty.image_url?.trim() || "";
      }
      summary.isFeatured =
        summary.isFeatured ||
        (!isStringSpecialty && Boolean(specialty.is_featured));
    }
  }

  return [...specialtyMap.values()].sort(
    (a, b) => b.shopCount - a.shopCount || a.name.localeCompare(b.name, "vi"),
  );
};

export default function SpecialtyPanel({
  shopSpecialtiesData,
  loading = false,
  onFocusMarker,
}: SpecialtyPanelProps) {
  const specialtiesOnly = buildSpecialtySummaries(shopSpecialtiesData);
  const shouldScroll = specialtiesOnly.length > 5;
  const [selectedSpecialtyKey, setSelectedSpecialtyKey] = useState<
    string | null
  >(null);

  const activeSpecialtyKey = specialtiesOnly.some(
    (specialty) => specialty.key === selectedSpecialtyKey,
  )
    ? selectedSpecialtyKey
    : null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.05 }}
      className="overflow-hidden border border-amber-200 bg-white shadow-sm w-110"
    >
      <div className="border-b border-amber-100 bg-amber-50/60 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Specialties
            </p>
            <h2 className="mt-1 text-xl font-bold text-dark">
              Đặc sản khu vực
            </h2>
          </div>

          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-primary">
            {loading ? "Đang tải..." : `${specialtiesOnly.length} danh mục`}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div
          className={`space-y-3 pr-1 ${
            shouldScroll ? "max-h-140 overflow-y-auto" : ""
          }`}
        >
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-2xl border border-amber-100 bg-primary-soft"
                />
              ))}
            </div>
          ) : specialtiesOnly.length > 0 ? (
            specialtiesOnly.map((specialty) => {
              const isSelected = activeSpecialtyKey === specialty.key;

              return (
                <button
                  key={specialty.key}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedSpecialtyKey(specialty.key);

                    if (specialty.focusTargets.length > 0) {
                      const firstShop = specialty.focusTargets[0];
                      onFocusMarker?.({
                        lat: firstShop.lat,
                        lng: firstShop.lng,
                        shopSlug: firstShop.shopSlug,
                        allShops: specialty.focusTargets,
                      });
                    }
                  }}
                  className={`group w-full rounded-2xl px-4 py-3 text-left transition ${
                    isSelected
                      ? "border border-amber-400 bg-amber-50 shadow-sm ring-2 ring-amber-200"
                      : "border border-amber-100 bg-primary-soft hover:border-amber-300 hover:bg-background"
                  }`}
                >
                  <div className="flex items-center gap-3 ">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-amber-100 bg-white">
                      {specialty.imageUrl ? (
                        <img
                          src={specialty.imageUrl}
                          alt={specialty.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-bold uppercase tracking-wide text-amber-700">
                          {specialty.name.slice(0, 2)}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p
                          className={`truncate text-sm font-semibold md:text-base ${
                            isSelected ? "text-primary" : "text-dark"
                          }`}
                        >
                          {specialty.name}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
                            isSelected
                              ? "bg-amber-100 text-amber-800"
                              : "bg-white text-primary"
                          }`}
                        >
                          {specialty.shopCount > 99 ? "99+" : specialty.shopCount}{" "}
                          quán
                        </span>
                      </div>

                      <p className="mt-1 line-clamp-2 text-xs text-stone-500 md:text-sm">
                        {specialty.description ||
                          "Món đặc sản nổi bật được nhiều quán trong khu vực phục vụ."}
                      </p>

                      {specialty.isFeatured ? (
                        <span className="mt-2 inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                          Nổi bật
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <p className="rounded-2xl border border-amber-100 bg-primary-soft px-4 py-3 text-sm text-stone-500">
              Chưa có đặc sản
            </p>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
