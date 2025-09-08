// src/app/api/sessions/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Session } from "@/models/session";

type CreateBody = { date: string; name: string };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateBody | undefined;
    if (!body || !body.date || !body.name) {
      return NextResponse.json({ error: "Missing fields: date and name required" }, { status: 400 });
    }

    await connectDB();

    const sess = new Session({
      date: new Date(body.date),
      name: body.name,
      attendees: [],
    });

    await sess.save();

    return NextResponse.json({
      ok: true,
      session: {
        _id: sess._id.toString(),
        date: sess.date,
        name: sess.name,
        attendees: [],
        createdAt: sess.createdAt,
      },
    }, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/sessions error:", err);
    if (err instanceof Error) return NextResponse.json({ error: err.message }, { status: 500 });
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    // return recent sessions (sorted by date desc)
    const raw = await Session.find().sort({ date: -1 }).limit(200).lean().exec();

    const sessions = raw.map((r) => ({
      _id: String((r as { _id: unknown })._id),
      date: r.date,
      name: r.name,
      attendees: (r.attendees ?? []).map((id: unknown) => String(id)),
      createdAt: r.createdAt,
    }));

    return NextResponse.json({ ok: true, sessions });
  } catch (err: unknown) {
    console.error("GET /api/sessions error:", err);
    if (err instanceof Error) return NextResponse.json({ error: err.message }, { status: 500 });
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
