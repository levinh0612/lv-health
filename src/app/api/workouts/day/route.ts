import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { workoutDays } from "@/db/schema";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = getDb();
  const session = body.session ?? 1;

  const [row] = await db
    .insert(workoutDays)
    .values({
      date: body.date,
      session,
      dayType: body.dayType,
      title: body.title,
      exercises: body.exercises ?? [],
      completed: body.completed ?? false,
      notes: body.notes ?? null,
    })
    .onConflictDoUpdate({
      target: [workoutDays.date, workoutDays.session],
      set: {
        dayType: body.dayType,
        title: body.title,
        exercises: body.exercises ?? [],
        completed: body.completed ?? false,
        notes: body.notes ?? null,
      },
    })
    .returning();

  return NextResponse.json(row);
}

export async function DELETE(req: NextRequest) {
  const { date, session } = await req.json();
  await getDb()
    .delete(workoutDays)
    .where(and(eq(workoutDays.date, date), eq(workoutDays.session, session)));
  return NextResponse.json({ ok: true });
}
