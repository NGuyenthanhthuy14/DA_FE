"use client";

import { useState } from "react";
import {
  BiStar,
  BiSolidStar,
  BiShoppingBag,
  BiMinus,
  BiPlus,
  BiShieldAlt2,
  BiLeaf,
  BiCart,
} from "react-icons/bi";
import { LuFlame, LuTruck, LuRotateCcw } from "react-icons/lu";
import { useCart } from "@/app/hook/useCart";

function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + "đ";
}

function formatRating(rating: number): string {
  return rating.toFixed(1);
}

interface ProductInfoProps {
  productId: string;
  name: string;
  slug: string;
  image: string;
  type?: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  sold?: number;
  discount?: number;
  countInStock?: number;
  description?: string;
  shopId: string;
  shopName: string;
}

const WEIGHT_OPTIONS = ["250g", "500g", "1kg"];

export default function ProductInfo({
  productId,
  name,
  slug,
  image,
  type,
  price,
  rating = 0,
  reviewCount = 0,
  sold = 0,
  discount = 0,
  countInStock = 0,
  shopId,
  shopName,
}: ProductInfoProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(WEIGHT_OPTIONS[0]);

  const discountedPrice =
    discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () =>
    setQuantity((q) =>
      countInStock > 0 ? Math.min(countInStock, q + 1) : q + 1
    );

  const handleAddToCart = () => {
    addItem({
      productId,
      name,
      slug,
      image,
      price,
      discount,
      countInStock,
      shopId,
      shopName,
      quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // TODO: redirect to /cart or /checkout
  };

  return (
    <div className="rounded-3xl  p-6 lg:p-7">
      <div className="space-y-5">
        {type && (
          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
            Đặc sản {type}
          </span>
        )}

        <div>
          <h1 className="text-3xl font-extrabold leading-tight text-dark">
            {name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#7c5a3a]">
            <span className="inline-flex items-center gap-1.5">
              <span className="border-b border-stone-900 pr-0.5 text-base font-bold leading-5 text-stone-950">
                {formatRating(rating)}
              </span>
              <span className="inline-flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  index < Math.round(rating) ? (
                    <BiSolidStar
                      key={index}
                      className="text-base text-[#f59e0b]"
                    />
                  ) : (
                    <BiStar
                      key={index}
                      className="text-base text-[#8a6a4d]"
                    />
                  )
                ))}
              </span>
            </span>

            <span>({reviewCount} đánh giá)</span>

            <span className="h-4 w-px bg-amber-200" />

            <span>Đã bán {sold}</span>
          </div>
        </div>

        <div className="text-3xl font-extrabold text-[#b33a00]">
          {formatPrice(discountedPrice)}
        </div>

        <div className="grid grid-cols-3 overflow-hidden rounded-2xl bg-primary-soft">
          <FeatureItem
            icon={<BiLeaf />}
            title="100%"
            desc="thịt trâu tươi"
          />
          <FeatureItem
            icon={<LuFlame />}
            title="Gác bếp"
            desc="truyền thống"
          />
          <FeatureItem
            icon={<BiShieldAlt2 />}
            title="Không chất"
            desc="bảo quản"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-dark">Khối lượng</p>

          <div className="flex gap-3">
            {WEIGHT_OPTIONS.map((weight) => (
              <button
                key={weight}
                type="button"
                onClick={() => setSelectedWeight(weight)}
                className={`h-10 min-w-[82px] rounded-xl border px-5 text-sm font-semibold transition ${
                  selectedWeight === weight
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-amber-200 bg-white text-[#7c5a3a] hover:border-primary"
                }`}
              >
                {weight}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-dark">Số lượng</p>

          <div className="inline-flex overflow-hidden rounded-xl border border-amber-200 bg-white">
            <button
              type="button"
              onClick={decreaseQty}
              className="flex h-10 w-11 items-center justify-center text-[#8a6a4d] hover:bg-primary-soft"
            >
              <BiMinus />
            </button>

            <span className="flex h-10 w-14 items-center justify-center border-x border-amber-200 text-sm font-bold text-dark">
              {quantity}
            </span>

            <button
              type="button"
              onClick={increaseQty}
              className="flex h-10 w-11 items-center justify-center text-[#8a6a4d] hover:bg-primary-soft"
            >
              <BiPlus />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-white text-sm font-extrabold text-primary transition hover:bg-primary-soft"
          >
            <BiCart className="text-xl" />
            Thêm vào giỏ hàng
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-extrabold text-white shadow-sm transition hover:bg-dark"
          >
            <BiShoppingBag className="text-xl" />
            Mua ngay
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-primary-soft p-4">
          <InfoItem
            icon={<LuTruck />}
            title="Giao hàng toàn quốc"
            desc="Nhận hàng từ 2 - 4 ngày"
          />

          <InfoItem
            icon={<LuRotateCcw />}
            title="Đổi trả dễ dàng"
            desc="Trong 7 ngày"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 border-r border-amber-200 px-3 py-5 text-center last:border-r-0">
      <div className="text-2xl text-primary">{icon}</div>
      <p className="text-xs font-extrabold text-primary">{title}</p>
      <p className="text-[11px] leading-4 text-[#7c5a3a]">{desc}</p>
    </div>
  );
}

function InfoItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-2xl text-primary">{icon}</div>
      <div>
        <p className="text-xs font-extrabold text-primary">{title}</p>
        <p className="mt-0.5 text-[11px] text-[#7c5a3a]">{desc}</p>
      </div>
    </div>
  );
}
