import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { inbodyScans } from "@/db/schema";

export async function GET() {
  const rows = await getDb()
    .select()
    .from(inbodyScans)
    .orderBy(desc(inbodyScans.date));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const [row] = await getDb()
    .insert(inbodyScans)
    .values({
      date: body.date,
      weightKg: body.weightKg ?? null,
      bmi: body.bmi ?? null,
      bodyFatKg: body.bodyFatKg ?? null,
      bodyFatPercent: body.bodyFatPercent ?? null,
      skeletalMuscleKg: body.skeletalMuscleKg ?? null,
      visceralFatLevel: body.visceralFatLevel ?? null,
      bmrKcal: body.bmrKcal ?? null,
      desirableWeightKg: body.desirableWeightKg ?? null,
      photoUrl: body.photoUrl ?? null,
      segmentFat: body.segmentFat ?? null,
      segmentMuscle: body.segmentMuscle ?? null,
      rawData: body.rawData ?? null,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
