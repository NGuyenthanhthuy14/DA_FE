"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BiMapPin,
  BiRightArrowAlt,
  BiStar,
  BiStore,
} from "react-icons/bi";
import { NearbyProduct } from "@/app/types/api/product";
import ProductNearCard from "@/app/components/ui/productNearCard";

interface NearbyProductsSectionProps {
  products: NearbyProduct[];
  isLoading?: boolean;
  isNearby?: boolean;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + "đ";
}

export default function NearbyProductsSection({
  products,
  isLoading = false,
  isNearby = true,
}: NearbyProductsSectionProps) {
  // Luôn hiển thị section, kể cả khi rỗng (sẽ show skeleton hoặc empty state)
  const showSection = isLoading || products.length > 0;
  if (!showSection) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
        className="mb-6 flex items-end justify-between gap-4"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            {isNearby ? "Gần bạn" : "Sản phẩm"}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-dark">
            {isNearby
              ? "Sản phẩm trong bán kính 20km"
              : "Tất cả sản phẩm"}
          </h2>
          {isLoading ? (
            <p className="mt-2 text-sm text-foreground/60">
              {isNearby
                ? "Đang tìm sản phẩm gần vị trí của bạn..."
                : "Đang tải sản phẩm..."}
            </p>
          ) : (
            <p className="mt-2 text-sm text-foreground/60">
              {isNearby
                ? `Tìm thấy ${products.length} sản phẩm gần bạn`
                : `${products.length} sản phẩm`}
            </p>
          )}
        </div>

        <Link
          href="/products"
          className="hidden items-center gap-1 text-sm font-semibold text-primary transition hover:text-dark md:inline-flex"
        >
          Xem thêm
          <BiRightArrowAlt className="text-xl" />
        </Link>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-[28px] border border-amber-200 bg-white p-4"
            >
              <div className="h-44 rounded-2xl bg-gray-200" />
              <div className="mt-4 h-5 w-2/3 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
              <div className="mt-3 h-4 w-1/3 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.slice(0,4).map((product, index) => (
            <motion.article
              key={product._id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              whileHover={{ y: -8 }}
              className="group overflow-hidden rounded-[28px] border border-amber-200 bg-white shadow-sm transition hover:shadow-xl"
            >
              <div className="">
                <ProductNearCard product={product} />
              </div>
              
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}
