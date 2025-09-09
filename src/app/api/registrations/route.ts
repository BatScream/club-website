// src/app/api/registrations/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Registration } from "@/models/registration";
import type { IRegistration } from "@/models/registration";


type FileRefInput = {
  filename: string;
  contentType?: string;
  size?: number;
  key: string; // S3 object key
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isFileRef(obj: any): obj is FileRefInput {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.filename === "string" &&
    typeof obj.key === "string"
  );
}

export async function POST(request: Request) {
  try {
    // Expect JSON body
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Basic required fields
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const playerName = typeof body.playerName === "string" ? body.playerName.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const emergencyContact = typeof body.emergencyContact === "string" ? body.emergencyContact.trim() : "";

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }
    if (!playerName) {
      return NextResponse.json({ error: "playerName is required" }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ error: "phone is required" }, { status: 400 });
    }
    if (!emergencyContact) {
      return NextResponse.json({ error: "emergencyContact is required" }, { status: 400 });
    }

    // Optional fields
    const dob = body.dob ? new Date(body.dob) : undefined;
    const gender = typeof body.gender === "string" ? body.gender : undefined;
    const parentName = typeof body.parentName === "string" ? body.parentName : undefined;
    const parentContact = typeof body.parentContact === "string" ? body.parentContact : undefined;

    const position = typeof body.position === "string" ? body.position : undefined;
    const purpose = typeof body.purpose === "string" ? body.purpose : undefined;
    const yearsExp = typeof body.yearsExp === "string" ? body.yearsExp : undefined;
    const previousClub = typeof body.previousClub === "string" ? body.previousClub : undefined;
    const injuries = typeof body.injuries === "string" ? body.injuries : undefined;

    const occupation = typeof body.occupation === "string" ? body.occupation : undefined;

    const consentParticipate = !!body.consentParticipate;
    const consentLiability = !!body.consentLiability;
    const consentMedia = !!body.consentMedia;
    const consentAIFF = !!body.consentAIFF;

    const program = typeof body.program === "string" ? body.program : undefined;
    const paymentMethod = typeof body.paymentMethod === "string" ? body.paymentMethod : undefined;
    const upiId = typeof body.upiId === "string" ? body.upiId : undefined;

    // File refs (expected shape produced by the upload flow)
    const photo = body.photo && isFileRef(body.photo) ? body.photo : undefined;
    const idDoc = body.idDoc && isFileRef(body.idDoc) ? body.idDoc : undefined;
    const birthProof = body.birthProof && isFileRef(body.birthProof) ? body.birthProof : undefined;
    const paymentReceipt = body.paymentReceipt && isFileRef(body.paymentReceipt) ? body.paymentReceipt : undefined;

    // Connect DB
    await connectDB();

    // Build registration document
    const doc: Partial<IRegistration> = {
      email,
      playerName,
      phone,
      emergencyContact,
      dob: dob instanceof Date && !isNaN(dob.getTime()) ? dob : undefined,
      gender,
      parentName,
      parentContact,
      position,
      purpose,
      yearsExp,
      previousClub,
      injuries,
      occupation,
      consentParticipate,
      consentLiability,
      consentMedia,
      consentAIFF,
      program,
      paymentMethod,
      upiId,
      photo: photo ? {
        filename: photo.filename,
        contentType: photo.contentType,
        size: photo.size,
        key: photo.key,
        uploadedAt: new Date(),
      } : undefined,
      idDoc: idDoc ? {
        filename: idDoc.filename,
        contentType: idDoc.contentType,
        size: idDoc.size,
        key: idDoc.key,
        uploadedAt: new Date(),
      } : undefined,
      birthProof: birthProof ? {
        filename: birthProof.filename,
        contentType: birthProof.contentType,
        size: birthProof.size,
        key: birthProof.key,
        uploadedAt: new Date(),
      } : undefined,
      paymentReceipt: paymentReceipt ? {
        filename: paymentReceipt.filename,
        contentType: paymentReceipt.contentType,
        size: paymentReceipt.size,
        key: paymentReceipt.key,
        uploadedAt: new Date(),
      } : undefined,
      status: "pending",
      createdAt: new Date(),
    };

    const registration = new Registration(doc);
    await registration.save();

    return NextResponse.json({ ok: true, id: registration._id }, { status: 201 });
  } catch (err: unknown) {
    console.error("registrations POST error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message || "Server error" }, { status: 500 });
  }
}
