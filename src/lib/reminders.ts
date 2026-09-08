import { and, eq, gte, lte } from "drizzle-orm";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { getDb } from "@/db";
import { bodyLogs, meals, workoutDays } from "@/db/schema";
import { WORKOUT_TEMPLATE } from "@/lib/workoutTemplate";

export type Reminders = {
  workoutPending: boolean;
  mealPending: boolean;
  mealWindowLabel: string | null;
  bodyLogPending: boolean;
};

// Meal windows are approximate — just enough to nudge "you haven't logged
// today's lunch yet" without being exact about mealtimes.
function currentMealWindow(hour: number): { type: string; label: string } {
  if (hour < 10) return { type: "sang", label: "sáng" };
  if (hour < 15) return { type: "trua", label: "trưa" };
  return { type: "toi", label: "tối" };
}

export async function getReminders(): Promise<Reminders> {
  const db = getDb();
  const now = new Date();
  const todayStr = format(now, "yyyy-MM-dd");
  const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnd = format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");
  const dayType = WORKOUT_TEMPLATE[now.getDay()].dayType;
  const window = currentMealWindow(now.getHours());

  const [workoutRows, todayMeals, weekBodyLogs] = await Promise.all([
    db
      .select({ completed: workoutDays.completed })
      .from(workoutDays)
      .where(and(eq(workoutDays.date, todayStr), eq(workoutDays.session, 1))),
    db
      .select({ mealType: meals.mealType })
      .from(meals)
      .where(
        and(
          gte(meals.datetime, new Date(`${todayStr}T00:00:00`)),
          lte(meals.datetime, new Date(`${todayStr}T23:59:59`))
        )
      ),
    db
      .select({ id: bodyLogs.id })
      .from(bodyLogs)
      .where(and(gte(bodyLogs.date, weekStart), lte(bodyLogs.date, weekEnd))),
  ]);

  const workoutPending = dayType !== "rest" && !(workoutRows[0]?.completed ?? false);
  const mealPending = !todayMeals.some((m) => m.mealType === window.type);
  const bodyLogPending = weekBodyLogs.length === 0;

  return {
    workoutPending,
    mealPending,
    mealWindowLabel: mealPending ? window.label : null,
    bodyLogPending,
  };
}
