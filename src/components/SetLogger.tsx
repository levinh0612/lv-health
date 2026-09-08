"use client";

import { useState } from "react";
import type { LoggedSet, PrRecord } from "@/lib/strength";
import { epley1RM } from "@/lib/strength";

export default function SetLogger({
  loggedSets,
  prRecord,
  onLogSet,
  onRemoveSet,
}: {
  loggedSets: LoggedSet[];
  prRecord?: PrRecord;
  onLogSet: (weight: number, reps: number) => void;
  onRemoveSet: (index: number) => void;
}) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  function submit() {
    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    if (!(w > 0) || !(r > 0)) return;
    onLogSet(w, r);
    setWeight("");
    setReps("");
  }

  return (
    <div className="ml-14 mt-2 space-y-1.5">
      {loggedSets.map((s, i) => (
        <div key={i} className="flex items-center gap-2 text-xs text-muted">
          <span className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-paper-dim text-[10px] text-faint">
            {i + 1}
          </span>
          <span className="text-ink">
            {s.weight} kg × {s.reps}
          </span>
          {s.isPR && (
            <span className="inline-flex items-center rounded-full bg-rust/15 px-2 py-0.5 font-display text-[10px] uppercase tracking-wide text-rust">
              🏆 PR
            </span>
          )}
          <button
            type="button"
            onClick={() => onRemoveSet(i)}
            className="ml-auto flex-shrink-0 px-1 text-faint hover:text-rust"
            aria-label="Xóa set"
          >
            ✕
          </button>
        </div>
      ))}

      <div className="flex items-center gap-1.5">
        <span className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-line text-[10px] text-faint">
          {loggedSets.length + 1}
        </span>
        <input
          inputMode="decimal"
          placeholder="kg"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-16 rounded-sm border border-line bg-white px-2 py-1 text-xs outline-none focus:border-steel"
        />
        <span className="text-xs text-faint">×</span>
        <input
          inputMode="numeric"
          placeholder="reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="w-14 rounded-sm border border-line bg-white px-2 py-1 text-xs outline-none focus:border-steel"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!weight.trim() || !reps.trim()}
          className="rounded-sm bg-ink px-2.5 py-1 text-xs text-paper disabled:opacity-30"
        >
          ✓ Ghi set
        </button>
      </div>

      {prRecord && (
        <p className="text-[11px] text-faint">
          Kỷ lục: {prRecord.weight} kg × {prRecord.reps} ({new Date(prRecord.date).toLocaleDateString("vi-VN")})
        </p>
      )}
      {!prRecord && weight && reps && parseFloat(weight) > 0 && parseInt(reps, 10) > 0 && (
        <p className="text-[11px] text-faint">
          Ước tính 1RM: {epley1RM(parseFloat(weight), parseInt(reps, 10)).toFixed(1)} kg
        </p>
      )}
    </div>
  );
}
