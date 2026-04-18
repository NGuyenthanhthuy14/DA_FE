"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BiLogoFacebook,
  BiLogoInstagram,
  BiLogoTiktok,
  BiMapPin,
  BiPhone,
  BiEnvelope,
  BiRestaurant,
} from "react-icons/bi";

const quickLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Khám phá gần bạn", href: "/map" },
  { label: "Quán ăn", href: "/shops" },
  { label: "Đặc sản", href: "/foods" },
  { label: "Chatbot AI", href: "/chatbot" },
];

const exploreLinks = [
  { label: "Ẩm thực miền Bắc", href: "/foods?region=north" },
  { label: "Ẩm thực miền Trung", href: "/foods?region=central" },
  { label: "Ẩm thực miền Nam", href: "/foods?region=south" },
  { label: "Đặc sản địa phương", href: "/foods?type=local" },
  { label: "Quán gần bạn", href: "/shops?nearby=true" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-amber-200 bg-dark text-amber-50">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-accent blur-3xl" />
        <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-amber-300 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: -8, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 260 }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-dark shadow-lg"
              >
                <BiRestaurant className="text-2xl" />
              </motion.div>

              <div>
                <h3 className="text-xl font-extrabold text-white">LocalFood</h3>
                <p className="text-sm text-amber-100/80">
                  Khám phá ẩm thực Việt quanh bạn
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-amber-50/80">
              Nền tảng hỗ trợ người dùng tìm kiếm quán ăn, món ngon và đặc sản
              địa phương theo vị trí hiện tại, kết hợp bản đồ số và chatbot AI
              để nâng cao trải nghiệm khám phá ẩm thực vùng miền.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: <BiLogoFacebook />, href: "#" },
                { icon: <BiLogoInstagram />, href: "#" },
                { icon: <BiLogoTiktok />, href: "#" },
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  whileHover={{ y: -4, scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-300/30 bg-white/10 text-xl text-amber-50 transition hover:bg-accent hover:text-dark"
                >
                  {item.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white">Liên kết nhanh</h4>
            <div className="mt-5 flex flex-col gap-3">
              {quickLinks.map((item) => (
                <motion.div key={item.label} whileHover={{ x: 4 }}>
                  <Link
                    href={item.href}
                    className="text-sm text-amber-50/80 transition hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white">Khám phá</h4>
            <div className="mt-5 flex flex-col gap-3">
              {exploreLinks.map((item) => (
                <motion.div key={item.label} whileHover={{ x: 4 }}>
                  <Link
                    href={item.href}
                    className="text-sm text-amber-50/80 transition hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white">Liên hệ</h4>
            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-white/10 p-2 text-accent">
                  <BiMapPin className="text-lg" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Địa chỉ</p>
                  <p className="text-sm leading-6 text-amber-50/80">
                    Hà Nội, Việt Nam
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-white/10 p-2 text-accent">
                  <BiPhone className="text-lg" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Số điện thoại
                  </p>
                  <p className="text-sm leading-6 text-amber-50/80">
                    0123 456 789
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-white/10 p-2 text-accent">
                  <BiEnvelope className="text-lg" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Email</p>
                  <p className="text-sm leading-6 text-amber-50/80">
                    localfood@example.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-amber-300/20 pt-6">
          <div className="flex flex-col gap-3 text-center text-sm text-amber-50/70 md:flex-row md:items-center md:justify-between md:text-left">
            <p>© 2026 LocalFood. All rights reserved.</p>
            <div className="flex items-center justify-center gap-4 md:justify-end">
              <Link href="/privacy" className="transition hover:text-accent">
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="transition hover:text-accent">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
