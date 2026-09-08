"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import PhotoUpload from "@/components/PhotoUpload";

const MEAL_TYPES = [
  { value: "sang", label: "Sáng" },
  { value: "trua", label: "Trưa" },
  { value: "toi", label: "Tối" },
  { value: "phu", label: "Phụ" },
] as const;

const TAGS = [
  { value: "dat_chuan", label: "Đạt chuẩn", accent: "olive" },
  { value: "han_che", label: "Hạn chế", accent: "rust" },
] as const;

type NutritionItem = { name: string; calories: number };
type Nutrition = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  note: string;
  items: NutritionItem[];
};

export default function MealForm() {
  const router = useRouter();
  const [mealType, setMealType] = useState<string>("sang");
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [estimating, setEstimating] = useState(false);
  const [estimateError, setEstimateError] = useState<string | null>(null);
  const [items, setItems] = useState<NutritionItem[]>([]);
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [calories, setCalories] = useState("");
  const [proteinG, setProteinG] = useState("");
  const [carbsG, setCarbsG] = useState("");
  const [fatG, setFatG] = useState("");

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function estimateNutrition(url: string) {
    setEstimating(true);
    setEstimateError(null);
    try {
      const res = await fetch("/api/meals/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: url }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Ước tính thất bại");
      const data: Nutrition = await res.json();
      setCalories(String(Math.round(data.calories)));
      setProteinG(String(Math.round(data.proteinG)));
      setCarbsG(String(Math.round(data.carbsG)));
      setFatG(String(Math.round(data.fatG)));
      setItems(data.items ?? []);
      setAiNote(data.note ?? null);
    } catch (err) {
      setEstimateError(err instanceof Error ? err.message : "Ước tính thất bại");
    } finally {
      setEstimating(false);
    }
  }

  async function handlePhotoUploaded(urls: string[]) {
    const url = urls[0];
    setPhotoUrl(url);
    estimateNutrition(url);
  }

  async function handleSubmit() {
    setSaving(true);
    try {
      await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datetime: new Date().toISOString(),
          mealType,
          photoUrl,
          tags,
          notes: notes || null,
          calories: calories ? Number(calories) : null,
          proteinG: proteinG ? Number(proteinG) : null,
          carbsG: carbsG ? Number(carbsG) : null,
          fatG: fatG ? Number(fatG) : null,
          nutritionNote: aiNote,
          nutritionItems: items.length > 0 ? items : null,
        }),
      });
      setNotes("");
      setTags([]);
      setPhotoUrl(null);
      setCalories("");
      setProteinG("");
      setCarbsG("");
      setFatG("");
      setItems([]);
      setAiNote(null);
      setEstimateError(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 rounded-sm border border-line bg-paper-card p-4">
      <div className="flex gap-2">
        {MEAL_TYPES.map((m) => (
          <button
            key={m.value}
            onClick={() => setMealType(m.value)}
            className={clsx(
              "flex-1 rounded-sm border py-2 font-display text-xs uppercase tracking-wide transition-colors",
              mealType === m.value
                ? "border-ink bg-ink text-paper"
                : "border-line text-muted"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <PhotoUpload
        label={photoUrl ? "Đã tải ảnh" : "Chụp ảnh bữa ăn"}
        onUploaded={handlePhotoUploaded}
      />

      {photoUrl && (
        <div className="rounded-sm border border-dashed border-line bg-paper-dim/40 p-3">
          <div className="flex items-center justify-between">
            <span className="font-display text-[11px] uppercase tracking-wide text-muted">
              Ước tính dinh dưỡng (AI)
            </span>
            {!estimating && (
              <button
                type="button"
                onClick={() => estimateNutrition(photoUrl)}
                className="text-[11px] text-steel hover:underline"
              >
                Ước tính lại
              </button>
            )}
          </div>

          {estimating && <p className="mt-2 text-xs text-faint">Đang phân tích ảnh...</p>}
          {estimateError && <p className="mt-2 text-xs text-rust">{estimateError}</p>}

          {!estimating && (calories || proteinG || carbsG || fatG) && (
            <>
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                <NutritionField label="Kcal" value={calories} onChange={setCalories} />
                <NutritionField label="Đạm (g)" value={proteinG} onChange={setProteinG} />
                <NutritionField label="Carb (g)" value={carbsG} onChange={setCarbsG} />
                <NutritionField label="Béo (g)" value={fatG} onChange={setFatG} />
              </div>
              {items.length > 0 && (
                <ul className="mt-2 space-y-0.5">
                  {items.map((it, i) => (
                    <li key={i} className="flex justify-between text-[11px] text-muted">
                      <span className="truncate">{it.name}</span>
                      <span className="flex-shrink-0 pl-2 text-faint">{Math.round(it.calories)} kcal</span>
                    </li>
                  ))}
                </ul>
              )}
              {aiNote && <p className="mt-2 text-[11px] italic text-faint">{aiNote}</p>}
            </>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {TAGS.map((t) => (
          <button
            key={t.value}
            onClick={() => toggleTag(t.value)}
            className={clsx(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              tags.includes(t.value)
                ? t.accent === "olive"
                  ? "border-olive bg-olive text-paper"
                  : "border-rust bg-rust text-paper"
                : "border-line text-muted"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Ghi chú món ăn..."
        className="w-full min-h-[56px] resize-none rounded-sm border border-line bg-white px-3 py-2 text-sm outline-none focus:border-steel"
      />

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full rounded-sm bg-ink py-3 font-display text-sm uppercase tracking-wide text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {saving ? "Đang lưu..." : "Lưu bữa ăn"}
      </button>
    </div>
  );
}

function NutritionField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] text-faint">{label}</span>
      <input
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full rounded-sm border border-line bg-white px-1.5 py-1 text-xs outline-none focus:border-steel"
      />
    </label>
  );
}
