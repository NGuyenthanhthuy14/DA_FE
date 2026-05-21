"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BiMapPin,
  BiMessageRoundedDots,
  BiRightArrowAlt,
} from "react-icons/bi";
import { NearbyProductShop } from "@/app/types/api/product";

interface NearbyShopsSectionProps {
  shops: NearbyProductShop[];
  chatbotSuggestions: string[];
  areaLabel: string;
  isLoading?: boolean;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function fallbackSuggestions(areaLabel: string): string[] {
  return [
    `Ở ${areaLabel} có quán nào đang mở cửa?`,
    "Nên ăn món gì nếu đi theo nhóm 3-4 người?",
    "Quán nào giá hợp lý và có chỗ gửi xe?",
  ];
}

const FALLBACK_SHOP_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop";

export default function NearbyShopsSection({
  shops,
  chatbotSuggestions,
  areaLabel,
  isLoading = false,
}: NearbyShopsSectionProps) {
  const hints =
    chatbotSuggestions.length > 0
      ? chatbotSuggestions.slice(0, 3)
      : fallbackSuggestions(areaLabel);

  const showSection = isLoading || shops.length > 0;
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
            Gần bạn
          </p>
          <h2 className="mt-2 text-3xl font-bold text-dark">
            Quán ăn nổi bật quanh khu vực
          </h2>
          {isLoading ? (
            <p className="mt-2 text-sm text-foreground/60">
              Đang cập nhật danh sách quán theo GPS...
            </p>
          ) : null}
        </div>

        <Link
          href="/shops"
          className="hidden items-center gap-1 text-sm font-semibold text-primary transition hover:text-dark md:inline-flex"
        >
          Xem thêm
          <BiRightArrowAlt className="text-xl" />
        </Link>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-5">
          {shops.slice(0,2).map((shop, index) => (
            <motion.article
              key={shop._id}
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="group grid overflow-hidden rounded-[28px] border border-amber-200 bg-white shadow-sm transition hover:shadow-lg md:grid-cols-[260px_1fr]"
            >
              <div className="overflow-hidden">
                <img
                  src={shop.cover_image || FALLBACK_SHOP_IMAGE}
                  alt={shop.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold text-dark">{shop.name}</h3>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-stone-600">
                  <BiMapPin className="text-base text-primary" />
                  {shop.formatted_address || shop.address}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={`/stores/${shop.slug}`}
                      className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-dark"
                    >
                      Xem quán
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/map"
                      className="rounded-xl border border-amber-300 bg-background px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary-soft"
                    >
                      Xem trên bản đồ
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -4 }}
          className="rounded-[28px] border border-amber-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="rounded-2xl bg-accent/30 p-3 text-primary"
            >
              <BiMessageRoundedDots className="text-2xl" />
            </motion.div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Chatbot AI
              </p>
              <h3 className="text-xl font-bold text-dark">
                Gợi ý hội thoại theo vị trí {areaLabel}
              </h3>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {hints.map((hint, index) => (
              <motion.div
                key={hint}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={
                  index % 2 === 0
                    ? "rounded-2xl bg-gray-soft px-4 py-3 text-sm text-foreground/80"
                    : "rounded-2xl bg-background px-4 py-3 text-sm text-foreground/80"
                }
              >
                {hint}
              </motion.div>
            ))}
          </div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/chatbot"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-dark transition hover:bg-accent/90"
            >
              <BiMessageRoundedDots className="text-lg" />
              Bắt đầu trò chuyện
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
