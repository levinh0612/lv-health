"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhotoUpload from "@/components/PhotoUpload";

export default function BodyLogForm() {
  const router = useRouter();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [weightKg, setWeightKg] = useState("");
  const [bodyFatKg, setBodyFatKg] = useState("");
  const [skeletalMuscleKg, setSkeletalMuscleKg] = useState("");
  const [notes, setNotes] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    try {
      await fetch("/api/body-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          weightKg: weightKg ? Number(weightKg) : null,
          bodyFatKg: bodyFatKg ? Number(bodyFatKg) : null,
          skeletalMuscleKg: skeletalMuscleKg ? Number(skeletalMuscleKg) : null,
          notes: notes || null,
          photoUrls,
        }),
      });
      setWeightKg("");
      setBodyFatKg("");
      setSkeletalMuscleKg("");
      setNotes("");
      setPhotoUrls([]);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 rounded-sm border border-line bg-paper-card p-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Ngày">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Cân nặng (kg)">
          <input
            type="number"
            step="0.1"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="input"
            placeholder="78.6"
          />
        </Field>
        <Field label="Mỡ cơ thể (kg)">
          <input
            type="number"
            step="0.1"
            value={bodyFatKg}
            onChange={(e) => setBodyFatKg(e.target.value)}
            className="input"
            placeholder="27.6"
          />
        </Field>
        <Field label="Cơ xương (kg)">
          <input
            type="number"
            step="0.1"
            value={skeletalMuscleKg}
            onChange={(e) => setSkeletalMuscleKg(e.target.value)}
            className="input"
            placeholder="29.3"
          />
        </Field>
      </div>

      <PhotoUpload
        label={photoUrls.length > 0 ? `Đã tải ${photoUrls.length} ảnh` : "Chụp ảnh body"}
        multiple
        onUploaded={(urls) => setPhotoUrls((prev) => [...prev, ...urls])}
      />

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Ghi chú (cảm nhận, số đo vòng eo...)"
        className="input min-h-[64px] resize-none"
      />

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full rounded-sm bg-ink py-3 font-display text-sm uppercase tracking-wide text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {saving ? "Đang lưu..." : "Lưu bản ghi"}
      </button>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border: 1px solid var(--line);
          background: white;
          border-radius: 2px;
          padding: 8px 10px;
          font-size: 14px;
          outline: none;
        }
        :global(.input:focus) {
          border-color: var(--steel);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-display text-[10px] uppercase tracking-wide text-faint">
        {label}
      </span>
      {children}
    </label>
  );
}
