// src/app/dashboard/registrations/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Registration } from "@/models/registration";
import RegistrationsList from "@/components/RegistrationsList";

export default async function RegistrationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard/registrations");
  }

  await connectDB();

  // fetch pending registrations (we'll only send minimal fields to the client)
  const raw = await Registration.find({ status: "pending" }).sort({ createdAt: -1 }).lean().exec();

  // serialize registrations to plain JS objects (no Buffers)
  const registrations = raw.map((r) => ({
    _id: String(r._id),
    playerName: r.playerName,
    email: r.email,
    phone: r.phone,
    createdAt: r.createdAt?.toISOString?.() ?? null,
    position: r.position ?? null,
    purpose: r.purpose ?? null,
    yearsExp: r.yearsExp ?? null,
    previousClub: r.previousClub ?? null,
    injuries: r.injuries ?? null,
    parentName: r.parentName ?? null,
    relationship: r.relationship ?? null,
    parentContact: r.parentContact ?? null,
    program: r.program ?? null,
    // do not expose file buffers here; show filenames only if present
    photoFilename: r.photo?.filename ?? null,
    idDocFilename: r.idDoc?.filename ?? null,
    birthProofFilename: r.birthProof?.filename ?? null,
  }));

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Registrations</h1>
          <a href="/dashboard" className="text-sm text-blue-600 underline">← Back</a>
        </div>

        <RegistrationsList initialRegistrations={registrations} />
      </div>
    </main>
  );
}
