"use client";

import React, { useEffect, useState } from "react";
import { LuX } from "react-icons/lu";
import type { AddressData } from "@/app/store/slices/addressSlice";

interface EditAddressModalProps {
  open: boolean;
  initialData: AddressData;
  onClose: () => void;
  onSave: (data: AddressData) => void;
}

// Sample data for dropdowns
const CITIES = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Huế"];
const DISTRICTS: Record<string, string[]> = {
  "Hà Nội": ["Quận Cầu Giấy", "Quận Ba Đình", "Quận Đống Đa", "Quận Hoàn Kiếm", "Quận Hai Bà Trưng", "Quận Thanh Xuân"],
  "TP. Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5", "Quận 7", "Quận Bình Thạnh", "Quận Phú Nhuận"],
  "Đà Nẵng": ["Quận Hải Châu", "Quận Thanh Khê", "Quận Sơn Trà"],
  "Hải Phòng": ["Quận Hồng Bàng", "Quận Lê Chân", "Quận Ngô Quyền"],
  "Cần Thơ": ["Quận Ninh Kiều", "Quận Bình Thuỷ", "Quận Cái Răng"],
  "Huế": ["TP. Huế"],
};
const WARDS: Record<string, string[]> = {
  "Quận Cầu Giấy": ["Phường Quan Hoa", "Phường Dịch Vọng", "Phường Dịch Vọng Hậu", "Phường Mai Dịch", "Phường Nghĩa Đô", "Phường Nghĩa Tân", "Phường Trung Hoà", "Phường Yên Hoà"],
  "Quận Ba Đình": ["Phường Cống Vị", "Phường Điện Biên", "Phường Giảng Võ", "Phường Kim Mã"],
  "Quận Đống Đa": ["Phường Láng Hạ", "Phường Láng Thượng", "Phường Ô Chợ Dừa"],
};

export default function EditAddressModal({
  open,
  initialData,
  onClose,
  onSave,
}: EditAddressModalProps) {
  const [form, setForm] = useState<AddressData>(initialData);

  // Sync form when modal opens with new data
  useEffect(() => {
    if (open) setForm(initialData);
  }, [open, initialData]);

  // Prevent body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleChange = (field: keyof AddressData, value: string | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Reset dependent dropdowns
      if (field === "city") {
        updated.district = "";
        updated.ward = "";
      }
      if (field === "district") {
        updated.ward = "";
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const availableDistricts = DISTRICTS[form.city] ?? [];
  const availableWards = WARDS[form.district] ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-[620px] animate-[scaleIn_0.25s_ease] rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="m-0 text-lg font-bold text-stone-800">
            Thay đổi thông tin nhận hàng
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-xl text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
          >
            <LuX />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4">
          {/* Row: Name & Phone */}
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-600">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-800 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-600">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-800 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-stone-600">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-800 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* Row: City / District / Ward */}
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-600">
                Tỉnh/Thành phố <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-800 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2378716c'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px", paddingRight: "36px" }}
              >
                <option value="">Chọn</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-600">
                Quận/Huyện <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.district}
                onChange={(e) => handleChange("district", e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-800 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2378716c'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px", paddingRight: "36px" }}
              >
                <option value="">Chọn</option>
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-600">
                Phường/Xã <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.ward}
                onChange={(e) => handleChange("ward", e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-800 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2378716c'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px", paddingRight: "36px" }}
              >
                <option value="">Chọn</option>
                {availableWards.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Detail Address */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-stone-600">
              Địa chỉ chi tiết <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={form.detail}
              onChange={(e) => handleChange("detail", e.target.value)}
              placeholder="Số nhà, tên đường, toà nhà, căn hộ..."
              className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-800 outline-none transition-all placeholder:text-stone-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* Default checkbox */}
          <label className="mb-6 flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => handleChange("isDefault", e.target.checked)}
              className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-md border-2 border-stone-300 bg-white transition-all checked:border-orange-600 checked:bg-orange-600 hover:border-orange-600"
              style={form.isDefault ? { backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E")` } : {}}
            />
            <span className="text-sm font-medium text-stone-700">
              Đặt làm địa chỉ mặc định
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-stone-300 bg-white px-8 py-2.5 font-inherit text-sm font-semibold text-stone-600 transition-all hover:border-stone-400 hover:bg-stone-50"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-xl border-none bg-gradient-to-br from-orange-600 to-orange-500 px-8 py-2.5 font-inherit text-sm font-bold text-white shadow-md shadow-orange-600/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-600/35 active:translate-y-0"
            >
              Lưu thông tin
            </button>
          </div>
        </form>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
