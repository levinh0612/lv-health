import { and, eq, gte, lte } from "drizzle-orm";
import { addDays, endOfMonth, format, startOfMonth, startOfWeek } from "date-fns";
import clsx from "clsx";
import { getDb } from "@/db";
import { workoutDays } from "@/db/schema";
import { WORKOUT_TEMPLATE, DOW_LABEL } from "@/lib/workoutTemplate";
import SectionHead from "@/components/SectionHead";
import WorkoutDayPanel from "@/components/WorkoutDayPanel";
import WorkoutMonthView from "@/components/WorkoutMonthView";

export const dynamic = "force-dynamic";

export default async function WorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; view?: string; month?: string }>;
}) {
  const { date: dateParam, view, month: monthParam } = await searchParams;
  const isMonthView = view === "month";

  const weekLinkHref = "/workout";
  const monthLinkHref = `/workout?view=month${monthParam ? `&month=${monthParam}` : ""}`;

  if (isMonthView) {
    const month = monthParam ?? format(new Date(), "yyyy-MM");
    const monthStart = format(startOfMonth(new Date(`${month}-01`)), "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(new Date(`${month}-01`)), "yyyy-MM-dd");

    const rows = await getDb()
      .select({ date: workoutDays.date, completed: workoutDays.completed })
      .from(workoutDays)
      .where(
        and(
          eq(workoutDays.session, 1),
          gte(workoutDays.date, monthStart),
          lte(workoutDays.date, monthEnd)
        )
      );

    return (
      <div className="rise-in">
        <p className="font-display text-sm uppercase tracking-[0.08em] text-rust">
          Lịch tập
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold uppercase text-ink">
          Workout
        </h1>

        <ViewTabs weekHref={weekLinkHref} monthHref={monthLinkHref} active="month" />

        <div className="mt-4">
          <WorkoutMonthView monthParam={month} rows={rows} />
        </div>
      </div>
    );
  }

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

  const rowsByDate = new Map<string, typeof rows>();
  for (const r of rows) {
    const list = rowsByDate.get(r.date) ?? [];
    list.push(r);
    rowsByDate.set(r.date, list);
  }

  const selectedTemplate = WORKOUT_TEMPLATE[selected.getDay()];
  const selectedSessions = (rowsByDate.get(selectedDate) ?? []).map((r) => ({
    session: r.session,
    dayType: r.dayType,
    title: r.title,
    completed: r.completed,
    exercises: (r.exercises ?? []).map((ex) => ({
      ...ex,
      done: "done" in ex ? Boolean(ex.done) : false,
    })),
  }));

  return (
    <div className="rise-in">
      <p className="font-display text-sm uppercase tracking-[0.08em] text-rust">
        Lịch tập
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold uppercase text-ink">
        Workout
      </h1>

      <ViewTabs weekHref={weekLinkHref} monthHref={monthLinkHref} active="week" />

      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {weekDates.map((d) => {
          const dow = new Date(d + "T00:00:00").getDay();
          const t = WORKOUT_TEMPLATE[dow];
          const daySessions = rowsByDate.get(d) ?? [];
          const primary = daySessions.find((r) => r.session === 1);
          const done = primary?.completed;
          const extraCount = daySessions.filter((r) => r.session > 1).length;
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
              <span className="mt-1 text-[10px]">
                {done && "✓"}
                {extraCount > 0 && ` +${extraCount}`}
              </span>
            </a>
          );
        })}
      </div>

      <SectionHead
        title={`${DOW_LABEL[selected.getDay()]} · ${selectedTemplate.title}`}
        note={selectedTemplate.duration}
      />

      <WorkoutDayPanel
        date={selectedDate}
        template={selectedTemplate}
        dbSessions={selectedSessions}
      />
    </div>
  );
}

function ViewTabs({
  weekHref,
  monthHref,
  active,
}: {
  weekHref: string;
  monthHref: string;
  active: "week" | "month";
}) {
  return (
    <div className="mt-5 flex gap-1.5">
      <a
        href={weekHref}
        className={clsx(
          "rounded-full px-3 py-1 font-display text-[11px] uppercase tracking-wide transition-colors",
          active === "week" ? "bg-ink text-paper" : "bg-paper-dim text-muted"
        )}
      >
        Tuần này
      </a>
      <a
        href={monthHref}
        className={clsx(
          "rounded-full px-3 py-1 font-display text-[11px] uppercase tracking-wide transition-colors",
          active === "month" ? "bg-ink text-paper" : "bg-paper-dim text-muted"
        )}
      >
        Theo tháng
      </a>
    </div>
  );
}
