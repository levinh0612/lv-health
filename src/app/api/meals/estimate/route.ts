import { NextRequest, NextResponse } from "next/server";
import { estimateMealNutrition } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { photoUrl } = await req.json();
  if (!photoUrl) {
    return NextResponse.json({ error: "Thiếu photoUrl" }, { status: 400 });
  }

  try {
    const imageRes = await fetch(photoUrl);
    if (!imageRes.ok) throw new Error("Không tải được ảnh");
    const mimeType = imageRes.headers.get("content-type") ?? "image/jpeg";
    const buffer = Buffer.from(await imageRes.arrayBuffer());
    const base64 = buffer.toString("base64");

    const data = await estimateMealNutrition(base64, mimeType);
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Ước tính thất bại" },
      { status: 500 }
    );
  }
}
