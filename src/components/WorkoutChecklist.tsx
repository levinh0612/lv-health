"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import type { TemplateExercise } from "@/lib/workoutTemplate";

type Exercise = TemplateExercise & { done: boolean };

export default function WorkoutChecklist({
  date,
  dayType,
  title,
  duration,
  note,
  initialExercises,
  initialCompleted,
}: {
  date: string;
  dayType: string;
  title: string;
  duration: string;
  note?: string;
  initialExercises: Exercise[];
  initialCompleted: boolean;
}) {
  const router = useRouter();
  const [exercises, setExercises] = useState(initialExercises);
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();

  function persist(next: Exercise[], nextCompleted: boolean) {
    startTransition(async () => {
      await fetch("/api/workouts/day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
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
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left font-display text-[11px] uppercase text-faint">
            <th className="pb-2 pr-2 font-medium">Bài tập</th>
            <th className="pb-2 pr-2 font-medium">Hiệp × Reps</th>
            <th className="pb-2 font-medium">Nghỉ</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex, i) => (
            <tr
              key={i}
              onClick={() => toggleExercise(i)}
              className="cursor-pointer border-t border-dashed border-line"
            >
              <td className="py-2 pr-2">
                <span
                  className={clsx(
                    "mr-2 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-sm border align-middle",
                    ex.done ? "border-rust bg-rust text-paper" : "border-line"
                  )}
                >
                  {ex.done && "✓"}
                </span>
                <span
                  className={clsx(
                    "font-medium",
                    ex.done && "text-faint line-through"
                  )}
                >
                  {ex.name}
                </span>
              </td>
              <td className="py-2 pr-2 text-muted">{ex.sets}</td>
              <td className="py-2 text-muted">{ex.rest}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {completed && (
        <p className="mt-3 font-display text-xs uppercase tracking-wide text-olive">
          Hoàn thành buổi tập ✓
        </p>
      )}
    </div>
  );
}
