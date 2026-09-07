import { NextRequest, NextResponse } from "next/server";
import { and, gte, lte } from "drizzle-orm";
import { addDays, format, startOfWeek } from "date-fns";
import { getDb } from "@/db";
import { workoutDays } from "@/db/schema";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ error: "Thiếu date" }, { status: 400 });

  const selected = new Date(`${date}T00:00:00`);
  const weekStart = startOfWeek(selected, { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) => format(addDays(weekStart, i), "yyyy-MM-dd"));

  const rows = await getDb()
    .select()
    .from(workoutDays)
    .where(and(gte(workoutDays.date, weekDates[0]), lte(workoutDays.date, weekDates[6])));

  return NextResponse.json({ weekDates, rows });
}
