import Image from "next/image";
import { productBanner } from "@/app/assets/image/product";

export default function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden">
      <Image
        src={productBanner}
        alt="Tinh hoa đặc sản – Khắp mọi miền"
        priority
        className="w-full h-120"
      />
    </section>
  );
}
