"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import type { TemplateExercise } from "@/lib/workoutTemplate";
import { EXERCISE_IMAGES } from "@/lib/workoutTemplate";
import ZoomableImage from "@/components/ZoomableImage";

type Exercise = TemplateExercise & { done: boolean };

export default function WorkoutChecklist({
  date,
  session,
  dayType,
  title,
  note,
  initialExercises,
  initialCompleted,
  isCustom = false,
}: {
  date: string;
  session: number;
  dayType: string;
  title: string;
  duration?: string;
  note?: string;
  initialExercises: Exercise[];
  initialCompleted: boolean;
  isCustom?: boolean;
}) {
  const router = useRouter();
  const [exercises, setExercises] = useState(initialExercises);
  const [completed, setCompleted] = useState(initialCompleted);
  const [newExercise, setNewExercise] = useState({ name: "", sets: "", rest: "" });
  const [isPending, startTransition] = useTransition();

  function persist(next: Exercise[], nextCompleted: boolean) {
    startTransition(async () => {
      await fetch("/api/workouts/day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          session,
          dayType,
          title,
          exercises: next,
          completed: nextCompleted,
        }),
      });
      router.refresh();
    });
  }

  function toggleExercise(i: number) {
    const next = exercises.map((ex, idx) =>
      idx === i ? { ...ex, done: !ex.done } : ex
    );
    const allDone = next.length > 0 && next.every((ex) => ex.done);
    setExercises(next);
    setCompleted(allDone);
    persist(next, allDone);
  }

  function removeExercise(i: number) {
    const next = exercises.filter((_, idx) => idx !== i);
    setExercises(next);
    persist(next, next.length > 0 && next.every((ex) => ex.done));
  }

  function addExercise() {
    if (!newExercise.name.trim()) return;
    const next = [...exercises, { ...newExercise, done: false }];
    setExercises(next);
    setNewExercise({ name: "", sets: "", rest: "" });
    persist(next, false);
  }

  function toggleRestDay() {
    const next = !completed;
    setCompleted(next);
    persist(exercises, next);
  }

  if (dayType === "rest") {
    return (
      <div className="rounded-sm border border-line bg-paper-card p-4">
        <p className="text-sm text-muted">{note}</p>
        <button
          onClick={toggleRestDay}
          disabled={isPending}
          className={clsx(
            "mt-4 w-full rounded-sm border py-3 font-display text-sm uppercase tracking-wide transition-colors",
            completed
              ? "border-olive bg-olive text-paper"
              : "border-line text-muted"
          )}
        >
          {completed ? "Đã nghỉ / thực hiện ✓" : "Đánh dấu hoàn thành"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-line bg-paper-card p-4">
      {note && <p className="mb-3 text-sm text-muted">{note}</p>}

      {exercises.length === 0 && (
        <p className="mb-3 text-sm text-faint">Chưa có bài tập nào — thêm bài bên dưới.</p>
      )}

      <div className="space-y-2">
        {exercises.map((ex, i) => {
          const img = EXERCISE_IMAGES[ex.name];
          return (
            <div
              key={i}
              className="flex items-center gap-3 border-t border-dashed border-line pt-2 first:border-t-0 first:pt-0"
            >
              {img && (
                <ZoomableImage
                  src={img}
                  alt={ex.name}
                  sizes="44px"
                  className="h-11 w-11 flex-shrink-0 rounded-sm border border-line"
                />
              )}
              <button
                type="button"
                onClick={() => toggleExercise(i)}
                className="flex flex-1 items-center gap-2 text-left"
              >
                <span
                  className={clsx(
                    "inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm border",
                    ex.done ? "border-rust bg-rust text-paper" : "border-line"
                  )}
                >
                  {ex.done && "✓"}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={clsx(
                      "block truncate text-sm font-medium",
                      ex.done && "text-faint line-through"
                    )}
                  >
                    {ex.name}
                  </span>
                  <span className="block text-xs text-muted">
                    {ex.sets} · nghỉ {ex.rest}
                  </span>
                </span>
              </button>
              {isCustom && (
                <button
                  type="button"
                  onClick={() => removeExercise(i)}
                  className="flex-shrink-0 px-1 text-faint hover:text-rust"
                  aria-label="Xóa bài tập"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isCustom && (
        <div className="mt-4 grid grid-cols-[1fr_auto_auto_auto] gap-1.5 border-t border-dashed border-line pt-3">
          <input
            placeholder="Tên bài tập"
            value={newExercise.name}
            onChange={(e) => setNewExercise((p) => ({ ...p, name: e.target.value }))}
            className="min-w-0 rounded-sm border border-line bg-white px-2 py-1.5 text-xs outline-none focus:border-steel"
          />
          <input
            placeholder="Hiệp×Reps"
            value={newExercise.sets}
            onChange={(e) => setNewExercise((p) => ({ ...p, sets: e.target.value }))}
            className="w-20 rounded-sm border border-line bg-white px-2 py-1.5 text-xs outline-none focus:border-steel"
          />
          <input
            placeholder="Nghỉ"
            value={newExercise.rest}
            onChange={(e) => setNewExercise((p) => ({ ...p, rest: e.target.value }))}
            className="w-14 rounded-sm border border-line bg-white px-2 py-1.5 text-xs outline-none focus:border-steel"
          />
          <button
            type="button"
            onClick={addExercise}
            className="rounded-sm bg-ink px-2.5 text-xs text-paper"
          >
            +
          </button>
        </div>
      )}

      {completed && exercises.length > 0 && (
        <p className="mt-3 font-display text-xs uppercase tracking-wide text-olive">
          Hoàn thành buổi tập ✓
        </p>
      )}
    </div>
  );
}
