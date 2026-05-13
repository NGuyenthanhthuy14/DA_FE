"use client";

import React from "react";
import { LuCheck } from "react-icons/lu";

const STEPS = [
  { num: 1, label: "Giỏ hàng" },
  { num: 2, label: "Thông tin" },
  { num: 3, label: "Thanh toán" },
  { num: 4, label: "Hoàn tất" },
];

interface CheckoutStepperProps {
  current: number; // 1-based
}

export default function CheckoutStepper({ current }: CheckoutStepperProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, idx) => {
        const isCompleted = step.num < current;
        const isActive = step.num === current;
        const isLast = idx === STEPS.length - 1;

        return (
          <React.Fragment key={step.num}>
            <div className="flex flex-col items-center gap-1.5">
              {/* Circle */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  isCompleted
                    ? "bg-orange-600 text-white"
                    : isActive
                      ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                      : "border-2 border-stone-200 bg-white text-stone-400"
                }`}
              >
                {isCompleted ? <LuCheck className="text-lg" /> : step.num}
              </div>
              {/* Label */}
              <span
                className={`text-xs font-medium ${
                  isActive || isCompleted
                    ? "text-orange-600"
                    : "text-stone-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {/* Connector line */}
            {!isLast && (
              <div
                className={`mx-2 mb-5 h-0.5 w-16 rounded-full sm:w-24 ${
                  isCompleted ? "bg-orange-600" : "bg-stone-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
