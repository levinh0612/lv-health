"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type RestTimerState = { label: string; seconds: number; key: number };

// Keyed by `state.key` from the caller so a new rest period remounts this
// component (fresh `remaining`/`doneRef`) instead of resetting state from
// inside an effect.
export default function RestTimer({
  state,
  onDone,
}: {
  state: RestTimerState | null;
  onDone: () => void;
}) {
  const [remaining, setRemaining] = useState(state?.seconds ?? 0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!state) return;
    if (remaining <= 0) {
      if (!doneRef.current) {
        doneRef.current = true;
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      }
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, state]);

  if (!state || typeof document === "undefined") return null;

  const finished = remaining <= 0;

  return createPortal(
    <div className="fixed bottom-16 left-0 right-0 z-30 flex justify-center px-4">
      <div className="flex w-full max-w-sm items-center gap-3 rounded-sm border border-line bg-ink px-4 py-2.5 text-paper shadow-lg">
        <span className="font-display text-lg tabular-nums">
          {finished ? "Xong!" : `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`}
        </span>
        <span className="flex-1 truncate text-xs text-paper/70">Nghỉ · {state.label}</span>
        {!finished && (
          <button
            type="button"
            onClick={() => setRemaining((r) => r + 15)}
            className="rounded-full bg-paper/15 px-2.5 py-1 font-display text-[10px] uppercase tracking-wide"
          >
            +15s
          </button>
        )}
        <button
          type="button"
          onClick={onDone}
          className="rounded-full bg-rust px-2.5 py-1 font-display text-[10px] uppercase tracking-wide"
        >
          {finished ? "Đóng" : "Bỏ qua"}
        </button>
      </div>
    </div>,
    document.body
  );
}
