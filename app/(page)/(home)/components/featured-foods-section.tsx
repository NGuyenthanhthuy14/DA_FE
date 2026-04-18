"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BiRightArrowAlt } from "react-icons/bi";
import {
  featuredFoods as fallbackSpecialties,
  type FeaturedFood,
} from "./home-data";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

interface FeaturedFoodsSectionProps {
  specialties: FeaturedFood[];
  isLoading?: boolean;
}

export default function FeaturedFoodsSection({
  specialties,
  isLoading = false,
}: FeaturedFoodsSectionProps) {
  const foods = specialties.length > 0 ? specialties : fallbackSpecialties;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
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
            Đặc sản khu vực
          </p>
          <h2 className="mt-2 text-3xl font-bold text-dark">
            Gợi ý món nên thử quanh vị trí của bạn
          </h2>
          {isLoading ? (
            <p className="mt-2 text-sm text-foreground/60">
              Đang cập nhật đặc sản theo GPS...
            </p>
          ) : null}
        </div>

        <Link
          href="/foods"
          className="hidden items-center gap-1 text-sm font-semibold text-primary transition hover:text-dark md:inline-flex"
        >
          Xem tất cả
          <BiRightArrowAlt className="text-xl" />
        </Link>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {foods.map((food, index) => (
          <motion.article
            key={food.id}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group overflow-hidden rounded-[28px] border border-amber-200 bg-white shadow-sm transition hover:shadow-xl"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={food.image}
                alt={food.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-dark">
                {food.location}
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold text-dark">{food.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground/70">
                {food.description}
              </p>

              <Link
                href={`/foods/${food.id}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-dark"
              >
                Xem chi tiết
                <BiRightArrowAlt className="text-lg transition group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
