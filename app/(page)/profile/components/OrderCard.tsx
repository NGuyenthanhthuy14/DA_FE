"use client";

import React, { useState } from "react";
import {
  LuCircleCheck,
  LuShoppingBag,
  LuStar,
  LuStore,
  LuTruck,
} from "react-icons/lu";

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

function fmtPrice(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

const STATUS_MAP: Record<
  OrderData["status"],
  { headline: string; label: string; tone: string }
> = {
  pending: {
    headline: "Đơn hàng đang chờ xác nhận",
    label: "CHỜ XÁC NHẬN",
    tone: "text-amber-600",
  },
  confirmed: {
    headline: "Đơn hàng đã được xác nhận",
    label: "ĐÃ XÁC NHẬN",
    tone: "text-sky-600",
  },
  shipping: {
    headline: "Đơn hàng đang được giao",
    label: "ĐANG GIAO",
    tone: "text-sky-600",
  },
  delivered: {
    headline: "Giao hàng thành công",
    label: "HOÀN THÀNH",
    tone: "text-emerald-600",
  },
  cancelled: {
    headline: "Đơn hàng đã huỷ",
    label: "ĐÃ HUỶ",
    tone: "text-stone-500",
  },
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
  const [reviewTarget, setReviewTarget] = useState<OrderItemData | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const statusInfo = STATUS_MAP[order.status] ?? STATUS_MAP.pending;
  const isDelivered = order.status === "delivered" || order.isDelivered;
  const canReorder = order.status === "delivered" || order.status === "cancelled";

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
    <>
      {order.shopOrders.map((shopOrder) => {
        const unreviewedItem = shopOrder.items.find(
          (item) =>
            !reviewedProductKeys?.has(
              `${order._id}:${getProductId(item.product)}`,
            ),
        );
        const hasUnreviewedItem = Boolean(unreviewedItem);

        return (
          <article
            key={shopOrder._id}
            className="mb-4 overflow-hidden border border-stone-200 bg-white shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-2">
                <LuStore className="shrink-0 text-base text-stone-600" />
                <span className="truncate text-sm font-extrabold text-stone-900">
                  {shopOrder.shopName}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 text-xs sm:gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 ${statusInfo.tone}`}
                >
                  {isDelivered ? (
                    <LuTruck className="text-base" />
                  ) : (
                    <LuShoppingBag className="text-base" />
                  )}
                  {statusInfo.headline}
                </span>
                <span className="h-4 w-px bg-stone-200" />
                <span className="font-medium uppercase text-orange-600">
                  {statusInfo.label}
                </span>
              </div>
            </div>

            <div className="divide-y divide-stone-100">
              {shopOrder.items.map((item, index) => (
                <div
                  key={`${shopOrder._id}-${index}`}
                  className="flex gap-3 px-4 py-4 sm:px-5"
                >
                  <img
                    src={imgSrc(item.image)}
                    alt={item.name}
                    className="h-20 w-20 shrink-0 border border-stone-200 bg-stone-50 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                      <div className="min-w-0">
                        <p className="m-0 line-clamp-2 text-sm leading-5 text-stone-900">
                          {item.name}
                        </p>
                        <p className="m-0 mt-1 text-sm text-stone-500">
                          Phân loại hàng: {shopOrder.shippingLabel}
                        </p>
                        <p className="m-0 mt-1 text-sm text-stone-900">
                          x{item.quantity}
                        </p>
                      </div>

                      <div className="shrink-0 text-left sm:text-right">
                        <span className="text-sm text-orange-600">
                          {fmtPrice(item.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {shopOrder.note && (
              <div className="border-t border-stone-100 bg-stone-50 px-4 py-2 text-xs text-stone-500 sm:px-5">
                Ghi chú: {shopOrder.note}
              </div>
            )}

            <div className="border-t border-stone-200 bg-white">
              <div className="flex items-center justify-end gap-3 px-4 py-3 sm:px-5">
                <span className="text-sm text-stone-900">Thành tiền:</span>
                <span className="text-2xl font-medium text-orange-600">
                  {fmtPrice(shopOrder.shopTotal)}
                </span>
              </div>

              <div className="flex flex-col gap-3 border-t border-stone-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="text-xs text-stone-500">
                  Mã đơn: #{order._id.slice(-8).toUpperCase()}
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  {isDelivered && onReviewSubmit && (
                    <button
                      type="button"
                      disabled={!hasUnreviewedItem}
                      onClick={() => {
                        if (unreviewedItem) openReviewModal(unreviewedItem);
                      }}
                      className="min-w-36 cursor-pointer border border-orange-600 bg-orange-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-100 disabled:text-stone-400"
                    >
                      {hasUnreviewedItem ? "Đánh Giá" : "Đã Đánh Giá"}
                    </button>
                  )}

                  {canReorder && (
                    <button
                      type="button"
                      onClick={() => onReorder?.(order._id)}
                      className="min-w-28 cursor-pointer border border-stone-200 bg-white px-5 py-2 text-sm font-medium text-stone-700 transition hover:border-orange-300 hover:text-orange-600"
                    >
                      Mua Lại
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        );
      })}

      {reviewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                <LuCircleCheck />
              </div>
              <div className="min-w-0">
                <h3 className="m-0 text-lg font-extrabold text-stone-800">
                  Đánh giá sản phẩm
                </h3>
                <p className="m-0 mt-1 line-clamp-2 text-sm text-stone-500">
                  {reviewTarget.name}
                </p>
              </div>
            </div>

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
                className="w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-800 outline-none transition focus:border-orange-500 focus:bg-white"
              />
            </label>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeReviewModal}
                className="border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-600 transition hover:bg-stone-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={
                  reviewSubmittingKey ===
                  `${order._id}:${getProductId(reviewTarget.product)}`
                }
                className="bg-orange-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {reviewSubmittingKey ===
                `${order._id}:${getProductId(reviewTarget.product)}`
                  ? "Đang gửi..."
                  : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
