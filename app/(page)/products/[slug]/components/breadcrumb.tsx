"use client";

import Link from "next/link";
import { BiChevronRight } from "react-icons/bi";

interface BreadcrumbProps {
  productName: string;
  productType?: string;
}

export default function Breadcrumb({ productName, productType }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 py-4">
      <Link href="/" className="hover:text-primary transition">
        Trang chủ
      </Link>
      <BiChevronRight className="text-gray-400" />
      {productType && (
        <>
          <Link href="/products" className="hover:text-primary transition">
            {productType}
          </Link>
          <BiChevronRight className="text-gray-400" />
        </>
      )}
      <span className="text-gray-800 font-medium line-clamp-1">
        {productName}
      </span>
    </nav>
  );
}
