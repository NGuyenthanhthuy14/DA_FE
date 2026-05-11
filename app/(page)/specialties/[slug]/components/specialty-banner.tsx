import { BiPackage, BiGroup, BiSolidStar } from "react-icons/bi";

interface SpecialtyBannerProps {
  name: string;
  description: string;
  imageUrl: string;
  totalProducts: number;
  shopCount: number;
  avgRating: string;
}

export default function SpecialtyBanner({
  name,
  description,
  imageUrl,
  totalProducts,
  shopCount,
  avgRating,
}: SpecialtyBannerProps) {
  return (
    <section className="overflow-hidden  border border-[#f3d6a3] bg-linear-to-r from-[#fff3d8] to-[#fffaf3]">
      <div className="container">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] items-center gap-8 p-8 md:p-10">

          <div>
            <span className="inline-block rounded-full bg-[#9a4314] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Đặc sản vùng miền
            </span>

            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-[#3d2a1e] md:text-4xl">
              {name}
              <br />
              <span className="text-[#9a4314]">
                – Hương vị đậm đà bản sắc Việt
              </span>
            </h1>
            {description && (
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#6f6258]">
                {description}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-4">

              <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-sm">
                <BiPackage className="text-xl text-[#9a4314]" />
                <div>
                  <p className="text-lg font-extrabold text-[#3d2a1e]">
                    {totalProducts}+
                  </p>
                  <p className="text-xs text-gray-500">Sản phẩm</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-sm">
                <BiGroup className="text-xl text-[#9a4314]" />
                <div>
                  <p className="text-lg font-extrabold text-[#3d2a1e]">
                    {shopCount}
                  </p>
                  <p className="text-xs text-gray-500">Quán bán</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-sm">
                <BiSolidStar className="text-xl text-[#f59e0b]" />
                <div>
                  <p className="text-lg font-extrabold text-[#3d2a1e]">
                    {avgRating}
                  </p>
                  <p className="text-xs text-gray-500">Đánh giá</p>
                </div>
              </div>

            </div>
          </div>

          <div className="relative hidden h-[260px] w-full overflow-hidden rounded-[24px] shadow-md md:block">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#f3e2c7] text-5xl">
                🍜
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}