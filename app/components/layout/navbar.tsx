"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BiMap,
  BiMenu,
  BiX,
  BiCart,
  BiChevronDown,
  BiUserCircle,
  BiHeart,
  BiLogOut,
} from "react-icons/bi";
import Image from "next/image";
import { logo } from "@/app/assets/image/logo";
import { useUser } from "@/app/hook/useUser";

const navItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/product" },
  { label: "Đặc sản", href: "/specialties" },
  { label: "Quán ăn", href: "/shops" },
  { label: "Tin tức", href: "/news" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

export default function Navbar() {
  const { user, isAuthenticated, logoutHook } = useUser();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const cartCount = 3;
  const canShowAuthenticatedUI = isClientMounted && isAuthenticated;

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logoutHook();
    setOpen(false);
    setOpenDropdown(false);
    router.push("/auth/login");
    router.refresh();
  };

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
              className="object-contain object-left"
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
          {canShowAuthenticatedUI ? (
            <>
              <Link
                href="/cart"
                className="relative flex items-center justify-center rounded-xl border border-amber-300 bg-white p-2 text-primary transition hover:bg-primary-soft"
              >
                <BiCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setOpenDropdown((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary-soft"
                >
                  <BiUserCircle className="text-xl" />
                  <span className="max-w-32 truncate">
                    {user?.full_name || "Tài khoản"}
                  </span>
                  <BiChevronDown
                    className={`text-lg transition-transform duration-200 ${
                      openDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openDropdown && (
                  <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-60 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
                    <div className="border-b border-amber-100 bg-amber-50/60 px-4 py-3">
                      <p className="truncate text-sm font-bold text-dark">
                        {user?.full_name || "Người dùng"}
                      </p>
                      <p className="truncate text-xs text-foreground/60">
                        {user?.email || ""}
                      </p>
                    </div>

                    <div className="p-2">
                      <Link
                        href="/profile"
                        onClick={() => setOpenDropdown(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition hover:bg-amber-50 hover:text-primary"
                      >
                        <BiUserCircle className="text-lg" />
                        <span>Thông tin cá nhân</span>
                      </Link>

                      <Link
                        href="/favorites"
                        onClick={() => setOpenDropdown(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/80 transition hover:bg-amber-50 hover:text-primary"
                      >
                        <BiHeart className="text-lg" />
                        <span>Yêu thích</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                      >
                        <BiLogOut className="text-lg" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary-soft"
            >
              Đăng nhập
            </Link>
          )}

        </div>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex rounded-xl border border-amber-300 bg-white p-2 text-primary lg:hidden"
        >
          {open ? <BiX className="text-2xl" /> : <BiMenu className="text-2xl" />}
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

          {canShowAuthenticatedUI ? (
            <>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary"
              >
                <span>Giỏ hàng</span>
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {cartCount}
                </span>
              </Link>

              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary"
              >
                Thông tin cá nhân
              </Link>

              <Link
                href="/favorites"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary"
              >
                Yêu thích
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-red-200 bg-white px-4 py-2 text-left text-sm font-semibold text-red-500"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-amber-300 bg-white px-4 py-2 text-center text-sm font-semibold text-primary"
            >
              Đăng nhập
            </Link>
          )}


        </div>
      </motion.div>
    </header>
  );
}