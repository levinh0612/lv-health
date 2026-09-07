import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { workoutDays } from "@/db/schema";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const [row] = await getDb()
    .update(workoutDays)
    .set({
      ...(body.exercises !== undefined && { exercises: body.exercises }),
      ...(body.completed !== undefined && { completed: body.completed }),
      ...(body.notes !== undefined && { notes: body.notes }),
    })
    .where(eq(workoutDays.id, Number(id)))
    .returning();

  return NextResponse.json(row);
}
