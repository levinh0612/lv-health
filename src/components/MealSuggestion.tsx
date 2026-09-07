"use client";

import { useState } from "react";

type Suggestion = {
  summary: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
};

export default function MealSuggestion() {
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchSuggestion() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/meals/suggest", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gợi ý thất bại");
      setSuggestion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gợi ý thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-sm border border-line bg-paper-card p-4">
      <div className="flex items-center justify-between">
        <span className="font-display text-xs uppercase tracking-wide text-faint">
          Gợi ý bữa ăn hôm nay
        </span>
        <button
          onClick={fetchSuggestion}
          disabled={loading}
          className="font-display text-xs uppercase tracking-wide text-steel disabled:opacity-40"
        >
          {loading ? "Đang gợi ý..." : suggestion ? "Gợi ý lại" : "Lấy gợi ý"}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-rust">{error}</p>}

      {suggestion && (
        <div className="mt-3 space-y-2 text-sm">
          <p className="italic text-muted">{suggestion.summary}</p>
          <Row label="Sáng" text={suggestion.breakfast} />
          <Row label="Trưa" text={suggestion.lunch} />
          <Row label="Tối" text={suggestion.dinner} />
          <Row label="Phụ" text={suggestion.snack} />
        </div>
      )}

      {!suggestion && !loading && !error && (
        <p className="mt-2 text-xs text-faint">
          Dựa trên số liệu InBody và lịch tập hôm nay để gợi ý thực đơn phù hợp.
        </p>
      )}
    </div>
  );
}

function Row({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <span className="font-display text-[11px] uppercase text-ink">{label}: </span>
      <span className="text-muted">{text}</span>
    </div>
  );
}
