"use client";

import { LucideCheckCircle } from "lucide-react";
import React, { useEffect } from "react";
import { LuShoppingBag, LuClipboardList } from "react-icons/lu";

interface OrderSuccessModalProps {
  open: boolean;
  onClose: () => void;
  onViewOrders?: () => void;
}

export default function OrderSuccessModal({
  open,
  onClose,
  onViewOrders,
}: OrderSuccessModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-sm animate-[scaleIn_0.3s_ease] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Top decoration */}
        <div className="flex flex-col items-center bg-gradient-to-br from-orange-500 to-orange-600 px-6 pb-8 pt-10 text-white">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/10">
            <LucideCheckCircle className="text-4xl" />
          </div>
          <h2 className="m-0 text-xl font-extrabold">Đặt hàng thành công!</h2>
          <p className="m-0 mt-1 text-sm text-orange-100">
            Cảm ơn bạn đã tin tưởng Đặc sản Việt
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6 text-center">
          <p className="m-0 mb-1 text-sm text-stone-600">
            Đơn hàng của bạn đang được xử lý.
          </p>
          <p className="m-0 mb-6 text-sm text-stone-400">
            Chúng tôi sẽ liên hệ sớm nhất để xác nhận.
          </p>

          <div className="flex flex-col gap-3">
            {/* Xem đơn hàng */}
            <button
              type="button"
              onClick={onViewOrders ?? onClose}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-gradient-to-br from-orange-600 to-orange-500 px-5 py-3.5 font-inherit text-[15px] font-bold text-white shadow-lg shadow-orange-600/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-600/40 active:translate-y-0"
            >
              <LuClipboardList className="text-lg" />
              Xem đơn hàng của tôi
            </button>

            {/* Tiếp tục mua sắm */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 font-inherit text-[15px] font-medium text-stone-600 transition-all hover:border-orange-400 hover:text-orange-600"
            >
              <LuShoppingBag className="text-lg" />
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
