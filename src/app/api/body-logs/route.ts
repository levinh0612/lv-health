import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { bodyLogs } from "@/db/schema";

export async function GET() {
  const rows = await getDb()
    .select()
    .from(bodyLogs)
    .orderBy(desc(bodyLogs.date));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const [row] = await getDb()
    .insert(bodyLogs)
    .values({
      date: body.date,
      weightKg: body.weightKg ?? null,
      bodyFatKg: body.bodyFatKg ?? null,
      bodyFatPercent: body.bodyFatPercent ?? null,
      skeletalMuscleKg: body.skeletalMuscleKg ?? null,
      photoUrls: body.photoUrls ?? [],
      measurements: body.measurements ?? null,
      notes: body.notes ?? null,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
