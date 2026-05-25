"use client";

/* eslint-disable @next/next/no-img-element */

import React from "react";
import {
  LuCircleDollarSign,
  LuMapPin,
  LuPackage,
  LuPhone,
  LuStore,
  LuTruck,
  LuUser,
  LuX,
} from "react-icons/lu";
import type { OrderData } from "./OrderCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function fmtPrice(value?: number) {
  return (value ?? 0).toLocaleString("vi-VN") + "đ";
}

function fmtDate(value?: string) {
  if (!value) return "Chưa cập nhật";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa cập nhật";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function imgSrc(path?: string) {
  if (!path) return "/placeholder-food.png";
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Hoàn thành",
  cancelled: "Đã hủy",
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  failed: "Thanh toán thất bại",
  cancelled: "Đã hủy thanh toán",
};

interface OrderDetailModalProps {
  open: boolean;
  order: OrderData | null;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
}

export default function OrderDetailModal({
  open,
  order,
  loading,
  error,
  onClose,
}: OrderDetailModalProps) {
  if (!open) return null;

  const address = order?.shippingAddress;
  const statusLabel = order ? STATUS_LABEL[order.status] || order.status : "";
  const paymentStatus =
    order?.paymentStatus || (order?.isPaid ? "paid" : "pending");
  const paymentStatusLabel =
    PAYMENT_STATUS_LABEL[paymentStatus] || paymentStatus;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label="Chi tiết đơn hàng"
      onMouseDown={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-5 py-4">
          <div>
            <h2 className="m-0 text-lg font-extrabold text-stone-900">
              Chi tiết đơn hàng
            </h2>
            <p className="m-0 mt-1 text-xs text-stone-500">
              {order
                ? `Mã đơn #${order._id.slice(-8).toUpperCase()} - ${fmtDate(
                    order.createdAt,
                  )}`
                : "Đang tải thông tin đơn hàng"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition hover:border-orange-300 hover:text-orange-600"
            aria-label="Đóng chi tiết đơn hàng"
          >
            <LuX />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          {loading && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Đang tải chi tiết đơn hàng...
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {!order && !loading ? (
            <div className="py-12 text-center text-sm text-stone-500">
              Không tìm thấy thông tin đơn hàng.
            </div>
          ) : (
            order && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-stone-200 p-3">
                    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase text-stone-500">
                      <LuPackage />
                      Trạng thái
                    </div>
                    <p className="m-0 text-sm font-bold text-orange-600">
                      {statusLabel}
                    </p>
                  </div>
                  <div className="rounded-lg border border-stone-200 p-3">
                    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase text-stone-500">
                      <LuCircleDollarSign />
                      Thanh toán
                    </div>
                    <p className="m-0 text-sm font-bold text-stone-800">
                      {paymentStatusLabel}
                    </p>
                  </div>
                  <div className="rounded-lg border border-stone-200 p-3">
                    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase text-stone-500">
                      <LuTruck />
                      Vận chuyển
                    </div>
                    <p className="m-0 text-sm font-bold text-stone-800">
                      {order.isDelivered ? "Đã giao" : "Chưa giao"}
                    </p>
                  </div>
                </div>

                <section className="rounded-lg border border-stone-200">
                  <div className="border-b border-stone-100 px-4 py-3">
                    <h3 className="m-0 text-sm font-extrabold text-stone-900">
                      Địa chỉ nhận hàng
                    </h3>
                  </div>
                  <div className="space-y-2 px-4 py-3 text-sm text-stone-700">
                    <p className="m-0 flex items-center gap-2">
                      <LuUser className="shrink-0 text-stone-400" />
                      <span className="font-semibold">
                        {address?.fullName || "Chưa có tên người nhận"}
                      </span>
                    </p>
                    <p className="m-0 flex items-center gap-2">
                      <LuPhone className="shrink-0 text-stone-400" />
                      {address?.phone || "Chưa có số điện thoại"}
                    </p>
                    <p className="m-0 flex items-start gap-2">
                      <LuMapPin className="mt-0.5 shrink-0 text-stone-400" />
                      <span>
                        {[
                          address?.detail,
                          address?.ward,
                          address?.district,
                          address?.city,
                          address?.address,
                        ]
                          .filter(Boolean)
                          .join(", ") || "Chưa có địa chỉ"}
                      </span>
                    </p>
                  </div>
                </section>

                <section className="rounded-lg border border-stone-200">
                  <div className="border-b border-stone-100 px-4 py-3">
                    <h3 className="m-0 text-sm font-extrabold text-stone-900">
                      Sản phẩm trong đơn
                    </h3>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {order.shopOrders.map((shopOrder) => (
                      <div key={shopOrder._id} className="px-4 py-3">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <LuStore className="shrink-0 text-stone-500" />
                            <span className="truncate text-sm font-extrabold text-stone-900">
                              {shopOrder.shopName}
                            </span>
                          </div>
                          <span className="shrink-0 text-xs font-medium text-stone-500">
                            {shopOrder.shippingLabel}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {shopOrder.items.map((item, index) => (
                            <div
                              key={`${shopOrder._id}-detail-${index}`}
                              className="flex gap-3"
                            >
                              <img
                                src={imgSrc(item.image)}
                                alt={item.name}
                                className="h-16 w-16 shrink-0 rounded-lg border border-stone-200 bg-stone-50 object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="m-0 line-clamp-2 text-sm font-medium text-stone-900">
                                  {item.name}
                                </p>
                                <p className="m-0 mt-1 text-xs text-stone-500">
                                  {fmtPrice(item.price)} x {item.quantity}
                                </p>
                              </div>
                              <div className="shrink-0 text-right text-sm font-semibold text-stone-900">
                                {fmtPrice(item.itemTotal)}
                              </div>
                            </div>
                          ))}
                        </div>

                        {shopOrder.note && (
                          <p className="m-0 mt-3 rounded-lg bg-stone-50 px-3 py-2 text-xs text-stone-500">
                            Ghi chú: {shopOrder.note}
                          </p>
                        )}

                        <div className="mt-3 space-y-1 text-sm">
                          <div className="flex justify-between text-stone-500">
                            <span>Tiền hàng</span>
                            <span>{fmtPrice(shopOrder.productTotal)}</span>
                          </div>
                          <div className="flex justify-between text-stone-500">
                            <span>Phí vận chuyển</span>
                            <span>{fmtPrice(shopOrder.shippingPrice)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-stone-900">
                            <span>Tổng shop</span>
                            <span>{fmtPrice(shopOrder.shopTotal)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )
          )}
        </div>

        {order && (
          <div className="border-t border-stone-200 bg-stone-50 px-5 py-4">
            <div className="ml-auto max-w-sm space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Tạm tính</span>
                <span>{fmtPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Phí vận chuyển</span>
                <span>{fmtPrice(order.shippingTotal)}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-extrabold text-orange-600">
                <span>Tổng thanh toán</span>
                <span>{fmtPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
