"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { LuPackage, LuRefreshCw } from "react-icons/lu";
import { toast } from "sonner";
import { selectUser } from "@/app/store/slices/userSlices";
import { addToCart, toggleSelectAll } from "@/app/store/slices/cartSlices";
import type { AppDispatch } from "@/app/store";
import { getOrdersByUser } from "@/apiRequest/order";
import {
  createProductReview,
  getMyProductReviews,
} from "@/apiRequest/productReview";
import OrderTabs from "./OrderTabs";
import OrderCard from "./OrderCard";
import type { OrderData } from "./OrderCard";
import type { CreateProductReviewRequest } from "@/app/types/api/productReview";

export default function OrderHistory() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const userId = user?.id || user?._id;
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [reviewedProductKeys, setReviewedProductKeys] = useState<Set<string>>(
    new Set(),
  );
  const [reviewSubmittingKey, setReviewSubmittingKey] = useState<string | null>(
    null,
  );

  const fetchOrders = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [ordersResponse, reviewsResponse] = await Promise.all([
        getOrdersByUser(userId),
        getMyProductReviews(),
      ]);

      if (ordersResponse.err === 0 && ordersResponse.data) {
        setOrders(ordersResponse.data);
      } else {
        setError(ordersResponse.mess || "Không thể tải đơn hàng");
      }

      if (reviewsResponse.err === 0 && Array.isArray(reviewsResponse.data)) {
        setReviewedProductKeys(
          new Set(
            reviewsResponse.data
              .map((review) => {
                const orderId =
                  typeof review.order === "string"
                    ? review.order
                    : review.order?._id;
                const productId =
                  typeof review.product === "string"
                    ? review.product
                    : review.product?._id;

                return orderId && productId ? `${orderId}:${productId}` : null;
              })
              .filter((key): key is string => Boolean(key)),
          ),
        );
      }
    } catch (err: unknown) {
      console.error("Fetch orders error:", err);
      setError("Có lỗi khi tải đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleReviewSubmit = async (payload: CreateProductReviewRequest) => {
    const reviewKey = `${payload.orderId}:${payload.productId}`;
    setReviewSubmittingKey(reviewKey);

    try {
      const response = await createProductReview(payload);
      if (response.err !== 0) {
        throw new Error(response.mess || "Không thể gửi đánh giá");
      }

      setReviewedProductKeys((prev) => new Set(prev).add(reviewKey));
      toast.success("Gửi đánh giá thành công");
    } catch (reviewError: unknown) {
      const message =
        reviewError instanceof Error
          ? reviewError.message
          : "Không thể gửi đánh giá";
      toast.error(message);
      throw reviewError;
    } finally {
      setReviewSubmittingKey(null);
    }
  };

  const handleReorder = (orderId: string) => {
    const order = orders.find((item) => item._id === orderId);
    if (!order) return;

    dispatch(toggleSelectAll(false));

    let itemCount = 0;
    order.shopOrders.forEach((shopOrder) => {
      shopOrder.items.forEach((item) => {
        dispatch(
          addToCart({
            productId:
              typeof item.product === "string"
                ? item.product
                : item.product._id || item.product.id || "",
            name: item.name,
            image: item.image,
            price: item.price,
            discount: 0,
            quantity: item.quantity,
            countInStock: 0,
            shopId: shopOrder.shop,
            shopName: shopOrder.shopName,
            slug: "",
          }),
        );
        itemCount += item.quantity;
      });
    });

    toast.success(`Đã thêm ${itemCount} sản phẩm vào giỏ hàng`);
    router.push("/cart");
  };

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    return orders.filter((order) => order.status === activeTab);
  }, [orders, activeTab]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    orders.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  if (loading) {
    return (
      <div>
        <h1 className="m-0 mb-5 text-xl font-extrabold text-stone-800">
          Lịch sử đặt hàng
        </h1>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-amber-200 bg-white p-5"
            >
              <div className="h-4 w-40 rounded bg-stone-200" />
              <div className="mt-3 h-3 w-56 rounded bg-stone-100" />
              <div className="mt-5 h-14 rounded-xl bg-stone-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="m-0 mb-5 text-xl font-extrabold text-stone-800">
          Lịch sử đặt hàng
        </h1>
        <div className="flex flex-col items-center rounded-2xl border border-red-200 bg-red-50 py-12 text-center">
          <p className="m-0 mb-4 text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={fetchOrders}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-orange-400 bg-white px-5 py-2 text-sm font-semibold text-orange-600 transition-all hover:bg-orange-50"
          >
            <LuRefreshCw className="text-sm" />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div>
        <h1 className="m-0 mb-5 text-xl font-extrabold text-stone-800">
          Lịch sử đặt hàng
        </h1>
        <div className="flex flex-col items-center py-16 text-center">
          <p className="m-0 text-sm text-stone-400">
            Vui lòng đăng nhập để xem lịch sử đặt hàng.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="m-0 text-xl font-extrabold text-stone-800">
          Lịch sử đặt hàng
        </h1>
        <button
          type="button"
          onClick={fetchOrders}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-500 transition-all hover:border-orange-300 hover:text-orange-600"
        >
          <LuRefreshCw className="text-sm" />
          Làm mới
        </button>
      </div>

      <OrderTabs active={activeTab} onChange={setActiveTab} counts={statusCounts} />

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <LuPackage className="mb-3 text-5xl text-stone-300" />
          <p className="m-0 text-sm font-medium text-stone-400">
            {activeTab === "all"
              ? "Bạn chưa có đơn hàng nào"
              : "Không có đơn hàng nào ở trạng thái này"}
          </p>
        </div>
      ) : (
        <>
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              reviewedProductKeys={reviewedProductKeys}
              reviewSubmittingKey={reviewSubmittingKey}
              onReviewSubmit={handleReviewSubmit}
              onReorder={handleReorder}
            />
          ))}
          <p className="mt-4 text-center text-xs text-stone-400">
            Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
          </p>
        </>
      )}
    </div>
  );
}
