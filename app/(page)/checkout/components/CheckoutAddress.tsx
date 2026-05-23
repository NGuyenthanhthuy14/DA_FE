"use client";

import React from "react";
import { LuMapPin, LuPencil } from "react-icons/lu";

interface CheckoutAddressProps {
  name: string;
  phone: string;
  address: string;
  onEdit?: () => void;
  onSelect?: () => void;
  hasAddressBook?: boolean;
}

export default function CheckoutAddress({
  name,
  phone,
  address,
  onEdit,
  onSelect,
  hasAddressBook,
}: CheckoutAddressProps) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="m-0 text-base font-bold text-amber-900">
          1. Thông tin nhận hàng
        </h2>
        <div className="flex items-center gap-3">
          {hasAddressBook && (
            <button
              type="button"
              onClick={onSelect}
              className="inline-flex cursor-pointer items-center gap-1 border-none bg-transparent text-sm font-medium text-orange-600 transition-colors hover:text-orange-700"
            >
              Chọn địa chỉ
            </button>
          )}
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex cursor-pointer items-center gap-1 border-none bg-transparent text-sm font-medium text-orange-600 transition-colors hover:text-orange-700"
          >
            <LuPencil className="text-sm" />
            Thay đổi
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-amber-200 bg-white px-4 py-3.5">
        <p className="m-0 text-sm font-semibold text-stone-800">{name}</p>
        <p className="m-0 mt-0.5 text-sm text-stone-500">{phone}</p>
        <div className="mt-2 flex items-start gap-1.5 text-sm text-stone-500">
          <LuMapPin className="mt-0.5 shrink-0 text-orange-500" />
          <span>{address}</span>
        </div>
      </div>
    </div>
  );
}
