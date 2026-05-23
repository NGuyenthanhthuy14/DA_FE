"use client";

import React, { useState } from "react";
import {
  LuChevronDown,
  LuChevronUp,
  LuCopy,
  LuShoppingCart,
  LuStar,
  LuTruck,
  LuCheck,
} from "react-icons/lu";

// ── Types matching backend OrderProduct model ──

export interface OrderItemData {
  product: string | { _id?: string; id?: string };
  name: string;
  image: string;
  price: number;
  quantity: number;
  itemTotal: number;
}

export interface ShopOrderData {
  _id: string;
  shop: string;
  shopName: string;
  items: OrderItemData[];
  shippingMethod: string;
  shippingLabel: string;
  shippingPrice: number;
  productTotal: number;
  shopTotal: number;
  note: string;
}

export interface OrderData {
  _id: string;
  user: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    detail: string;
  };
  shopOrders: ShopOrderData[];
  paymentMethod: string;
  subtotal: number;
  shippingTotal: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Helpers ──
function fmtPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

function fmtDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} - ${hours}:${mins}`;
}

const STATUS_MAP: Record<
  string,
  { label: string; bg: string; text: string; icon: string }
> = {
  pending: {
    label: "Chờ xác nhận",
    bg: "bg-amber-100",
    text: "text-amber-700",
    icon: "⏳",
  },
  confirmed: {
    label: "Đã xác nhận",
    bg: "bg-sky-100",
    text: "text-sky-700",
    icon: "✅",
  },
  shipping: {
    label: "Đang giao",
    bg: "bg-blue-100",
    text: "text-blue-700",
    icon: "🚚",
  },
  delivered: {
    label: "Đã giao",
    bg: "bg-green-100",
    text: "text-green-700",
    icon: "📦",
  },
  cancelled: {
    label: "Đã huỷ",
    bg: "bg-stone-100",
    text: "text-stone-500",
    icon: "❌",
  },
};

const PAYMENT_MAP: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng",
  bank: "Chuyển khoản ngân hàng",
  ewallet: "Ví điện tử",
  card: "Thẻ tín dụng/ghi nợ",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
function imgSrc(path?: string) {
  if (!path) return "/placeholder-food.png";
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

function getProductId(product: OrderItemData["product"]) {
  if (typeof product === "string") return product;
  return product._id || product.id || "";
}

// ── Component ──
interface OrderCardProps {
  order: OrderData;
  onReorder?: (orderId: string) => void;
  reviewedProductKeys?: Set<string>;
  reviewSubmittingKey?: string | null;
  onReviewSubmit?: (payload: {
    orderId: string;
    productId: string;
    rating: number;
    comment: string;
  }) => Promise<void>;
}

export default function OrderCard({
  order,
  onReorder,
  reviewedProductKeys,
  reviewSubmittingKey,
  onReviewSubmit,
}: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<OrderItemData | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const statusInfo = STATUS_MAP[order.status] ?? STATUS_MAP.pending;

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(order._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const shortId = order._id.slice(-8).toUpperCase();
  const isDelivered = order.status === "delivered" || order.isDelivered;
  const reviewableItems = order.shopOrders.flatMap((shopOrder) => shopOrder.items);
  const hasUnreviewedItems = reviewableItems.some(
    (item) => !reviewedProductKeys?.has(`${order._id}:${getProductId(item.product)}`),
  );
  const firstUnreviewedItem = reviewableItems.find(
    (item) => !reviewedProductKeys?.has(`${order._id}:${getProductId(item.product)}`),
  );

  const openReviewModal = (item: OrderItemData) => {
    setReviewTarget(item);
    setReviewRating(5);
    setReviewComment("");
  };

  const closeReviewModal = () => {
    setReviewTarget(null);
    setReviewComment("");
    setReviewRating(5);
  };

  const handleSubmitReview = async () => {
    if (!reviewTarget || !onReviewSubmit) return;
    const productId = getProductId(reviewTarget.product);
    if (!productId) return;

    try {
      await onReviewSubmit({
        orderId: order._id,
        productId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      closeReviewModal();
    } catch {
      // Parent shows the error toast; keep the modal open for correction/retry.
    }
  };

  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-amber-100 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-stone-800">
              Đơn hàng:{" "}
              <span className="text-orange-600">#{shortId}</span>
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="cursor-pointer border-none bg-transparent p-0 text-stone-400 transition-colors hover:text-orange-600"
              title="Sao chép mã đơn"
            >
              {copied ? (
                <LuCheck className="text-sm text-green-500" />
              ) : (
                <LuCopy className="text-sm" />
              )}
            </button>
          </div>
          <p className="m-0 mt-1 text-xs text-stone-400">
            Đặt ngày: {fmtDate(order.createdAt)}
          </p>
          <p className="m-0 mt-0.5 text-sm">
            Tổng tiền:{" "}
            <span className="font-bold text-orange-600">
              {fmtPrice(order.totalPrice)}
            </span>
          </p>
          <p className="m-0 mt-0.5 text-xs text-stone-400">
            {PAYMENT_MAP[order.paymentMethod] ?? order.paymentMethod}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* Status badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}
          >
            <span>{statusInfo.icon}</span>
            {statusInfo.label}
          </span>

          {/* Toggle details */}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex cursor-pointer items-center gap-1 border-none bg-transparent text-xs text-stone-400 transition-colors hover:text-stone-600"
          >
            {expanded ? "Ẩn chi tiết" : "Xem chi tiết"}
            {expanded ? <LuChevronUp /> : <LuChevronDown />}
          </button>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {isDelivered && onReviewSubmit && (
              <button
                type="button"
                disabled={!hasUnreviewedItems}
                onClick={() => {
                  if (firstUnreviewedItem) openReviewModal(firstUnreviewedItem);
                }}
                className="cursor-pointer rounded-lg border border-orange-200 bg-orange-50 px-4 py-1.5 font-inherit text-xs font-semibold text-orange-600 shadow-sm transition-all hover:bg-orange-100 disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-50 disabled:text-stone-400"
              >
                {hasUnreviewedItems ? "Đánh giá" : "Đã đánh giá"}
              </button>
            )}
            {(order.status === "delivered") && (
              <button
                type="button"
                onClick={() => onReorder?.(order._id)}
                className="cursor-pointer rounded-lg border-none bg-orange-600 px-4 py-1.5 font-inherit text-xs font-semibold text-white shadow-sm transition-all hover:bg-orange-700"
              >
                Mua lại
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Shop orders detail (collapsible) ── */}
      {expanded && (
        <div className="animate-[fadeIn_0.2s_ease]">
          {order.shopOrders.map((shopOrder) => (
            <div
              key={shopOrder._id}
              className="border-b border-amber-50 last:border-b-0"
            >
              {/* Shop header */}
              <div className="flex items-center justify-between bg-amber-50/40 px-5 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-xs">
                    🏪
                  </div>
                  <span className="text-xs font-bold text-stone-700">
                    {shopOrder.shopName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <LuTruck className="text-sm" />
                  {shopOrder.shippingLabel} · {fmtPrice(shopOrder.shippingPrice)}
                </div>
              </div>

              {/* Products */}
              {shopOrder.items.map((item, idx) => (
                <div
                  key={`${shopOrder._id}-${idx}`}
                  className="flex items-center gap-3 border-b border-amber-50/60 px-5 py-3 last:border-b-0"
                >
                  <img
                    src={imgSrc(item.image)}
                    alt={item.name}
                    className="h-12 w-12 shrink-0 rounded-lg border border-amber-200 bg-amber-100 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="m-0 line-clamp-1 text-sm font-medium text-stone-800">
                      {item.name}
                    </p>
                    <p className="m-0 text-xs text-stone-400">
                      {fmtPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-stone-800">
                    {fmtPrice(item.itemTotal)}
                  </span>
                </div>
              ))}

              {/* Shop note */}
              {shopOrder.note && (
                <div className="flex items-center gap-2 bg-amber-50/20 px-5 py-2 text-xs text-stone-400">
                  <span>📝</span>
                  <span className="italic">{shopOrder.note}</span>
                </div>
              )}

              {/* Shop total row */}
              <div className="flex items-center justify-between border-t border-amber-100/60 px-5 py-2.5">
                <span className="text-xs text-stone-500">Tổng shop</span>
                <span className="text-sm font-bold text-orange-600">
                  {fmtPrice(shopOrder.shopTotal)}
                </span>
              </div>
            </div>
          ))}

          {/* ── Grand total summary ── */}
          <div className="border-t border-amber-200 bg-gradient-to-r from-amber-50/40 to-orange-50/30 px-5 py-3">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Tổng tiền sản phẩm</span>
              <span>{fmtPrice(order.subtotal)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-stone-500">
              <span>Tổng phí vận chuyển</span>
              <span>{fmtPrice(order.shippingTotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-amber-200/60 pt-2">
              <span className="text-sm font-bold text-amber-900">
                Thành tiền
              </span>
              <span className="text-base font-extrabold text-orange-600">
                {fmtPrice(order.totalPrice)}
              </span>
            </div>
          </div>

          {/* Shipping address */}
          <div className="border-t border-amber-100 px-5 py-3">
            <p className="m-0 text-xs font-semibold text-stone-600">
              📍 Địa chỉ giao hàng
            </p>
            <p className="m-0 mt-1 text-xs text-stone-500">
              {order.shippingAddress.fullName} · {order.shippingAddress.phone}
            </p>
            <p className="m-0 text-xs text-stone-400">
              {order.shippingAddress.address}
            </p>
          </div>
        </div>
      )}

      {/* Keyframe */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; max-height: 0; }
          to   { opacity: 1; max-height: 2000px; }
        }
      `}</style>

      {reviewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="m-0 text-lg font-extrabold text-stone-800">
              Đánh giá sản phẩm
            </h3>
            <p className="m-0 mt-1 line-clamp-2 text-sm text-stone-500">
              {reviewTarget.name}
            </p>

            <div className="mt-5">
              <p className="m-0 mb-2 text-sm font-semibold text-stone-700">
                Chất lượng sản phẩm
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="border-none bg-transparent p-1 text-2xl"
                    aria-label={`${star} sao`}
                  >
                    <LuStar
                      className={
                        star <= reviewRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-stone-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Bình luận
              </span>
              <textarea
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                className="w-full resize-none rounded-xl border border-amber-200 bg-amber-50/50 px-3 py-2 text-sm text-stone-800 outline-none transition focus:border-orange-500 focus:bg-white"
              />
            </label>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeReviewModal}
                className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-600 transition hover:bg-stone-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={
                  reviewSubmittingKey === `${order._id}:${getProductId(reviewTarget.product)}`
                }
                className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {reviewSubmittingKey === `${order._id}:${getProductId(reviewTarget.product)}`
                  ? "Đang gửi..."
                  : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
