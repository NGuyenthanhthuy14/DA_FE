import Link from "next/link";
import { BiLockAlt, BiMailSend, BiPhone, BiUser } from "react-icons/bi";

export default function RegisterPage() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <BiUser className="text-2xl" />
        </span>
        <div>
          <h2 className="text-2xl font-bold text-dark">Đăng ký tài khoản</h2>
          <p className="text-sm text-foreground/75">
            Tạo tài khoản mới để nhận gợi ý món ăn cá nhân hóa.
          </p>
        </div>
      </div>

      <form className="mt-7 space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-semibold text-foreground/90"
          >
            Họ và tên
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/50 px-3">
            <BiUser className="text-lg text-primary/70" />
            <input
              id="fullName"
              type="text"
              placeholder="Nguyễn Văn A"
              className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/45"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-foreground/90"
          >
            Email
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/50 px-3">
            <BiMailSend className="text-lg text-primary/70" />
            <input
              id="email"
              type="email"
              placeholder="ban@example.com"
              className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/45"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold text-foreground/90"
          >
            Số điện thoại
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/50 px-3">
            <BiPhone className="text-lg text-primary/70" />
            <input
              id="phone"
              type="tel"
              placeholder="09xxxxxxxx"
              className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/45"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-foreground/90"
          >
            Mật khẩu
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/50 px-3">
            <BiLockAlt className="text-lg text-primary/70" />
            <input
              id="password"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/45"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-semibold text-foreground/90"
          >
            Xác nhận mật khẩu
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/50 px-3">
            <BiLockAlt className="text-lg text-primary/70" />
            <input
              id="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/45"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm text-foreground/80">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-amber-300 text-primary focus:ring-primary"
          />
          Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật.
        </label>

        <button
          type="submit"
          className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-dark"
        >
          Tạo tài khoản
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/80">
        Đã có tài khoản?{" "}
        <Link href="/auth/login" className="font-semibold text-primary">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
