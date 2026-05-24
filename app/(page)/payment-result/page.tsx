"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { LuCircleCheck, LuCircleX, LuClock } from "react-icons/lu";
import { useCart } from "@/app/hook/useCart";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const { removeSelected } = useCart();
  const handledRef = useRef(false);

  const status =
    searchParams.get("status") ||
    searchParams.get("return_code") ||
    searchParams.get("result");
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
    if (!isPaid || handledRef.current) return;
    handledRef.current = true;
    removeSelected();
  }, [isPaid, removeSelected]);

  const finalStatus = isPaid ? "success" : isFailed ? "failed" : "checking";
  const isSuccess = finalStatus === "success";
  const isError = finalStatus === "failed";
  const Icon = isSuccess ? LuCircleCheck : isError ? LuCircleX : LuClock;
  const title = isSuccess
    ? "Thanh toán thành công"
    : isError
      ? "Thanh toán chưa hoàn tất"
      : "Đang kiểm tra thanh toán";
  const message = isSuccess
    ? "Thanh toán đã hoàn tất. Đơn hàng của bạn đã được ghi nhận, bạn có thể xem lại trong lịch sử đặt hàng."
    : isError
      ? "Giao dịch chưa hoàn tất. Đơn hàng đã được ghi nhận và đang chờ thanh toán."
      : "Hệ thống đang nhận kết quả từ cổng thanh toán.";

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
          {title}
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
            href={isError ? "/profile" : "/"}
            className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-600 no-underline transition hover:bg-stone-50"
          >
            {isError ? "Xem đơn chờ thanh toán" : "Về trang chủ"}
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
