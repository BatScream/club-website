// src/app/api/registrations/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Registration } from "@/models/registration";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await connectDB();
    const reg = await Registration.findById(id).exec();
    if (!reg) return NextResponse.json({ error: "Registration not found" }, { status: 404 });

    // delete the registration document (and its file buffers)
    await reg.deleteOne();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("delete registration error", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message || "Server error" }, { status: 500 });
  }
}
