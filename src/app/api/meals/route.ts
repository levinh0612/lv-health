import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { meals } from "@/db/schema";

export async function GET() {
  const rows = await getDb()
    .select()
    .from(meals)
    .orderBy(desc(meals.datetime))
    .limit(100);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const [row] = await getDb()
    .insert(meals)
    .values({
      datetime: new Date(body.datetime ?? Date.now()),
      mealType: body.mealType,
      photoUrl: body.photoUrl ?? null,
      tags: body.tags ?? [],
      notes: body.notes ?? null,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
