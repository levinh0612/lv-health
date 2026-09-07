import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { workoutDays } from "@/db/schema";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = getDb();

  const [row] = await db
    .insert(workoutDays)
    .values({
      date: body.date,
      dayType: body.dayType,
      title: body.title,
      exercises: body.exercises ?? [],
      completed: body.completed ?? false,
      notes: body.notes ?? null,
    })
    .onConflictDoUpdate({
      target: workoutDays.date,
      set: {
        exercises: body.exercises ?? [],
        completed: body.completed ?? false,
        notes: body.notes ?? null,
      },
    })
    .returning();

  return NextResponse.json(row);
}
