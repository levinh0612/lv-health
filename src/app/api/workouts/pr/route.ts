import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { workoutDays } from "@/db/schema";
import { computePrMap } from "@/lib/strength";

export async function GET() {
  const rows = await getDb()
    .select({ date: workoutDays.date, exercises: workoutDays.exercises })
    .from(workoutDays);

  return NextResponse.json(computePrMap(rows));
}
