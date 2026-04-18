import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { BiChevronLeft } from "react-icons/bi";
import { login } from "../assets/image/auth";

type AuthLayoutProps = Readonly<{
  children: ReactNode;
}>;


export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative overflow-hidden bg-linear-to-b from-background via-primary-soft to-background">
      <div className="pointer-events-none absolute -left-16 top-14 h-64 w-64 rounded-full bg-accent/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

      <div className="container relative py-10 md:py-14">
        <div className="grid items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-amber-200/80 bg-white/90 p-4 shadow-xl shadow-amber-100/40 backdrop-blur md:p-5">
            <div className="flex h-full flex-col">
              <Link
                href="/"
                className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-background px-3 py-1.5 text-xs font-semibold text-primary transition hover:border-amber-300 hover:bg-primary-soft"
              >
                <BiChevronLeft className="text-base" />
                Về trang chủ
              </Link>

              <div className="relative overflow-hidden rounded-[28px] border border-amber-200 bg-amber-50 min-h-100">
                <Image
                  src={login}
                  alt="Đặc sản LocalFood"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#3b220c]/80 via-[#6b3f14]/35 to-[#f6d28b]/10" />

                
              </div>

              
            </div>
          </section>

          <section className="rounded-3xl border border-amber-200/70 bg-white p-5 shadow-xl shadow-amber-200/30 md:p-8">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
