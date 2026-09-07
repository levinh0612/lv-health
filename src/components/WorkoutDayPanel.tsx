"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import WorkoutChecklist from "@/components/WorkoutChecklist";
import type { DayTemplate } from "@/lib/workoutTemplate";

type Exercise = { name: string; sets: string; rest: string; done: boolean };
type SessionRow = {
  session: number;
  dayType: string;
  title: string;
  exercises: Exercise[];
  completed: boolean;
};

export default function WorkoutDayPanel({
  date,
  template,
  dbSessions,
}: {
  date: string;
  template: DayTemplate;
  dbSessions: SessionRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const session1FromDb = dbSessions.find((s) => s.session === 1);
  const extraSessions = dbSessions.filter((s) => s.session > 1).sort((a, b) => a.session - b.session);

  const session1: SessionRow = session1FromDb
    ? session1FromDb
    : {
        session: 1,
        dayType: template.dayType,
        title: template.title,
        exercises: template.exercises.map((ex) => ({ ...ex, done: false })),
        completed: false,
      };

  const sessions = [session1, ...extraSessions];
  const [activeSession, setActiveSession] = useState(1);
  const active = sessions.find((s) => s.session === activeSession) ?? session1;

  function addSession() {
    const nextNum = Math.max(...sessions.map((s) => s.session)) + 1;
    startTransition(async () => {
      await fetch("/api/workouts/day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          session: nextNum,
          dayType: "custom",
          title: `Buổi ${nextNum}`,
          exercises: [],
          completed: false,
        }),
      });
      setActiveSession(nextNum);
      router.refresh();
    });
  }

  function removeSession(session: number) {
    startTransition(async () => {
      await fetch("/api/workouts/day", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, session }),
      });
      setActiveSession(1);
      router.refresh();
    });
  }

  return (
    <div>
      {(extraSessions.length > 0 || true) && template.dayType !== "rest" && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {sessions.map((s) => (
            <button
              key={s.session}
              onClick={() => setActiveSession(s.session)}
              className={clsx(
                "rounded-full px-3 py-1 font-display text-[11px] uppercase tracking-wide transition-colors",
                activeSession === s.session
                  ? "bg-ink text-paper"
                  : "bg-paper-dim text-muted"
              )}
            >
              Buổi {s.session}
              {s.completed && " ✓"}
            </button>
          ))}
          <button
            onClick={addSession}
            disabled={isPending}
            className="rounded-full border border-dashed border-line px-3 py-1 font-display text-[11px] uppercase tracking-wide text-muted hover:border-rust hover:text-rust"
          >
            + Thêm buổi
          </button>
          {activeSession > 1 && (
            <button
              onClick={() => removeSession(activeSession)}
              disabled={isPending}
              className="rounded-full px-3 py-1 font-display text-[11px] uppercase tracking-wide text-rust"
            >
              Xóa buổi này
            </button>
          )}
        </div>
      )}

      <WorkoutChecklist
        key={`${date}-${active.session}`}
        date={date}
        session={active.session}
        dayType={active.dayType}
        title={active.title}
        note={active.session === 1 ? template.note : undefined}
        initialExercises={active.exercises}
        initialCompleted={active.completed}
        isCustom={active.session > 1}
      />
    </div>
  );
}
