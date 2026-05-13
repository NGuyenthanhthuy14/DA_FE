"use client";

import React from "react";
import { useSelector } from "react-redux";
import { LuCamera, LuMail, LuPhone } from "react-icons/lu";
import { selectUser } from "@/app/store/slices/userSlices";

export default function ProfileOverview() {
  const user = useSelector(selectUser);

  return (
    <div>
      <h1 className="m-0 mb-5 text-xl font-extrabold text-stone-800">
        Trang cá nhân
      </h1>

      <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
        {/* Avatar + Name */}
        <div className="mb-6 flex items-center gap-5">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-3xl font-bold text-white shadow-md">
              {user?.full_name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-orange-600 text-white shadow-sm transition-all hover:bg-orange-700"
            >
              <LuCamera className="text-xs" />
            </button>
          </div>
          <div>
            <h2 className="m-0 text-lg font-bold text-stone-800">
              {user?.full_name ?? "Người dùng"}
            </h2>
            <p className="m-0 mt-0.5 text-sm text-stone-400">
              Thành viên từ {user?.created_at ? new Date(user.created_at).toLocaleDateString("vi-VN") : "---"}
            </p>
          </div>
        </div>

        {/* Info rows */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-xl bg-stone-50/80 px-4 py-3">
            <LuMail className="text-base text-orange-500" />
            <div>
              <p className="m-0 text-xs text-stone-400">Email</p>
              <p className="m-0 text-sm font-medium text-stone-700">
                {user?.email ?? "---"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-stone-50/80 px-4 py-3">
            <LuPhone className="text-base text-orange-500" />
            <div>
              <p className="m-0 text-xs text-stone-400">Số điện thoại</p>
              <p className="m-0 text-sm font-medium text-stone-700">
                {user?.phone ?? "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
