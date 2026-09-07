import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { inbodyScans, bodyLogs, goals, meals } from "@/db/schema";
import { WORKOUT_TEMPLATE } from "@/lib/workoutTemplate";
import { suggestMeals } from "@/lib/gemini";

export async function POST() {
  const db = getDb();

  const [latestScan, latestLog, goalRows, recentMeals] = await Promise.all([
    db.select().from(inbodyScans).orderBy(desc(inbodyScans.date)).limit(1),
    db.select().from(bodyLogs).orderBy(desc(bodyLogs.date)).limit(1),
    db.select().from(goals).limit(1),
    db.select().from(meals).orderBy(desc(meals.datetime)).limit(5),
  ]);

  const scan = latestScan[0];
  const log = latestLog[0];
  const goal = goalRows[0];
  const todayTemplate = WORKOUT_TEMPLATE[new Date().getDay()];

  try {
    const suggestion = await suggestMeals({
      weightKg: log?.weightKg ?? scan?.weightKg,
      bodyFatPercent: log?.bodyFatKg && scan?.weightKg ? undefined : scan?.bodyFatPercent,
      bmi: scan?.bmi,
      targetWeightKg: goal?.targetWeightKg,
      workoutTitle: todayTemplate.title,
      workoutType: todayTemplate.dayType,
      recentMealNotes: recentMeals.map((m) => m.notes).filter((n): n is string => !!n),
    });
    return NextResponse.json(suggestion);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gợi ý thất bại" },
      { status: 500 }
    );
  }
}
