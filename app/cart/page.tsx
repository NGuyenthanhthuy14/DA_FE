"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";
import { useCart } from "@/app/hook/useCart";
import CartEmpty from "./components/CartEmpty";
import CartHeader from "./components/CartHeader";
import CartCheckbox from "./components/CartCheckbox";
import CartShopGroup from "./components/CartShopGroup";
import CartSummary from "./components/CartSummary";
import CartDeliveryInfo from "./components/CartDeliveryInfo";

export default function CartPage() {
  const {
    items,
    groupedByShop,
    selectedItems,
    selectedTotal,
    isAllSelected,
    toggleItem,
    toggleShop,
    toggleAll,
    increase,
    decrease,
    removeItem,
    removeSelected,
  } = useCart();

  const router = useRouter();

  // Phí vận chuyển dự kiến (15k / shop được chọn)
  const selectedShopIds = useMemo(() => {
    const ids = new Set<string>();
    selectedItems.forEach((item) => ids.add(item.shopId));
    return ids;
  }, [selectedItems]);

  const shippingFee = selectedShopIds.size * 15000;
  const totalWithShipping = selectedTotal + shippingFee;

  // ── Empty Cart ──
  if (items.length === 0) return <CartEmpty />;

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-start gap-7 px-4 py-8 pb-16 lg:flex-row">
      {/* ══════════════ LEFT — Main Cart ══════════════ */}
      <div className="min-w-0 flex-1">
        <CartHeader
          shopCount={groupedByShop.length}
          selectedCount={selectedItems.length}
          onRemoveSelected={removeSelected}
        />

        {/* Select All */}
        <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50/40 px-4 py-3">
          <CartCheckbox
            checked={isAllSelected}
            onChange={() => toggleAll(!isAllSelected)}
            id="select-all-cart"
          />
          <label
            htmlFor="select-all-cart"
            className="cursor-pointer select-none text-sm font-semibold text-amber-900"
          >
            Chọn tất cả ({groupedByShop.length} shop)
          </label>
        </div>

        {/* Shop Groups */}
        {groupedByShop.map((group) => (
          <CartShopGroup
            key={group.shopId}
            shopId={group.shopId}
            shopName={group.shopName}
            items={group.items}
            onToggleShop={toggleShop}
            onToggleItem={toggleItem}
            onIncrease={increase}
            onDecrease={decrease}
            onRemove={removeItem}
          />
        ))}

        {/* Continue Shopping */}
        <Link href="/" className="no-underline">
          <button
            className="mt-1 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3 font-inherit text-sm font-semibold text-amber-900 transition-all hover:border-orange-600 hover:bg-orange-50/60 hover:text-orange-600"
            type="button"
          >
            <LuArrowLeft className="text-lg" />
            Tiếp tục mua sắm
          </button>
        </Link>
      </div>

      {/* ══════════════ RIGHT — Sidebar ══════════════ */}
      <aside className="top-[100px] flex w-full shrink-0 flex-col gap-5 lg:sticky lg:w-[340px]">
        <CartSummary
          selectedCount={selectedItems.length}
          subtotal={selectedTotal}
          shippingFee={shippingFee}
          total={totalWithShipping}
          onCheckout={() => router.push("/checkout")}
        />

        <CartDeliveryInfo />

        {/* Decoration */}
        <div className="overflow-hidden rounded-2xl shadow-sm">
          <img
            src="/cart-decoration.png"
            alt="Đặc sản Việt Nam"
            className="block w-full rounded-2xl"
          />
        </div>
      </aside>
    </div>
  );
}
