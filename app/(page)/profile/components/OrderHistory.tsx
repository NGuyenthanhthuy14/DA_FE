"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { LuPackage, LuRefreshCw } from "react-icons/lu";
import { selectUser } from "@/app/store/slices/userSlices";
import { getOrdersByUser } from "@/apiRequest/order";
import OrderTabs from "./OrderTabs";
import OrderCard from "./OrderCard";
import type { OrderData } from "./OrderCard";

export default function OrderHistory() {
  const user = useSelector(selectUser);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // ── Fetch orders from API ──
  const fetchOrders = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getOrdersByUser(user.id);
      if (response.err === 0 && response.data) {
        setOrders(response.data);
      } else {
        setError(response.mess || "Không thể tải đơn hàng");
      }
    } catch (err: any) {
      console.error("Fetch orders error:", err);
      setError("Có lỗi khi tải đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // ── Filter orders by tab ──
  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  // ── Count per status for tab badges ──
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  // ── Loading state ──
  if (loading) {
    return (
      <div>
        <h1 className="m-0 mb-5 text-xl font-extrabold text-stone-800">
          Lịch sử đặt hàng
        </h1>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-amber-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="h-4 w-40 rounded bg-stone-200" />
                  <div className="mt-2 h-3 w-32 rounded bg-stone-100" />
                  <div className="mt-2 h-4 w-28 rounded bg-stone-200" />
                </div>
                <div className="h-6 w-24 rounded-lg bg-stone-100" />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-stone-100" />
                <div className="flex-1">
                  <div className="h-3 w-48 rounded bg-stone-100" />
                  <div className="mt-1 h-3 w-24 rounded bg-stone-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div>
        <h1 className="m-0 mb-5 text-xl font-extrabold text-stone-800">
          Lịch sử đặt hàng
        </h1>
        <div className="flex flex-col items-center rounded-2xl border border-red-200 bg-red-50 py-12 text-center">
          <span className="mb-3 text-4xl">⚠️</span>
          <p className="m-0 mb-4 text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={fetchOrders}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-orange-400 bg-white px-5 py-2 font-inherit text-sm font-semibold text-orange-600 transition-all hover:bg-orange-50"
          >
            <LuRefreshCw className="text-sm" />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // ── Not logged in ──
  if (!user?.id) {
    return (
      <div>
        <h1 className="m-0 mb-5 text-xl font-extrabold text-stone-800">
          Lịch sử đặt hàng
        </h1>
        <div className="flex flex-col items-center py-16 text-center">
          <span className="mb-3 text-5xl">🔒</span>
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
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 font-inherit text-xs font-medium text-stone-500 transition-all hover:border-orange-300 hover:text-orange-600"
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
            <OrderCard key={order._id} order={order} />
          ))}
          <p className="mt-4 text-center text-xs text-stone-400">
            📦 Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
          </p>
        </>
      )}
    </div>
  );
}
