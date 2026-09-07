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

export default function MealForm() {
  const router = useRouter();
  const [mealType, setMealType] = useState<string>("sang");
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
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
        }),
      });
      setNotes("");
      setTags([]);
      setPhotoUrl(null);
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
        onUploaded={(urls) => setPhotoUrl(urls[0])}
      />

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
