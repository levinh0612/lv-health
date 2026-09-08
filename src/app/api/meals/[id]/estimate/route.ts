import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { meals } from "@/db/schema";
import { estimateMealNutrition } from "@/lib/gemini";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const [meal] = await db.select().from(meals).where(eq(meals.id, Number(id)));
  if (!meal) return NextResponse.json({ error: "Không tìm thấy bữa ăn" }, { status: 404 });
  if (!meal.photoUrl) return NextResponse.json({ error: "Bữa ăn này không có ảnh" }, { status: 400 });

  try {
    const imageRes = await fetch(meal.photoUrl);
    if (!imageRes.ok) throw new Error("Không tải được ảnh");
    const mimeType = imageRes.headers.get("content-type") ?? "image/jpeg";
    const buffer = Buffer.from(await imageRes.arrayBuffer());
    const base64 = buffer.toString("base64");

    const data = await estimateMealNutrition(base64, mimeType);

    const [row] = await db
      .update(meals)
      .set({
        calories: data.calories,
        proteinG: data.proteinG,
        carbsG: data.carbsG,
        fatG: data.fatG,
        nutritionNote: data.note ?? null,
        nutritionItems: data.items?.length > 0 ? data.items : null,
      })
      .where(eq(meals.id, Number(id)))
      .returning();

    return NextResponse.json(row);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ước tính thất bại" },
      { status: 500 }
    );
  }
}
