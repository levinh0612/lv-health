"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Goal = {
  targetWeightKg: number;
  startWeightKg: number | null;
  targetDate: string | null;
} | null;

const MOTIVATION = {
  reached: ["🎉 Đã đạt mục tiêu! Bạn làm được rồi!", "🏆 Xuất sắc — mục tiêu đã hoàn thành!"],
  high: ["💪 Hơn nửa chặng đường rồi, cố lên!", "🔥 Tiến bộ rõ rệt — đừng dừng lại!"],
  some: ["🚶 Đang tiến bộ từng chút một, giữ nhịp nhé!", "📈 Có tiến triển rồi, tiếp tục phát huy!"],
  none: ["🌱 Mỗi ngày kiên trì là một bước tiến.", "☀️ Bắt đầu lại hôm nay cũng không sao — cứ đều đặn là được!"],
};

function pick(arr: string[]) {
  return arr[Math.floor(Date.now() / 86400000) % arr.length];
}

export default function GoalCard({
  initialGoal,
  currentWeight,
}: {
  initialGoal: Goal;
  currentWeight?: number | null;
}) {
  const router = useRouter();
  const [goal, setGoal] = useState(initialGoal);
  const [editing, setEditing] = useState(!initialGoal);
  const [targetWeightKg, setTargetWeightKg] = useState(
    initialGoal ? String(initialGoal.targetWeightKg) : ""
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!targetWeightKg) return;
    setSaving(true);
    try {
      const res = await fetch("/api/goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetWeightKg: Number(targetWeightKg),
          startWeightKg: goal?.startWeightKg ?? currentWeight ?? null,
        }),
      });
      const data = await res.json();
      setGoal(data);
      setEditing(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <div className="rounded-sm border border-line bg-paper-card p-4">
        <div className="mb-2 font-display text-xs uppercase tracking-wide text-faint">
          Mục tiêu cân nặng
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            placeholder="Cân nặng mục tiêu (kg)"
            value={targetWeightKg}
            onChange={(e) => setTargetWeightKg(e.target.value)}
            className="flex-1 rounded-sm border border-line bg-white px-3 py-2 text-sm outline-none focus:border-steel"
          />
          <button
            onClick={handleSave}
            disabled={saving || !targetWeightKg}
            className="rounded-sm bg-ink px-4 text-sm text-paper disabled:opacity-40"
          >
            {saving ? "..." : "Lưu"}
          </button>
        </div>
      </div>
    );
  }

  if (!goal) return null;

  const start = goal.startWeightKg ?? currentWeight ?? goal.targetWeightKg;
  const current = currentWeight ?? start;
  const target = goal.targetWeightKg;

  const totalDelta = start - target;
  const doneDelta = start - current;
  const progress =
    totalDelta === 0 ? 100 : Math.min(100, Math.max(0, (doneDelta / totalDelta) * 100));
  const reached = target >= start ? current >= target : current <= target;

  const tier = reached ? "reached" : progress >= 50 ? "high" : progress > 0 ? "some" : "none";
  const message = pick(MOTIVATION[tier]);

  return (
    <div className="rounded-sm border border-line bg-paper-card p-4">
      <div className="flex items-center justify-between">
        <div className="font-display text-xs uppercase tracking-wide text-faint">
          Mục tiêu cân nặng
        </div>
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-steel underline-offset-2 hover:underline"
        >
          Sửa
        </button>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-2xl text-ink">{current} kg</span>
        <span className="text-sm text-muted">→ {target} kg</span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-paper-dim">
        <div
          className="h-full bg-olive transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-ink">{message}</p>
    </div>
  );
}
