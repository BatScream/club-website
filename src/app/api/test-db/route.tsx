import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Player } from "@/models/player";

export async function GET() {
  try {
    await connectDB();
    const count = await Player.countDocuments();
    const sample = await Player.findOne().lean().exec();

    return NextResponse.json({ ok: true, count, sample });
  } catch (err: unknown) {
    // Safe type narrowing
    if (err instanceof Error) {
      console.error("GET /api/test-db error:", err.message);
      return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
    }

    console.error("GET /api/test-db unknown error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
