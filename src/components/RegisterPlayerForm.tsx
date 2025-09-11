// src/components/RegisterPlayerForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * RegisterPlayerForm
 *
 * - Uploads files directly to S3 using presigned PUT URLs obtained from /api/uploads/presigned
 * - Sends registration data (JSON) to /api/registrations (server should expect file refs with 'key', 'filename', 'contentType', 'size')
 *
 * Props:
 *  - redirectPath?: string - where to redirect after success (defaults to "/")
 *  - showThankYou?: boolean
 */

type FileField = "photo" | "idDoc" | "birthProof" | "paymentReceipt";

export default function RegisterPlayerForm({ redirectPath = "/" }: { redirectPath?: string; }) {
  const router = useRouter();

  // Steps simple multi-step (you can expand)
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Basic profile
  const [email, setEmail] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Prefer not to say");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  // Experience
  const [position, setPosition] = useState("Central Midfield");
  const [purpose, setPurpose] = useState("");
  const [yearsExp, setYearsExp] = useState("1");
  const [previousClub, setPreviousClub] = useState("");
  const [injuries, setInjuries] = useState("");

  // Parent
  const [parentName, setParentName] = useState("");
  const [relationship, setRelationship] = useState("Father");
  const [parentContact, setParentContact] = useState("");
  const [occupation, setOccupation] = useState("");

  // Consents
  const [consentParticipate, setConsentParticipate] = useState(false);
  const [consentLiability, setConsentLiability] = useState(false);
  const [consentMedia, setConsentMedia] = useState(false);
  const [consentAIFF, setConsentAIFF] = useState(false);

  // Payment
  const [program, setProgram] = useState("3-days-weekly");
  const [paymentMethod, setPaymentMethod] = useState<"phone" | "upi">("phone");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [upiId, _setUpiId] = useState("8056318891@ptsbi");

  // Files
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [idDocFile, setIdDocFile] = useState<File | null>(null);
  const [birthProofFile, setBirthProofFile] = useState<File | null>(null);
  const [paymentReceiptFile, setPaymentReceiptFile] = useState<File | null>(null);

  const steps = ["Profile", "Experience", "Documents", "Parent", "Consent", "Payment", "Review"];

  // Validation minimal per-step
  const validateStep = (): string | null => {
    if (step === 0) {
      if (!email.trim()) return "Email required";
      if (!playerName.trim()) return "Player name required";
      if (!phone.trim()) return "Phone required";
      if (!emergencyContact.trim()) return "Emergency contact required";
    }
    if (step === 2) {
      if (!photoFile) return "Photo required";
      if (!idDocFile) return "ID required";
      if (!birthProofFile) return "Birth proof required";
    }
    if (step === 4) {
      if (!consentParticipate) return "Consent to participate required";
      if (!consentLiability) return "Release of liability required";
      if (!consentAIFF) return "AIFF regulations agreement required";
    }
    if (step === 5) {
      if (!paymentReceiptFile) return "Payment receipt required";
    }
    return null;
  };

  // Upload files to S3 via presigned URLs
  async function uploadFilesToS3(files: { field: FileField; file: File }[]) {
    if (files.length === 0) return {};
    // request presigned URLs
    const reqBody = {
      files: files.map((f) => ({ field: f.field, filename: f.file.name, contentType: f.file.type })),
    };
    const presignRes = await fetch("/api/uploads/presigned", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    });
    if (!presignRes.ok) {
      const txt = await presignRes.text().catch(() => "");
      throw new Error(`Failed to get upload URLs: ${txt || presignRes.status}`);
    }
    const presignJson = await presignRes.json();
    const uploads: { field: string; key: string; filename: string; uploadUrl: string, registrationId: unknown }[] = presignJson.uploads;

    // perform PUT uploads in parallel
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fileRefs: Record<string, any> = {};
    await Promise.all(
      uploads.map(async (u) => {
        const pair = files.find((f) => f.field === u.field);
        if (!pair) return;
        const putResp = await fetch(u.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": pair.file.type },
          body: pair.file,
        });
        if (!putResp.ok) {
          throw new Error(`Upload failed for ${pair.file.name}`);
        }
        fileRefs[u.field] = {
          filename: u.filename,
          contentType: pair.file.type,
          size: pair.file.size,
          key: u.key,
          registrationId: u.registrationId
        };
      })
    );

    return fileRefs;
  }

  const handleSubmit = async () => {
    setError(null);
    const v = validateStep();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);

    try {
      // files to upload
      const filesToUpload: { field: FileField; file: File }[] = [];
      if (photoFile) filesToUpload.push({ field: "photo", file: photoFile });
      if (idDocFile) filesToUpload.push({ field: "idDoc", file: idDocFile });
      if (birthProofFile) filesToUpload.push({ field: "birthProof", file: birthProofFile });
      if (paymentReceiptFile) filesToUpload.push({ field: "paymentReceipt", file: paymentReceiptFile });

      // upload and get keys
      const fileRefs = await uploadFilesToS3(filesToUpload);

      // build registration payload
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        email,
        playerName,
        dob: dob || null,
        gender,
        phone,
        emergencyContact,
        position,
        purpose,
        yearsExp,
        previousClub,
        injuries,
        parentName,
        relationship,
        parentContact,
        occupation,
        consentParticipate,
        consentLiability,
        consentMedia,
        consentAIFF,
        program,
        paymentMethod,
        upiId,
        // file refs (may be empty)
        photo: fileRefs.photo,
        idDoc: fileRefs.idDoc,
        birthProof: fileRefs.birthProof,
        paymentReceipt: fileRefs.paymentReceipt,
        _id: fileRefs.registrationId
      };

      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Registration failed");
      }

      // Success: redirect with toast params
      const params = new URLSearchParams();
      params.set("registered", "1");
      if (playerName) params.set("name", playerName);
      router.push(`${redirectPath}?${params.toString()}`);
    } catch (err: unknown) {
      console.error("submit error", err);
      const message = err instanceof Error ? err.message : "Submission failed";
      setError(message || "Submission failed");
      setLoading(false);
    }
  };

  // simple buttons and small UI (you can expand to full multi-step)
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Player Registration</h2>
        <div className="text-sm text-gray-600">{steps[step]}</div>
      </div>

      {/* Step content (condensed) */}
      {step === 0 && (
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm">Email *</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </label>

          <label className="block">
            <span className="text-sm">Player full name *</span>
            <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm">Phone *</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full border rounded p-2" />
            </label>

            <label className="block">
              <span className="text-sm">Emergency contact *</span>
              <input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} className="mt-1 block w-full border rounded p-2" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm">Date of birth</span>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1 block w-full border rounded p-2" />
            </label>

            <label className="block">
              <span className="text-sm">Gender</span>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="mt-1 block w-full border rounded p-2">
                <option>Male</option>
                <option>Female</option>
                <option>Prefer not to say</option>
              </select>
            </label>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <label>
            <span className="text-sm">Playing Position</span>
            <select value={position} onChange={(e) => setPosition(e.target.value)} className="mt-1 block w-full border rounded p-2">
              <option>Goalkeeper</option>
              <option>Defender</option>
              <option>Fullback</option>
              <option>Center Back</option>
              <option>Defensive Midfield</option>
              <option>Central Midfield</option>
              <option>Attacking Midfield</option>
              <option>Winger</option>
              <option>Forward / Striker</option>
            </select>
          </label>

          <label>
            <span className="text-sm">Purpose of joining *</span>
            <textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label>
              <span className="text-sm">Years of experience</span>
              <select value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} className="mt-1 block w-full border rounded p-2">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>5+</option>
              </select>
            </label>

            <label>
              <span className="text-sm">Previous club</span>
              <input value={previousClub} onChange={(e) => setPreviousClub(e.target.value)} className="mt-1 block w-full border rounded p-2" />
            </label>
          </div>

          <label>
            <span className="text-sm">Any football related injuries or medical conditions *</span>
            <textarea value={injuries} onChange={(e) => setInjuries(e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Upload required documents (JPEG/PNG/PDF). Files kept private.</p>

          <label className="block">
            <span className="text-sm">Passport size photo *</span>
            <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} className="mt-1" />
          </label>

          <label className="block">
            <span className="text-sm">National ID *</span>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setIdDocFile(e.target.files?.[0] ?? null)} className="mt-1" />
          </label>

          <label className="block">
            <span className="text-sm">Birth proof *</span>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setBirthProofFile(e.target.files?.[0] ?? null)} className="mt-1" />
          </label>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <label>
            <span className="text-sm">Parent / Guardian name *</span>
            <input value={parentName} onChange={(e) => setParentName(e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label>
              <span className="text-sm">Relationship</span>
              <select value={relationship} onChange={(e) => setRelationship(e.target.value)} className="mt-1 block w-full border rounded p-2">
                <option>Father</option>
                <option>Mother</option>
                <option>Guardian</option>
              </select>
            </label>

            <label>
              <span className="text-sm">Parent / Guardian contact *</span>
              <input value={parentContact} onChange={(e) => setParentContact(e.target.value)} className="mt-1 block w-full border rounded p-2" />
            </label>
          </div>

          <label>
            <span className="text-sm">Occupation</span>
            <input value={occupation} onChange={(e) => setOccupation(e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </label>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-3">
          <div>
            <label className="flex items-start gap-2">
              <input type="checkbox" checked={consentParticipate} onChange={(e) => setConsentParticipate(e.target.checked)} />
              <span className="text-sm">I consent for my child to participate. (Required)</span>
            </label>
          </div>

          <div>
            <label className="flex items-start gap-2">
              <input type="checkbox" checked={consentLiability} onChange={(e) => setConsentLiability(e.target.checked)} />
              <span className="text-sm">Release of liability waiver (Required)</span>
            </label>
          </div>

          <div>
            <label className="flex items-start gap-2">
              <input type="checkbox" checked={consentMedia} onChange={(e) => setConsentMedia(e.target.checked)} />
              <span className="text-sm">Media release (Agree)</span>
            </label>
          </div>

          <div>
            <label className="flex items-start gap-2">
              <input type="checkbox" checked={consentAIFF} onChange={(e) => setConsentAIFF(e.target.checked)} />
              <span className="text-sm">I agree with AIFF regulations. (Required)</span>
            </label>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-3">
          <div className="text-sm">Program options</div>
          <label className="flex items-center gap-3">
            <input type="radio" name="program" value="3-days-weekly" checked={program === "3-days-weekly"} onChange={() => setProgram("3-days-weekly")} />
            <span className="text-sm">Weekly three days - Rs.1540</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="radio" name="program" value="4-days-weekly" checked={program === "4-days-weekly"} onChange={() => setProgram("4-days-weekly")} />
            <span className="text-sm">Weekly four days - Rs.2020</span>
          </label>

          <div className="mt-2">
            <div className="text-sm">Payment method</div>
            <label className="flex items-center gap-2">
              <input type="radio" name="pay" checked={paymentMethod === "phone"} onChange={() => setPaymentMethod("phone")} />
              <span>8056318891 (GPay / PhonePe / Paytm)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="pay" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} />
              <span>8056318891@ptsbi (UPI ID)</span>
            </label>
          </div>

          <label>
            <span className="text-sm">Upload payment receipt *</span>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setPaymentReceiptFile(e.target.files?.[0] ?? null)} className="mt-1" />
          </label>
        </div>
      )}

      {step === 6 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Review</h3>
          <div className="text-sm text-gray-700">
            <div><strong>Name:</strong> {playerName}</div>
            <div><strong>Email:</strong> {email}</div>
            <div><strong>Phone:</strong> {phone}</div>
            <div className="mt-2 text-xs text-gray-500">Confirm details and submit.</div>
          </div>
        </div>
      )}

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {
          step != 0 && (<button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || loading}
            className="px-3 py-2 border rounded bg-gray-50"
          >
            Back
          </button>)
        }

        {step < steps.length - 1 && (
          <button
            type="button"
            onClick={() => {
              const v = validateStep();
              if (v) {
                setError(v);
                return;
              }
              setError(null);
              setStep((s) => Math.min(steps.length - 1, s + 1));
            }}
            disabled={loading}
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded"
          >
            Next
          </button>
        )}

        {step === steps.length - 1 && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="ml-auto px-4 py-2 bg-green-600 text-white rounded"
          >
            {loading ? "Submitting…" : "Submit Registration"}
          </button>
        )}
      </div>
    </div>
  );
}
