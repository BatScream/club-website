// src/components/RegisterPlayerForm.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
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
  
  function FileUpload({ label, accept, file, onChange, required = false }: { label: string; accept: string; file: File | null; onChange: (f: File | null) => void; required?: boolean }) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
      if (file && file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
      }
      setPreview(null);
      return undefined;
    }, [file]);

    const formatSize = (bytes: number) => {
      if (!bytes && bytes !== 0) return "";
      const units = ["B", "KB", "MB", "GB"]; let i = 0; let s = bytes;
      while (s >= 1024 && i < units.length - 1) { s /= 1024; i++; }
      return `${s.toFixed(s < 10 ? 1 : 0)} ${units[i]}`;
    };

    return (
      <div className="block">
        <span className="text-sm">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-500 active:scale-[0.98] transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload
          </button>

          {file ? (
            <div className="flex items-center gap-3 rounded-md border bg-gray-50 px-2 py-1.5">
              {preview && <img src={preview} alt="preview" className="w-8 h-8 rounded object-cover" />}
              <div className="min-w-0">
                <div className="max-w-[220px] truncate text-sm font-medium">{file.name}</div>
                <div className="text-xs text-gray-500">{formatSize(file.size)}</div>
              </div>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Remove file"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ) : (
            <span className="text-xs text-gray-500">No file selected</span>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>
    );
  }

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

  // Clear any validation message when navigating between steps
  useEffect(() => {
    setError(null);
  }, [step]);

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
    const uploads: { field: string; key: string; filename: string; uploadUrl: string }[] = presignJson.uploads;

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
        photo: fileRefs.photo.key ?? undefined,
        idDoc: fileRefs.idDoc.key ?? undefined,
        birthProof: fileRefs.birthProof.key ?? undefined,
        paymentReceipt: fileRefs.paymentReceipt.key ?? undefined,
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
    <div className="w-full max-w-3xl mx-auto">
      {/* Stepper ABOVE the white form card */}
      {/* Mobile: compact progress dots (non-interactive) */}
      <div className="mb-3 flex items-center justify-center gap-2 md:hidden">
        {steps.map((_, index) => (
          <div
            key={index}
            aria-hidden
            className={
              "h-2.5 w-2.5 rounded-full " +
              (index <= step ? "bg-blue-600" : "bg-gray-300")
            }
          />
        ))}
      </div>
      {/* Desktop chevrons: right-pointing arrows, non-interactive */}
      <div className="hidden md:flex mb-4 justify-center" aria-label="Registration steps">
        {steps.map((title, index) => (
          <div
            key={title}
            className={
              "relative flex items-center px-3 py-2 text-sm font-medium mr-2 cursor-default select-none " +
              (index === step
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800")
            }
            style={{
              clipPath:
                index === 0
                  ? "polygon(0% 0%, 96% 0%, 100% 50%, 96% 100%, 0% 100%)"
                  : "polygon(0% 0%, 96% 0%, 100% 50%, 96% 100%, 0% 100%, 4% 50%)",
            }}
          >
            <span className="whitespace-nowrap">{index + 1}. {title}</span>
          </div>
        ))}
      </div>

      {/* White form card */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">

      {/* Step content (condensed) */}
      {step === 0 && (
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm">Email <span className="text-red-500">*</span></span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </label>

          <label className="block">
            <span className="text-sm">Player full name <span className="text-red-500">*</span></span>
            <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm">Phone <span className="text-red-500">*</span></span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full border rounded p-2" />
            </label>

            <label className="block">
              <span className="text-sm">Emergency contact <span className="text-red-500">*</span></span>
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
            <span className="text-sm">Purpose of joining <span className="text-red-500">*</span></span>
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
            <span className="text-sm">Any football related injuries or medical conditions <span className="text-red-500">*</span></span>
            <textarea value={injuries} onChange={(e) => setInjuries(e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Upload required documents (JPEG/PNG/PDF). Files kept private.</p>
          <FileUpload label="Passport size photo" accept="image/*" required file={photoFile} onChange={setPhotoFile} />
          <FileUpload label="National ID" accept="image/*,application/pdf" required file={idDocFile} onChange={setIdDocFile} />
          <FileUpload label="Birth proof" accept="image/*,application/pdf" required file={birthProofFile} onChange={setBirthProofFile} />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <label>
            <span className="text-sm">Parent / Guardian name <span className="text-red-500">*</span></span>
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
              <span className="text-sm">Parent / Guardian contact <span className="text-red-500">*</span></span>
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
        <div className="space-y-4">
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={consentParticipate} 
                onChange={(e) => setConsentParticipate(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm">
                I consent for my child to participate. <span className="text-red-500">*</span>
              </span>
            </label>
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={consentLiability} 
                onChange={(e) => setConsentLiability(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm">
                Release of liability waiver <span className="text-red-500">*</span>
              </span>
            </label>
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={consentMedia} 
                onChange={(e) => setConsentMedia(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm">Media release (Agree)</span>
            </label>
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={consentAIFF} 
                onChange={(e) => setConsentAIFF(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm">
                I agree with AIFF regulations. <span className="text-red-500">*</span>
              </span>
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

          <FileUpload label="Upload payment receipt" accept="image/*,application/pdf" required file={paymentReceiptFile} onChange={setPaymentReceiptFile} />
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
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || loading}
          className="px-3 py-2 border rounded bg-gray-50"
        >
          Back
        </button>

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
      {/* End white form card */}
      </div>
    </div>
  );
}
