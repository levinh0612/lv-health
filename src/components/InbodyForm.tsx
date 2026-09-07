"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import PhotoUpload from "@/components/PhotoUpload";
import type { BodySegments, SegmentDetail, SegmentStatus } from "@/db/schema";

const FIELDS: { key: string; label: string; placeholder: string }[] = [
  { key: "weightKg", label: "Cân nặng (kg)", placeholder: "78.6" },
  { key: "bmi", label: "BMI", placeholder: "28.9" },
  { key: "bodyFatKg", label: "Mỡ cơ thể (kg)", placeholder: "27.6" },
  { key: "bodyFatPercent", label: "% Mỡ", placeholder: "35.1" },
  { key: "skeletalMuscleKg", label: "Cơ xương (kg)", placeholder: "29.3" },
  { key: "visceralFatLevel", label: "Mỡ nội tạng", placeholder: "13" },
  { key: "bmrKcal", label: "BMR (kcal)", placeholder: "1469" },
  { key: "desirableWeightKg", label: "Cân nặng lý tưởng (kg)", placeholder: "59.3" },
  { key: "obesityDegreePercent", label: "Mức độ béo phì (%)", placeholder: "131.4" },
  { key: "weightControlKg", label: "Cân nặng cần chỉnh (kg)", placeholder: "-19.3" },
  { key: "bodyFatControlKg", label: "Mỡ cần chỉnh (kg)", placeholder: "-21.8" },
  { key: "muscleControlKg", label: "Cơ cần chỉnh (kg)", placeholder: "+2.5" },
  { key: "abdominalFatRatio", label: "Tỷ lệ eo/hông", placeholder: "0.90" },
  { key: "medianaScore", label: "Điểm tổng (Score)", placeholder: "21" },
  { key: "totalEnergyExpenditureKcal", label: "Tổng năng lượng tiêu hao (kcal)", placeholder: "2555" },
];

const SEGMENT_PARTS: { key: keyof BodySegments; label: string }[] = [
  { key: "leftArm", label: "Tay trái" },
  { key: "rightArm", label: "Tay phải" },
  { key: "trunk", label: "Thân" },
  { key: "leftLeg", label: "Chân trái" },
  { key: "rightLeg", label: "Chân phải" },
];

const DEFAULT_SEGMENTS: BodySegments = {
  leftArm: { status: "standard", percent: null },
  rightArm: { status: "standard", percent: null },
  trunk: { status: "standard", percent: null },
  leftLeg: { status: "standard", percent: null },
  rightLeg: { status: "standard", percent: null },
};

export default function InbodyForm() {
  const router = useRouter();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [values, setValues] = useState<Record<string, string>>({});
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [segmentFat, setSegmentFat] = useState<BodySegments | null>(null);
  const [segmentMuscle, setSegmentMuscle] = useState<BodySegments | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handlePhotoUploaded(urls: string[]) {
    const url = urls[0];
    setPhotoUrl(url);
    setExtracting(true);
    setExtractError(null);
    try {
      const res = await fetch("/api/inbody/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Trích xuất thất bại");

      if (data.date) setDate(data.date);
      const next: Record<string, string> = {};
      for (const f of FIELDS) {
        if (data[f.key] !== null && data[f.key] !== undefined) {
          next[f.key] = String(data[f.key]);
        }
      }
      setValues((prev) => ({ ...prev, ...next }));
      if (data.segmentFat) setSegmentFat({ ...DEFAULT_SEGMENTS, ...data.segmentFat });
      if (data.segmentMuscle) setSegmentMuscle({ ...DEFAULT_SEGMENTS, ...data.segmentMuscle });
    } catch (err) {
      setExtractError(err instanceof Error ? err.message : "Trích xuất thất bại");
    } finally {
      setExtracting(false);
    }
  }

  async function handleSubmit() {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { date, photoUrl, segmentFat, segmentMuscle };
      for (const f of FIELDS) {
        payload[f.key] = values[f.key] ? Number(values[f.key]) : null;
      }
      await fetch("/api/inbody", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setValues({});
      setPhotoUrl(null);
      setSegmentFat(null);
      setSegmentMuscle(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 rounded-sm border border-line bg-paper-card p-4">
      <PhotoUpload
        label={
          extracting
            ? "Đang đọc dữ liệu từ ảnh..."
            : photoUrl
              ? "Đã tải ảnh — chụp lại nếu cần"
              : "Chụp ảnh tờ kết quả InBody"
        }
        onUploaded={handlePhotoUploaded}
      />
      {extractError && <p className="text-xs text-rust">{extractError}</p>}
      {photoUrl && !extracting && !extractError && (
        <p className="text-xs text-olive">
          Đã đọc xong — kiểm tra lại số liệu bên dưới trước khi lưu.
        </p>
      )}

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

      {(segmentFat || segmentMuscle) && (
        <div className="space-y-3 border-t border-dashed border-line pt-3">
          <span className="block font-display text-[10px] uppercase tracking-wide text-faint">
            Phân tích từng vùng (Segmental Analysis)
          </span>
          {segmentFat && (
            <SegmentEditor
              title="Mỡ"
              value={segmentFat}
              onChange={setSegmentFat}
            />
          )}
          {segmentMuscle && (
            <SegmentEditor
              title="Cơ"
              value={segmentMuscle}
              onChange={setSegmentMuscle}
            />
          )}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={saving || extracting}
        className="w-full rounded-sm bg-ink py-3 font-display text-sm uppercase tracking-wide text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {saving ? "Đang lưu..." : "Lưu bản đo InBody"}
      </button>
    </div>
  );
}

const STATUS_OPTIONS: { value: SegmentStatus; label: string }[] = [
  { value: "under", label: "Dưới" },
  { value: "standard", label: "Chuẩn" },
  { value: "over", label: "Vượt" },
];

function SegmentEditor({
  title,
  value,
  onChange,
}: {
  title: string;
  value: BodySegments;
  onChange: (v: BodySegments) => void;
}) {
  function updateDetail(key: keyof BodySegments, patch: Partial<SegmentDetail>) {
    onChange({ ...value, [key]: { ...value[key], ...patch } });
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium text-muted">{title}</span>
      <div className="space-y-1.5">
        {SEGMENT_PARTS.map((part) => (
          <div key={part.key} className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted">{part.label}</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                placeholder="%"
                value={value[part.key].percent ?? ""}
                onChange={(e) =>
                  updateDetail(part.key, {
                    percent: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-14 rounded-sm border border-line bg-white px-1.5 py-0.5 text-[11px] outline-none focus:border-steel"
              />
              <div className="flex gap-1">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateDetail(part.key, { status: opt.value })}
                    className={clsx(
                      "rounded-full px-2.5 py-0.5 text-[11px] transition-colors",
                      value[part.key].status === opt.value
                        ? "bg-ink text-paper"
                        : "bg-paper-dim text-muted"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
