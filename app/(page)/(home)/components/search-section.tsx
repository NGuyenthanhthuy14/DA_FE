"use client";

import { motion } from "framer-motion";
import { BiMapPin, BiSearch } from "react-icons/bi";
import { searchCategories } from "./home-data";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function SearchSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-7xl px-4 py-12 md:px-6"
    >
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
          Tìm nhanh
        </p>
        <h2 className="mt-2 text-3xl font-bold text-dark">
          Bạn muốn ăn gì hôm nay?
        </h2>
      </div>

      <div className="rounded-[28px] border border-amber-200 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <motion.div
            whileFocus={{ scale: 1.01 }}
            className="flex flex-1 items-center gap-3 rounded-2xl border border-amber-200 bg-primary-soft px-4 py-3 transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30"
          >
            <BiSearch className="text-xl text-foreground/50" />
            <input
              type="text"
              placeholder="Tìm món ăn, quán ăn, đặc sản địa phương..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
            />
          </motion.div>

          <motion.div
            whileFocus={{ scale: 1.01 }}
            className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-primary-soft px-4 py-3 transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30 lg:min-w-65"
          >
            <BiMapPin className="text-xl text-foreground/50" />
            <input
              type="text"
              placeholder="Nhập khu vực của bạn"
              className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
            />
          </motion.div>

          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-dark"
          >
            Tìm kiếm
          </motion.button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {searchCategories.map((item, index) => (
            <motion.button
              key={item}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -3 }}
              className="rounded-full border border-amber-200 bg-background px-4 py-2 text-sm font-medium text-primary transition hover:border-accent hover:bg-primary-soft"
            >
              {item}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
