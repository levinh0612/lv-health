import { NextRequest, NextResponse } from "next/server";
import { and, eq, gte, lte } from "drizzle-orm";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { getDb } from "@/db";
import { workoutDays } from "@/db/schema";

export async function GET(req: NextRequest) {
  const month = req.nextUrl.searchParams.get("month");
  if (!month) return NextResponse.json({ error: "Thiếu month" }, { status: 400 });

  const monthDate = new Date(`${month}-01T00:00:00`);
  const monthStart = format(startOfMonth(monthDate), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(monthDate), "yyyy-MM-dd");

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

  return NextResponse.json(rows);
}
