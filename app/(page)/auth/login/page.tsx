import Link from "next/link";
import { BiLockAlt, BiMailSend, BiUserCircle } from "react-icons/bi";

export default function LoginPage() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <BiUserCircle className="text-2xl" />
        </span>
        <div>
          <h2 className="text-2xl font-bold text-dark">Đăng nhập</h2>
          <p className="text-sm text-foreground/75">
            Truy cập tài khoản của bạn để tiếp tục.
          </p>
        </div>
      </div>

      <form className="mt-7 space-y-4">
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
              placeholder="Nhập mật khẩu"
              className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/45"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-foreground/80">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-amber-300 text-primary focus:ring-primary"
            />
            Ghi nhớ đăng nhập
          </label>
          <Link href="#" className="font-semibold text-primary hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        <button
          type="submit"
          className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-dark"
        >
          Đăng nhập
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/80">
        Bạn chưa có tài khoản?{" "}
        <Link href="/auth/register" className="font-semibold text-primary">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
