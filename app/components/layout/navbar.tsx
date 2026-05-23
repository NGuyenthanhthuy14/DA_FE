"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BiMenu,
  BiX,
  BiCart,
  BiUserCircle,
  BiHeart,
  BiLogOut,
  BiSearch,
  BiHomeAlt,
  BiStore,
  BiNews,
  BiGridAlt,
} from "react-icons/bi";
import { GiNoodles } from "react-icons/gi";
import Image from "next/image";
import { logo } from "@/app/assets/image/logo";
import { useUser } from "@/app/hook/useUser";
import { useCart } from "@/app/hook/useCart";

/* ── Navigation items with icons ── */

const navItems = [
  { label: "Trang chủ", href: "/", icon: BiHomeAlt },
  { label: "Đặc sản theo vùng", href: "/specialties", icon: GiNoodles },
  { label: "Sản phẩm", href: "/products", icon: BiGridAlt },
  { label: "Quán ăn", href: "/stores", icon: BiStore },
  { label: "Tin tức", href: "/news", icon: BiNews },
];

export default function Navbar() {
  const { user, isAuthenticated, logoutHook } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { cartCount } = useCart();
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

  const handleLoginClick = () => {
    setOpen(false);
    setOpenDropdown(false);
    router.push("/auth/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setOpen(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="border-b border-amber-100">
        <div className="container flex items-center gap-4 px-4 py-3 md:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image
              src={logo}
              alt="Đặc sản vùng miền"
              height={40}
              width={45}
              className="object-contain"
            />
            <div className="hidden sm:block">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Đặc sản
              </p>
              <p className="text-sm font-extrabold uppercase leading-tight text-[#5a3e2b]">
                Vùng miền
              </p>
            </div>
          </Link>

          <form
            onSubmit={handleSearch}
            className="relative mx-auto flex w-full max-w-lg"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm quán ăn, món ngon, vùng miền..."
              className="h-10 w-full rounded-l-full border border-amber-200 bg-amber-50/40 pl-5 pr-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
            <button
              type="submit"
              className="flex h-10 w-11 shrink-0 items-center justify-center rounded-r-full border border-l-0 border-amber-200 bg-amber-50/40 text-primary transition hover:bg-primary hover:text-white"
            >
              <BiSearch className="text-lg" />
            </button>
          </form>

          <div className="hidden shrink-0 items-center gap-4 lg:flex">
            {canShowAuthenticatedUI && (
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#5a3e2b]"
              >
                <div className="relative">
                  <BiCart className="text-2xl" />
                  {cartCount > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold">Giỏ hàng</span>
              </Link>
            )}

            {canShowAuthenticatedUI ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setOpenDropdown((prev) => !prev)}
                  className="flex flex-col items-center gap-0.5 text-[#5a3e2b] transition hover:text-primary"
                >
                  <BiUserCircle className="text-2xl" />
                  <span className="max-w-20 truncate text-[11px] font-semibold">
                    {user?.full_name || "Tài khoản"}
                  </span>
                </button>

                {openDropdown && (
                  <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-60 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
                    <div className="border-b border-amber-100 bg-amber-50/60 px-4 py-3">
                      <p className="truncate text-sm font-bold text-[#5a3e2b]">
                        {user?.full_name || "Người dùng"}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user?.email || ""}
                      </p>
                    </div>

                    <div className="p-2">
                      <Link
                        href="/profile"
                        onClick={() => setOpenDropdown(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-amber-50 hover:text-primary"
                      >
                        <BiUserCircle className="text-lg" />
                        <span>Cá nhân</span>
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
            ) : (
              <button
                type="button"
                onClick={handleLoginClick}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border-none bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#5a3e2b]"
              >
                <BiUserCircle className="text-lg" />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            {!canShowAuthenticatedUI && (
              <button
                type="button"
                onClick={handleLoginClick}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-none bg-primary px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#5a3e2b]"
              >
                <BiUserCircle className="text-base" />
                Đăng nhập
              </button>
            )}
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex rounded-xl border border-amber-200 bg-white p-2 text-primary"
            >
              {open ? (
                <BiX className="text-2xl" />
              ) : (
                <BiMenu className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden border-b border-amber-100 bg-white lg:block ">
        <nav className="container flex  items-center justify-between gap-1 px-4 md:px-6">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-semibold transition ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "text-[#5a3e2b] hover:bg-amber-50 hover:text-primary"
                }`}
              >
                <Icon className="text-base" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ═══ Mobile menu ═══ */}
      <motion.div
        initial={false}
        animate={
          open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
        }
        className="overflow-hidden border-t border-amber-100 bg-amber-50/30 lg:hidden"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 md:px-6">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-primary text-white"
                    : "text-[#5a3e2b] hover:bg-amber-100"
                }`}
                onClick={() => setOpen(false)}
              >
                <Icon className="text-lg" />
                {item.label}
              </Link>
            );
          })}

          <div className="my-1 h-px bg-amber-200" />

          {canShowAuthenticatedUI ? (
            <>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary"
              >
                <span className="flex items-center gap-2">
                  <BiCart className="text-lg" />
                  Giỏ hàng
                </span>
                {cartCount > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary"
              >
                <BiUserCircle className="text-lg" />
                Thông tin cá nhân
              </Link>

              <Link
                href="/favorites"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary"
              >
                <BiHeart className="text-lg" />
                Yêu thích
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-left text-sm font-semibold text-red-500"
              >
                <BiLogOut className="text-lg" />
                Đăng xuất
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleLoginClick}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-left text-sm font-semibold text-primary"
            >
              <BiUserCircle className="text-lg" />
              Đăng nhập
            </button>
          )}
        </div>
      </motion.div>
    </header>
  );
}
