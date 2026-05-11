import Link from "next/link";
import { BiChevronRight, BiHome } from "react-icons/bi";

interface SpecialtyBreadcrumbProps {
  name: string;
}

export default function SpecialtyBreadcrumb({ name }: SpecialtyBreadcrumbProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
      <nav className="flex items-center gap-2 text-sm text-stone-500">
        <Link href="/" className="flex items-center gap-1 hover:text-primary">
          <BiHome className="text-base" /> Trang chủ
        </Link>
        <BiChevronRight />
        <Link href="/specialties" className="hover:text-primary">Đặc sản theo vùng</Link>
        <BiChevronRight />
        <span className="font-medium text-dark">{name}</span>
      </nav>
    </div>
  );
}
