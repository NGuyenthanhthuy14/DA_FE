import {
  BiShieldAlt2,
  BiSupport,
} from "react-icons/bi";
import { LuTruck, LuShieldCheck } from "react-icons/lu";

const BADGES = [
  {
    icon: LuShieldCheck,
    title: "Cam kết chất lượng",
    desc: "Đặc sản chính gốc",
  },
  {
    icon: LuTruck,
    title: "Giao hàng toàn quốc",
    desc: "Nhanh chóng, an toàn",
  },
  {
    icon: BiSupport,
    title: "Hỗ trợ 24/7",
    desc: "Tư vấn tận tâm",
  },
  {
    icon: BiShieldAlt2,
    title: "Thanh toán an toàn",
    desc: "Nhiều hình thức",
  },
];

export default function TrustBadges() {
  return (
    <section className="mt-12 rounded-2xl border border-gray-100 bg-white">
      <div className="grid grid-cols-2 divide-x divide-gray-100 md:grid-cols-4">
        {BADGES.map((badge) => (
          <div
            key={badge.title}
            className="flex items-center gap-3 px-5 py-5"
          >
            <badge.icon className="text-2xl text-primary shrink-0" />
            <div>
              <p className="text-xs font-bold text-gray-800">{badge.title}</p>
              <p className="text-[11px] text-gray-500">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
