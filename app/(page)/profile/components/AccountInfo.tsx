"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { LuMail, LuPhone, LuSave, LuUser, LuUndo2 } from "react-icons/lu";
import { toast } from "sonner";
import { updateProfileThunk } from "@/app/action/authAction";
import type { AppDispatch } from "@/app/store";
import { selectIsLoading, selectUser } from "@/app/store/slices/userSlices";

type AccountForm = {
  full_name: string;
  email: string;
  phone: string;
};

const getInitialForm = (user: ReturnType<typeof selectUser>): AccountForm => ({
  full_name: user?.full_name ?? "",
  email: user?.email ?? "",
  phone: user?.phone ?? "",
});

const VIETNAM_PHONE_REGEX = /^(0(3|5|7|8|9)\d{8}|84(3|5|7|8|9)\d{8})$/;

const normalizePhone = (phone: string) => phone.replace(/\D/g, "").slice(0, 12);

export default function AccountInfo() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);
  const initialForm = useMemo(() => getInitialForm(user), [user]);
  const [form, setForm] = useState<AccountForm>(initialForm);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const hasChanges =
    form.full_name !== initialForm.full_name ||
    form.email !== initialForm.email ||
    form.phone !== initialForm.phone;

  const handleChange =
    (field: keyof AccountForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "phone" ? normalizePhone(event.target.value) : event.target.value;

      setForm((current) => ({ ...current, [field]: value }));
      setFormError(null);
    };

  const handleReset = () => {
    setForm(initialForm);
    setFormError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      full_name: form.full_name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: normalizePhone(form.phone.trim()),
    };

    if (payload.full_name.length < 2) {
      setFormError("Họ và tên phải có ít nhất 2 ký tự.");
      return;
    }

    if (!payload.email) {
      setFormError("Email không được để trống.");
      return;
    }

    if (payload.phone && !VIETNAM_PHONE_REGEX.test(payload.phone)) {
      setFormError("Số điện thoại không hợp lệ. Vui lòng nhập số Việt Nam bắt đầu bằng 03, 05, 07, 08, 09 hoặc 84.");
      return;
    }

    try {
      await dispatch(updateProfileThunk(payload)).unwrap();
      toast.success("Cập nhật thông tin tài khoản thành công.");
    } catch (error: unknown) {
      const message =
        typeof error === "string"
          ? error
          : (error as { message?: string })?.message || "Cập nhật thông tin thất bại.";

      setFormError(message);
      toast.error(message);
    }
  };

  if (!user) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-white p-6 text-center shadow-sm">
        <h1 className="m-0 text-xl font-extrabold text-stone-800">
          Thông tin tài khoản
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-stone-500">
          Bạn cần đăng nhập để xem và cập nhật thông tin tài khoản.
        </p>
        <button
          type="button"
          onClick={() => router.push("/auth/login")}
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
        >
          Đăng nhập
        </button>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="m-0 text-xl font-extrabold text-stone-800">
            Thông tin tài khoản
          </h1>
          <p className="m-0 mt-1 text-sm text-stone-500">
            Cập nhật thông tin liên hệ dùng cho đơn hàng và thông báo.
          </p>
        </div>
        <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
          {user.role === "user" ? "Khách hàng" : user.role}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-4 border-b border-stone-100 pb-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-2xl font-bold text-white shadow-md">
            {form.full_name.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="m-0 truncate text-base font-bold text-stone-800">
              {form.full_name || "Người dùng"}
            </p>
            <p className="m-0 mt-0.5 truncate text-sm text-stone-500">{form.email}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-stone-700">
              Họ và tên
            </span>
            <span className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/50 px-3 focus-within:border-orange-500 focus-within:bg-white">
              <LuUser className="shrink-0 text-lg text-orange-500" />
              <input
                type="text"
                value={form.full_name}
                onChange={handleChange("full_name")}
                className="h-11 w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
                placeholder="Nguyễn Văn A"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-stone-700">
              Email
            </span>
            <span className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/50 px-3 focus-within:border-orange-500 focus-within:bg-white">
              <LuMail className="shrink-0 text-lg text-orange-500" />
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                className="h-11 w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
                placeholder="ban@example.com"
                required
              />
            </span>
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-stone-700">
              Số điện thoại
            </span>
            <span className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/50 px-3 focus-within:border-orange-500 focus-within:bg-white">
              <LuPhone className="shrink-0 text-lg text-orange-500" />
              <input
                type="tel"
                value={form.phone}
                onChange={handleChange("phone")}
                className="h-11 w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
                placeholder="09xxxxxxxx"
                inputMode="tel"
                maxLength={12}
                pattern="[0-9]{10,12}"
                title="Chỉ nhập số, tối đa 12 chữ số."
              />
            </span>
          </label>
        </div>

        {formError && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {formError}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasChanges || isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-bold text-stone-600 transition hover:border-stone-300 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LuUndo2 className="text-base" />
            Hoàn tác
          </button>
          <button
            type="submit"
            disabled={!hasChanges || isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LuSave className="text-base" />
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </section>
  );
}
