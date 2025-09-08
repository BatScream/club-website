// app/api/players/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Player } from "@/models/player"; // adjust path if you put models in lib/models

const isDev = process.env.NODE_ENV !== "production";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, age, jersey } = body ?? {};

    if (!name || !age || !jersey) {
      return NextResponse.json({ error: "Missing fields (name, age, jersey required)" }, { status: 400 });
    }

    // connect to DB
    await connectDB();

    const player = new Player({ name, age, jersey });
    await player.save();

    return NextResponse.json({ message: "Player registered", player }, { status: 201 });
  } catch (err: any) {
    // Log server-side (console will show in terminal / hosting logs)
    console.error("POST /api/players error:", err);

    // In dev, return the actual message/stack too for easier debugging
    if (isDev) {
      return NextResponse.json(
        { error: "Something went wrong", message: err.message ?? String(err), stack: err.stack ?? null },
        { status: 500 }
      );
    }

    // Generic response for production
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
