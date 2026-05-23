"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LuCircleCheck, LuCircleX, LuClock } from "react-icons/lu";
import { createOrder } from "@/apiRequest/order";
import { useCart } from "@/app/hook/useCart";
import {
  clearPendingZaloPayOrder,
  getPendingZaloPayOrder,
} from "@/app/utils/zalopayCheckout";

type FinalStatus = "checking" | "creating" | "success" | "failed";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const { removeSelected } = useCart();
  const submittedRef = useRef(false);
  const [finalStatus, setFinalStatus] = useState<FinalStatus>("checking");
  const [message, setMessage] = useState(
    "Hệ thống đang nhận kết quả từ cổng thanh toán.",
  );

  const status =
    searchParams.get("status") ||
    searchParams.get("return_code") ||
    searchParams.get("result");
  const checkoutOrderId = searchParams.get("checkoutOrderId");
  const isPaid =
    status === "1" ||
    status === "success" ||
    status === "paid" ||
    Boolean(searchParams.get("zp_trans_id"));
  const isFailed =
    status === "-1" ||
    status === "0" ||
    status === "failed" ||
    status === "cancel";

  useEffect(() => {
    if (submittedRef.current) return;

    if (isFailed) {
      clearPendingZaloPayOrder(checkoutOrderId);
      setFinalStatus("failed");
      setMessage("Giao dịch chưa hoàn tất. Đơn hàng chưa được tạo.");
      return;
    }

    if (!isPaid) {
      setFinalStatus("checking");
      return;
    }

    const pendingOrder = getPendingZaloPayOrder(checkoutOrderId);
    if (!pendingOrder) {
      setFinalStatus("success");
      setMessage(
        "Thanh toán đã hoàn tất. Nếu đơn hàng chưa xuất hiện, vui lòng kiểm tra lại lịch sử đơn hàng sau ít phút.",
      );
      return;
    }

    submittedRef.current = true;
    setFinalStatus("creating");
    setMessage("Thanh toán thành công. Hệ thống đang tạo đơn hàng...");

    const orderToCreate = pendingOrder;

    async function createPaidOrder() {
      try {
        const response = await createOrder(orderToCreate.orderPayload);

        if (response.err !== 0) {
          throw new Error(response.mess || "Không thể tạo đơn hàng");
        }

        clearPendingZaloPayOrder(orderToCreate.paymentOrderId);
        removeSelected();
        setFinalStatus("success");
        setMessage(
          "Đơn hàng của bạn đã được ghi nhận. Bạn có thể xem lại trong lịch sử đặt hàng.",
        );
      } catch (error: unknown) {
        submittedRef.current = false;
        setFinalStatus("failed");
        setMessage(
          error instanceof Error
            ? error.message
            : "Thanh toán đã thành công nhưng tạo đơn hàng thất bại.",
        );
      }
    }

    createPaidOrder();
  }, [checkoutOrderId, isFailed, isPaid, removeSelected]);

  const isSuccess = finalStatus === "success";
  const isError = finalStatus === "failed";
  const Icon = isSuccess ? LuCircleCheck : isError ? LuCircleX : LuClock;

  return (
    <main className="min-h-screen bg-[#fdf8f3] px-4 py-16">
      <section className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
        <div
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${
            isSuccess
              ? "bg-green-100 text-green-600"
              : isError
                ? "bg-red-100 text-red-600"
                : "bg-amber-100 text-amber-700"
          }`}
        >
          <Icon className="text-3xl" />
        </div>

        <h1 className="m-0 text-2xl font-extrabold text-stone-900">
          {isSuccess
            ? "Thanh toán thành công"
            : isError
              ? "Thanh toán chưa hoàn tất"
              : finalStatus === "creating"
                ? "Đang tạo đơn hàng"
                : "Đang kiểm tra thanh toán"}
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-stone-500">
          {message}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white no-underline transition hover:bg-orange-700"
          >
            Xem đơn hàng
          </Link>
          <Link
            href={isError ? "/checkout" : "/"}
            className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-600 no-underline transition hover:bg-stone-50"
          >
            {isError ? "Quay lại thanh toán" : "Về trang chủ"}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fdf8f3] px-4 py-16">
          <section className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-stone-500">
              Đang tải kết quả thanh toán...
            </p>
          </section>
        </main>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
