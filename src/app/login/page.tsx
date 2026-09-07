"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Đăng nhập thất bại");
        return;
      }
      router.replace("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-ink px-6 py-16">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full border border-paper/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full border border-paper/10"
        aria-hidden
      />

      <div className="rise-in relative w-full max-w-sm">
        <p className="mb-2 font-display text-sm uppercase tracking-[0.08em] text-rust">
          Nhật ký cá nhân
        </p>
        <h1 className="mb-8 font-display text-5xl font-bold uppercase leading-[0.98] text-paper">
          Sức
          <br />
          Khỏe
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block font-display text-xs uppercase tracking-wide text-[#a8a396]"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              autoFocus
              inputMode="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sm border border-paper/20 bg-transparent px-4 py-3 text-paper outline-none transition-colors focus:border-rust"
              placeholder="••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-rust-soft" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-sm bg-rust py-3 font-display text-sm uppercase tracking-wide text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {loading ? "Đang vào..." : "Vào"}
          </button>
        </form>
      </div>
    </div>
  );
}
