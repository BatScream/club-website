// src/app/dashboard/registrations/[id]/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Registration } from "@/models/registration";
import RegistrationDetailActions from "@/components/RegistrationDetailActions";
import FileDownloadButton from "@/components/FileDownloadButton";

type Props = { params: { id: string } };

export default async function RegistrationDetailPage({ params }: Props) {
  // require signed-in coach
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=/dashboard/registrations/${params.id}`);
  }

  await connectDB();

  const reg = await Registration.findById(params.id).lean().exec();
  if (!reg) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-gray-600">Registration not found.</p>
          <Link href="/dashboard/registrations" className="text-blue-600 underline">
            Back to registrations
          </Link>
        </div>
      </main>
    );
  }

  const createdAt = reg.createdAt ? new Date(reg.createdAt).toLocaleString() : null;
  const dob = reg.dob ? new Date(reg.dob).toLocaleDateString() : null;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Registration details</h1>
            <p className="text-sm text-gray-600">
              Review the submitted information before approving or rejecting.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/registrations" className="text-sm text-blue-600 underline">
              ← Back to list
            </Link>
          </div>
        </div>

        <div className="bg-white rounded shadow p-6 space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-2">Basic profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium">Full name:</span> {reg.playerName}
              </div>
              <div>
                <span className="font-medium">Email:</span> {reg.email}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {reg.phone}
              </div>
              <div>
                <span className="font-medium">Emergency contact:</span>{" "}
                {reg.emergencyContact}
              </div>
              <div>
                <span className="font-medium">DOB:</span> {dob ?? "—"}
              </div>
              <div>
                <span className="font-medium">Gender:</span> {reg.gender ?? "—"}
              </div>
              <div>
                <span className="font-medium">Parent/Guardian:</span>{" "}
                {reg.parentName ?? "—"}
              </div>
              <div>
                <span className="font-medium">Parent contact:</span>{" "}
                {reg.parentContact ?? "—"}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Football experience</h2>
            <div className="text-sm space-y-1">
              <div>
                <span className="font-medium">Position:</span>{" "}
                {reg.position ?? "—"}
              </div>
              <div>
                <span className="font-medium">Years:</span>{" "}
                {reg.yearsExp ?? "—"}
              </div>
              <div>
                <span className="font-medium">Previous club:</span>{" "}
                {reg.previousClub ?? "—"}
              </div>
              <div>
                <span className="font-medium">Purpose:</span>{" "}
                {reg.purpose ?? "—"}
              </div>
              <div>
                <span className="font-medium">Injuries:</span>{" "}
                {reg.injuries ?? "—"}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Uploaded documents</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FileCard label="Passport size photo" fileRef={(reg as any).photo} />
              <FileCard label="National ID" fileRef={(reg as any).idDoc} />
              <FileCard label="Birth proof" fileRef={(reg as any).birthProof} />
              <FileCard
                label="Payment receipt"
                fileRef={(reg as any).paymentReceipt}
              />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Meta</h2>
            <div className="text-sm text-gray-600">
              Submitted: {createdAt ?? "—"} <br />
              Status: <span className="font-medium">{reg.status ?? "pending"}</span>
            </div>
          </section>

          <div className="pt-2 border-t">
            <RegistrationDetailActions
              registrationId={params.id}
              playerName={reg.playerName}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

/** Helper to render a file card */
function FileCard({
  label,
  fileRef,
}: {
  label: string;
  fileRef?: {
    filename: string;
    fileId: string;
    uploadedAt?: string | Date;
  } | null;
}) {
  if (!fileRef) {
    return (
      <div className="p-3 bg-gray-50 rounded border text-sm text-gray-500">
        <div className="font-medium">{label}</div>
        <div className="text-xs mt-1">Not uploaded</div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-white rounded border text-sm flex items-start justify-between">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-xs text-gray-600 mt-1">{fileRef.filename}</div>
        <div className="text-xs text-gray-400 mt-1">
          Uploaded:{" "}
          {fileRef.uploadedAt
            ? new Date(fileRef.uploadedAt).toLocaleString()
            : "—"}
        </div>
      </div>

      <div className="ml-4">
        <FileDownloadButton
          fileId={fileRef.fileId}
          filename={fileRef.filename}
        />
      </div>
    </div>
  );
}
