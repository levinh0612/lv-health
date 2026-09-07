"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const PIN_LENGTH = 4;

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      submit(pin);
    }
  }, [pin]);

  async function submit(value: string) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: value }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Sai mã PIN");
        setPin("");
        setShake(true);
        setTimeout(() => setShake(false), 400);
        inputRef.current?.focus();
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

      <div className="rise-in relative flex w-full max-w-sm flex-col items-center text-center">
        <p className="mb-2 font-display text-sm uppercase tracking-[0.08em] text-rust">
          Nhật ký cá nhân
        </p>
        <h1 className="mb-10 font-display text-5xl font-bold uppercase leading-[0.98] text-paper">
          Sức
          <br />
          Khỏe
        </h1>

        <span className="mb-4 block font-display text-xs uppercase tracking-wide text-[#a8a396]">
          Nhập mã PIN
        </span>

        <div
          className={clsx(
            "relative flex gap-3",
            shake && "animate-[shake_0.4s_ease-in-out]"
          )}
          onClick={() => inputRef.current?.focus()}
        >
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <div
              key={i}
              className={clsx(
                "flex h-14 w-12 items-center justify-center rounded-sm border bg-transparent transition-colors",
                pin.length === i ? "border-rust" : "border-paper/20"
              )}
            >
              {pin[i] && (
                <span className="h-2.5 w-2.5 rounded-full bg-paper" />
              )}
            </div>
          ))}

          <input
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            autoFocus
            maxLength={PIN_LENGTH}
            value={pin}
            disabled={loading}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, PIN_LENGTH))}
            className="absolute inset-0 h-full w-full cursor-default opacity-0"
            aria-label="Mã PIN"
          />
        </div>

        {error && (
          <p className="mt-4 text-sm text-rust-soft" role="alert">
            {error}
          </p>
        )}

        <style jsx>{`
          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-8px);
            }
            75% {
              transform: translateX(8px);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
