import { and, eq, gte, lte } from "drizzle-orm";
import { addDays, endOfMonth, format, startOfMonth, startOfWeek } from "date-fns";
import { getDb } from "@/db";
import { workoutDays } from "@/db/schema";
import WorkoutClient from "@/components/WorkoutClient";
import type { SessionRow } from "@/components/WorkoutDayPanel";

export const dynamic = "force-dynamic";

export default async function WorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; view?: string; month?: string }>;
}) {
  const { date: dateParam, view, month: monthParam } = await searchParams;
  const initialView = view === "month" ? "month" : "week";

  const selectedDate = dateParam ?? format(new Date(), "yyyy-MM-dd");
  const selected = new Date(selectedDate + "T00:00:00");
  const weekStart = startOfWeek(selected, { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) =>
    format(addDays(weekStart, i), "yyyy-MM-dd")
  );

  const month = monthParam ?? format(new Date(), "yyyy-MM");
  const monthStart = format(startOfMonth(new Date(`${month}-01`)), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(new Date(`${month}-01`)), "yyyy-MM-dd");

  const [weekRows, monthRows] = await Promise.all([
    getDb()
      .select()
      .from(workoutDays)
      .where(and(gte(workoutDays.date, weekDates[0]), lte(workoutDays.date, weekDates[6]))),
    getDb()
      .select({ date: workoutDays.date, completed: workoutDays.completed })
      .from(workoutDays)
      .where(
        and(
          eq(workoutDays.session, 1),
          gte(workoutDays.date, monthStart),
          lte(workoutDays.date, monthEnd)
        )
      ),
  ]);

  const weekRowsByDate: Record<string, SessionRow[]> = {};
  for (const r of weekRows) {
    const list = weekRowsByDate[r.date] ?? [];
    list.push({
      session: r.session,
      dayType: r.dayType,
      title: r.title,
      completed: r.completed,
      exercises: (r.exercises ?? []).map((ex) => ({
        ...ex,
        done: "done" in ex ? Boolean(ex.done) : false,
      })),
    });
    weekRowsByDate[r.date] = list;
  }

  return (
    <WorkoutClient
      initialView={initialView}
      weekDates={weekDates}
      weekRowsByDate={weekRowsByDate}
      selectedDate={selectedDate}
      month={month}
      monthRows={monthRows}
    />
  );
}
