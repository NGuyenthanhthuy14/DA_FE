"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { BiMap, BiMenu, BiX, BiCart } from "react-icons/bi";
import Image from "next/image";
import { logo } from "@/app/assets/image/logo";

const navItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Gần bạn", href: "/map" },
  { label: "Đặc sản", href: "/specialties" },
  { label: "Quán ăn", href: "/shops" },
  { label: "Tin tức", href: "/news" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const cartCount = 3;

  return (
    <header className="sticky top-0 z-50 border-b border-amber-200/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="relative h-12 w-36 sm:h-14 sm:w-20"
          >
            <Image
              src={logo}
              alt="LocalFood logo"
              height={50}
              width={100}
              className="object-contain object-left "
            />
          </motion.div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative text-sm font-semibold text-foreground/80 transition hover:text-primary"
            >
              <span className="after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">

          <Link
            href="/cart"
            className="relative flex items-center justify-center rounded-xl border border-amber-300 bg-white p-2 text-primary hover:bg-primary-soft"
          >
            <BiCart className="text-xl" />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>


          <Link
            href="/auth/login"
            className="rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary-soft"
          >
            Đăng nhập
          </Link>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/map"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-dark"
            >
              <BiMap className="text-lg" />
              Khám phá ngay
            </Link>
          </motion.div>
        </div>


        <button
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex rounded-xl border border-amber-300 bg-white p-2 text-primary lg:hidden"
        >
          {open ? (
            <BiX className="text-2xl" />
          ) : (
            <BiMenu className="text-2xl" />
          )}
        </button>
      </div>

      <motion.div
        initial={false}
        animate={
          open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
        }
        className="overflow-hidden border-t border-amber-200/70 bg-primary-soft lg:hidden"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:px-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-amber-100"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/cart"
            className="flex items-center justify-between rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary"
          >
            <span>Giỏ hàng</span>
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
              {cartCount}
            </span>
          </Link>

          <div className="mt-2 flex gap-3">
            <Link
              href="/login"
              className="flex-1 rounded-xl border border-amber-300 bg-white px-4 py-2 text-center text-sm font-semibold text-primary"
            >
              Đăng nhập
            </Link>
            <Link
              href="/cart"
              className="flex-1 rounded-xl bg-primary px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Thanh toán
            </Link>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
