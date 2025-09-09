// src/app/api/registrations/[id]/approve/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Registration } from "@/models/registration";
import { Player } from "@/models/player";

export async function POST(_request: Request, context: { params: Promise<{ id: string }>}) {
  const parameters = await context.params;  
  const { id } = parameters;

  await connectDB();

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const reg = await Registration.findById(id).session(session).exec();
    if (!reg) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    // Build player payload with only basic profile fields (do NOT copy all registration fields)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerPayload: any = {
      name: reg.playerName,
      email: reg.email,
      dob: reg.dob,
      gender: reg.gender,
      phone: reg.phone,
      emergencyContact: reg.emergencyContact,
      parentName: reg.parentName,
      parentContact: reg.parentContact,
      registrationId: reg._id, // reference to source registration
    };

    // Create the player document
    const player = new Player(playerPayload);
    await player.save({ session });

    // mark registration as approved and set playerId for two-way link
    reg.status = "approved";
    await reg.save({ session });

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ ok: true, playerId: player._id });
  } catch (err) {
    try {
      await session.abortTransaction();
      session.endSession();
    } catch {}
    console.error("approve registration error:", err);
    const message =
    err instanceof Error ? err.message : "Server error during approval";
    return NextResponse.json({ error: message || "Server error during approval" }, { status: 500 });
  }
}
