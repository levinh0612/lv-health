"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MealEstimateButton({ mealId }: { mealId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/meals/${mealId}/estimate`, { method: "POST" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="mt-0.5 text-[10px] text-steel underline disabled:opacity-50"
    >
      {loading ? "Đang chấm..." : error ? "Lỗi, thử lại" : "Chấm điểm dinh dưỡng"}
    </button>
  );
}
