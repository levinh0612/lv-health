import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { workoutDays } from "@/db/schema";

export async function GET() {
  const rows = await getDb()
    .select()
    .from(workoutDays)
    .orderBy(desc(workoutDays.date));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const [row] = await getDb()
    .insert(workoutDays)
    .values({
      date: body.date,
      dayType: body.dayType,
      title: body.title,
      exercises: body.exercises ?? [],
      completed: body.completed ?? false,
      notes: body.notes ?? null,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
