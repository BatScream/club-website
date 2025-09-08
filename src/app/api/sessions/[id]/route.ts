// src/app/api/sessions/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Session } from "@/models/session";
import { Types } from "mongoose";

type UpdateBody = { attendees?: string[] };

export async function GET(_request: NextRequest, context: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    // params can be a Promise in some runtimes — await it to be safe
    const params = await context.params;
    const { id } = params;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await connectDB();
    const raw = await Session.findById(id).lean().exec();
    if (!raw) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const session = {
      _id: String((raw as { _id: unknown })._id),
      date: raw.date,
      name: raw.name,
      attendees: (raw.attendees ?? []).map((x: unknown) => String(x)),
      createdAt: raw.createdAt,
    };

    return NextResponse.json({ ok: true, session });
  } catch (err: unknown) {
    console.error("GET /api/sessions/:id error:", err);
    if (err instanceof Error) return NextResponse.json({ error: err.message }, { status: 500 });
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = (await request.json()) as UpdateBody | undefined;
    if (!body) return NextResponse.json({ error: "Missing body" }, { status: 400 });

    await connectDB();

    const update: Record<string, unknown> = {};
    if (Array.isArray(body.attendees)) {
      // Types.ObjectId is a constructor; use new Types.ObjectId(...)
      update.attendees = body.attendees.map((s) => new Types.ObjectId(s));
    }

    const updated = await Session.findByIdAndUpdate(id, update, { new: true }).lean().exec();
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const session = {
      _id: String((updated as { _id: unknown })._id),
      date: updated.date,
      name: updated.name,
      attendees: (updated.attendees ?? []).map((x: unknown) => String(x)),
      createdAt: updated.createdAt,
    };

    return NextResponse.json({ ok: true, session });
  } catch (err: unknown) {
    console.error("PUT /api/sessions/:id error:", err);
    if (err instanceof Error) return NextResponse.json({ error: err.message }, { status: 500 });
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
