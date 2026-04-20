"use client";
import { toast } from "sonner"

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { BiLockAlt, BiMailSend, BiPhone, BiUser } from "react-icons/bi";
import { registerThunk } from "@/app/action/authAction";
import type { AppDispatch } from "@/app/store";

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(e.currentTarget);
    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setSubmitError("Mật khẩu nhập lại không khớp");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await dispatch(
        registerThunk({
          full_name: fullName,
          email,
          phone,
          password,
          confirmPassword,
        })
      ).unwrap();

      form.reset(); 
      router.push("/auth/login");
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
    } catch (error: unknown) {
      const message =
        typeof error === "string"
          ? error
          : (error as { message?: string })?.message || "Đăng ký thất bại";

      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <BiUser className="text-2xl" />
        </span>
        <div>
          <h2 className="text-2xl font-bold text-dark">Đăng ký tài khoản</h2>
          <p className="text-sm text-foreground/75">
            Tạo tài khoản mới để nhận gợi ý món ăn cá nhân hóa.
          </p>
        </div>
      </div>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-semibold text-foreground/90"
          >
            Họ và tên
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/50 px-3">
            <BiUser className="text-lg text-primary/70" />
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Nguyễn Văn A"
              required
              className="h-11 w-full bg-transparent text-sm text-foreground caret-primary outline-none placeholder:text-foreground/45"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-foreground/90"
          >
            Email
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/50 px-3">
            <BiMailSend className="text-lg text-primary/70" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="ban@example.com"
              required
              className="h-11 w-full bg-transparent text-sm text-foreground caret-primary outline-none placeholder:text-foreground/45"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold text-foreground/90"
          >
            Số điện thoại
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/50 px-3">
            <BiPhone className="text-lg text-primary/70" />
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="09xxxxxxxx"
              className="h-11 w-full bg-transparent text-sm text-foreground caret-primary outline-none placeholder:text-foreground/45"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-foreground/90"
          >
            Mật khẩu
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/50 px-3">
            <BiLockAlt className="text-lg text-primary/70" />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              required
              className="h-11 w-full bg-transparent text-sm text-foreground caret-primary outline-none placeholder:text-foreground/45"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-semibold text-foreground/90"
          >
            Xác nhận mật khẩu
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/50 px-3">
            <BiLockAlt className="text-lg text-primary/70" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              required
              className="h-11 w-full bg-transparent text-sm text-foreground caret-primary outline-none placeholder:text-foreground/45"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm text-foreground/80">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-amber-300 text-primary focus:ring-primary"
          />
          Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật.
        </label>

        {submitError && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Đang xử lý..." : "Tạo tài khoản"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/80">
        Đã có tài khoản?{" "}
        <Link href="/auth/login" className="font-semibold text-primary">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
