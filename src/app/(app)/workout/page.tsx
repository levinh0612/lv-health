import { and, gte, lte } from "drizzle-orm";
import { addDays, format, startOfWeek } from "date-fns";
import clsx from "clsx";
import { getDb } from "@/db";
import { workoutDays } from "@/db/schema";
import { WORKOUT_TEMPLATE, DOW_LABEL } from "@/lib/workoutTemplate";
import SectionHead from "@/components/SectionHead";
import WorkoutChecklist from "@/components/WorkoutChecklist";

export const dynamic = "force-dynamic";

export default async function WorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const selectedDate = dateParam ?? format(new Date(), "yyyy-MM-dd");
  const selected = new Date(selectedDate + "T00:00:00");

  const weekStart = startOfWeek(selected, { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) =>
    format(addDays(weekStart, i), "yyyy-MM-dd")
  );

  const rows = await getDb()
    .select()
    .from(workoutDays)
    .where(
      and(
        gte(workoutDays.date, weekDates[0]),
        lte(workoutDays.date, weekDates[6])
      )
    );

  const rowByDate = new Map(rows.map((r) => [r.date, r]));

  const selectedTemplate = WORKOUT_TEMPLATE[selected.getDay()];
  const selectedRow = rowByDate.get(selectedDate);
  const selectedExercises = (
    selectedRow?.exercises?.length ? selectedRow.exercises : selectedTemplate.exercises
  ).map((ex) => ({ ...ex, done: "done" in ex ? Boolean(ex.done) : false }));

  return (
    <div className="rise-in">
      <p className="font-display text-sm uppercase tracking-[0.08em] text-rust">
        Lịch tập
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold uppercase text-ink">
        Workout
      </h1>

      <div className="mt-6 grid grid-cols-7 gap-1.5">
        {weekDates.map((d) => {
          const dow = new Date(d + "T00:00:00").getDay();
          const t = WORKOUT_TEMPLATE[dow];
          const row = rowByDate.get(d);
          const done = row?.completed;
          const isSelected = d === selectedDate;

          return (
            <a
              key={d}
              href={`/workout?date=${d}`}
              className={clsx(
                "flex flex-col items-center rounded-sm border p-2 text-center",
                isSelected
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-paper-card text-ink"
              )}
            >
              <span className="font-display text-[10px] uppercase opacity-70">
                {DOW_LABEL[dow].replace("Thứ ", "T")}
              </span>
              <span
                className={clsx(
                  "mt-1 text-[10px] font-medium",
                  !isSelected &&
                    (t.dayType === "strength"
                      ? "text-steel"
                      : t.dayType === "cardio"
                        ? "text-rust"
                        : t.dayType === "hiit"
                          ? "text-rust-soft"
                          : "text-faint")
                )}
              >
                {t.title}
              </span>
              {done && <span className="mt-1 text-[10px]">✓</span>}
            </a>
          );
        })}
      </div>

      <SectionHead
        title={`${DOW_LABEL[selected.getDay()]} · ${selectedTemplate.title}`}
        note={selectedTemplate.duration}
      />

      <WorkoutChecklist
        date={selectedDate}
        dayType={selectedTemplate.dayType}
        title={selectedTemplate.title}
        duration={selectedTemplate.duration}
        note={selectedTemplate.note}
        initialExercises={selectedExercises}
        initialCompleted={selectedRow?.completed ?? false}
      />
    </div>
  );
}
