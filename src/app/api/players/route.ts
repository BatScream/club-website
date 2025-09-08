// app/api/players/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Player } from "@/models/player";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, age, jersey } = body ?? {};

    if (!name || !age || !jersey) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const player = new Player({ name, age, jersey });
    await player.save();

    return NextResponse.json({ message: "Player registered", player }, { status: 201 });
  } catch (err: unknown) {
    // safe narrow
    if (err instanceof Error) {
      console.error("POST /api/players error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    console.error("POST /api/players unexpected error:", err);
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

