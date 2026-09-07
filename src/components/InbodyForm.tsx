"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FIELDS: { key: string; label: string; placeholder: string }[] = [
  { key: "weightKg", label: "Cân nặng (kg)", placeholder: "78.6" },
  { key: "bmi", label: "BMI", placeholder: "28.9" },
  { key: "bodyFatKg", label: "Mỡ cơ thể (kg)", placeholder: "27.6" },
  { key: "bodyFatPercent", label: "% Mỡ", placeholder: "35.1" },
  { key: "skeletalMuscleKg", label: "Cơ xương (kg)", placeholder: "29.3" },
  { key: "visceralFatLevel", label: "Mỡ nội tạng", placeholder: "13" },
  { key: "bmrKcal", label: "BMR (kcal)", placeholder: "1469" },
  { key: "desirableWeightKg", label: "Cân nặng lý tưởng (kg)", placeholder: "59.3" },
];

export default function InbodyForm() {
  const router = useRouter();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { date };
      for (const f of FIELDS) {
        payload[f.key] = values[f.key] ? Number(values[f.key]) : null;
      }
      await fetch("/api/inbody", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setValues({});
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 rounded-sm border border-line bg-paper-card p-4">
      <label className="block">
        <span className="mb-1 block font-display text-[10px] uppercase tracking-wide text-faint">
          Ngày đo
        </span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-sm border border-line bg-white px-3 py-2 text-sm outline-none focus:border-steel"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1 block font-display text-[10px] uppercase tracking-wide text-faint">
              {f.label}
            </span>
            <input
              type="number"
              step="0.1"
              placeholder={f.placeholder}
              value={values[f.key] ?? ""}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [f.key]: e.target.value }))
              }
              className="w-full rounded-sm border border-line bg-white px-3 py-2 text-sm outline-none focus:border-steel"
            />
          </label>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full rounded-sm bg-ink py-3 font-display text-sm uppercase tracking-wide text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {saving ? "Đang lưu..." : "Lưu bản đo InBody"}
      </button>
    </div>
  );
}
