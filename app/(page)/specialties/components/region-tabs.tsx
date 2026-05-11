"use client";

import { GiNoodles } from "react-icons/gi";

const REGIONS = [
  { value: "all", label: "Tất cả" },
  { value: "Miền Bắc", label: "Miền Bắc" },
  { value: "Miền Trung", label: "Miền Trung" },
  { value: "Miền Nam", label: "Miền Nam" },
  { value: "Tây Nguyên", label: "Tây Nguyên" },
  { value: "Hải đảo", label: "Hải đảo" },
];

interface RegionTabsProps {
  active: string;
  onChange: (region: string) => void;
}

export default function RegionTabs({ active, onChange }: RegionTabsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-6">
      {REGIONS.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => onChange(r.value)}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
            active === r.value
              ? "bg-primary text-white shadow-sm"
              : "border border-amber-200 bg-white text-[#5a3e2b] hover:bg-amber-50 hover:text-primary"
          }`}
        >
          <GiNoodles className="text-base" />
          {r.label}
        </button>
      ))}
    </div>
  );
}
