// app/api/test-db/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Player } from "@/models/player"; // adjust import path if needed

export async function GET() {
  try {
    await connectDB();
    const count = await Player.countDocuments();
    const one = await Player.findOne().lean().limit(1);

    return NextResponse.json({ ok: true, count, sample: one ?? null });
  } catch (err: any) {
    console.error("GET /api/test-db error:", err);
    return NextResponse.json({ ok: false, error: err.message ?? String(err), stack: err.stack ?? null }, { status: 500 });
  }
}
