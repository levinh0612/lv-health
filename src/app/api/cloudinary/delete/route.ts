import { NextRequest, NextResponse } from "next/server";
import { deleteCloudinaryAsset } from "@/lib/cloudinaryAdmin";

export async function POST(req: NextRequest) {
  const { publicId } = await req.json();
  if (!publicId) return NextResponse.json({ error: "Thiếu publicId" }, { status: 400 });

  try {
    await deleteCloudinaryAsset(publicId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Xóa ảnh thất bại" },
      { status: 500 }
    );
  }
}
