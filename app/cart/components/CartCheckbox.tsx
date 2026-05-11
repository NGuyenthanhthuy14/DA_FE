"use client";

import React from "react";

const CHECK_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E")`;

interface CartCheckboxProps {
  checked: boolean;
  onChange: () => void;
  id?: string;
}

export default function CartCheckbox({
  checked,
  onChange,
  id,
}: CartCheckboxProps) {
  return (
    <input
      type="checkbox"
      id={id}
      className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-md border-2 border-stone-300 bg-white transition-all checked:border-orange-600 checked:bg-orange-600 hover:border-orange-600"
      style={checked ? { backgroundImage: CHECK_SVG } : {}}
      checked={checked}
      onChange={onChange}
    />
  );
}
