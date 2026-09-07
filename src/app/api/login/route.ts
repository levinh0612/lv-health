import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!process.env.APP_PASSWORD) {
    return NextResponse.json(
      { error: "APP_PASSWORD chưa được cấu hình trên server" },
      { status: 500 }
    );
  }

  if (password !== process.env.APP_PASSWORD) {
    return NextResponse.json({ error: "Sai mật khẩu" }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
