"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BiMap, BiStore } from "react-icons/bi";

export default function CtaSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65 }}
      className="mx-auto max-w-7xl px-4 pb-14 md:px-6"
    >
      <div className="rounded-4xl border border-amber-200 bg-primary px-6 py-10 text-white shadow-xl shadow-primary/10 md:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent/80">
              Sẵn sàng khám phá?
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Cùng trải nghiệm hành trình ẩm thực địa phương theo cách thông
              minh hơn
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/90 md:text-base">
              Tìm món ngon, quán ăn và đặc sản vùng miền gần bạn với bản đồ số,
              bộ lọc thông minh và chatbot AI hỗ trợ tức thì.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <motion.div
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/map"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-dark transition hover:bg-accent/90"
              >
                <BiMap className="text-lg" />
                Mở bản đồ ngay
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/shops"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                <BiStore className="text-lg" />
                Xem quán nổi bật
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
