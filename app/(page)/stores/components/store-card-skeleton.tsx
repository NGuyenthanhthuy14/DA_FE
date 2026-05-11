"use client";

import React from "react";

export default function StoreCardSkeleton() {
  return (
    <div className="flex rounded-2xl bg-white overflow-hidden shadow-[0_1px_8px_rgba(120,53,15,0.06)] border border-[rgba(232,221,212,0.5)] pointer-events-none max-sm:flex-col">
      <div className="w-[200px] min-w-[200px] min-h-[180px] shrink-0 bg-linear-to-r from-[#f0e8df] via-[#f8f2eb] to-[#f0e8df] bg-[length:200%_100%] animate-pulse max-sm:w-full max-sm:min-w-full max-sm:min-h-[160px] max-sm:max-h-[180px]" />

      <div className="flex-1 min-w-0 px-4 py-3.5 flex flex-col justify-center gap-2.5">
        <div className="w-[70%] h-[18px] rounded-md bg-linear-to-r from-[#f0e8df] via-[#f8f2eb] to-[#f0e8df] bg-[length:200%_100%] animate-pulse" />
        <div className="w-[50%] h-3 rounded-md bg-linear-to-r from-[#f0e8df] via-[#f8f2eb] to-[#f0e8df] bg-[length:200%_100%] animate-pulse" />
        <div className="w-[85%] h-3 rounded-md bg-linear-to-r from-[#f0e8df] via-[#f8f2eb] to-[#f0e8df] bg-[length:200%_100%] animate-pulse" />
        <div className="w-[60%] h-3 rounded-md bg-linear-to-r from-[#f0e8df] via-[#f8f2eb] to-[#f0e8df] bg-[length:200%_100%] animate-pulse" />
        <div className="flex gap-1.5 mt-0.5">
          <div className="w-14 h-[22px] rounded-full bg-linear-to-r from-[#f0e8df] via-[#f8f2eb] to-[#f0e8df] bg-[length:200%_100%] animate-pulse" />
          <div className="w-14 h-[22px] rounded-full bg-linear-to-r from-[#f0e8df] via-[#f8f2eb] to-[#f0e8df] bg-[length:200%_100%] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
