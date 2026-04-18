"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { BiMap, BiMapPin } from "react-icons/bi";

import type { NearbyShop } from "./home-data";
import { toMapPlaces } from "./home-api";

const GoongMap = dynamic(() => import("../../../components/GoongMap"), {
  ssr: false,
});

interface MapPanelProps {
  shops: NearbyShop[];
  locationLabel: string;
}

export default function MapPanel({ shops, locationLabel }: MapPanelProps) {
  const places = useMemo(() => toMapPlaces(shops), [shops]);
  const visibleMapPoints = useMemo(() => shops.slice(0, 6), [shops]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="overflow-hidden border border-amber-200 bg-white shadow-sm flex-1"
    >
      <div className="flex items-center justify-between gap-3 border-b border-amber-100 bg-amber-50/60 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Map
          </p>
        </div>

        <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-stone-600 shadow-sm">
          <BiMapPin className="text-primary" />
          <span className="max-w-45 truncate">{locationLabel}</span>
        </div>
      </div>

      <div className="relative h-90 bg-primary-soft md:h-155">
        {places.length > 0 ? (
          <GoongMap places={places} />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <div>
              <BiMap className="mx-auto mb-3 text-4xl text-accent" />
              <p className="text-sm font-medium text-dark">Chưa có dữ liệu bản đồ</p>
            </div>
          </div>
        )}
      </div>

      
    </motion.div>
  );
}
