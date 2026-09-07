import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { goals } from "@/db/schema";

const GOAL_ID = 1;

export async function GET() {
  const [row] = await getDb().select().from(goals).where(eq(goals.id, GOAL_ID));
  return NextResponse.json(row ?? null);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = getDb();

  const [row] = await db
    .insert(goals)
    .values({
      id: GOAL_ID,
      targetWeightKg: body.targetWeightKg,
      startWeightKg: body.startWeightKg ?? null,
      targetDate: body.targetDate ?? null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: goals.id,
      set: {
        targetWeightKg: body.targetWeightKg,
        ...(body.startWeightKg !== undefined && { startWeightKg: body.startWeightKg }),
        targetDate: body.targetDate ?? null,
        updatedAt: new Date(),
      },
    })
    .returning();

  return NextResponse.json(row);
}
