// src/components/RegistrationDetailActions.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * RegistrationDetailActions
 * - Approve: POST /api/registrations/:id/approve
 * - Reject: DELETE /api/registrations/:id
 *
 * On success the component navigates back to the registrations list and sets query params for toast.
 */

export default function RegistrationDetailActions({ registrationId, playerName }: { registrationId: string; playerName?: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState<null | "approve" | "reject">(null);
  const [error, setError] = useState<string | null>(null);

  const approve = async () => {
    if (!confirm("Approve this registration and create a Player?")) return;
    setError(null);
    setLoading("approve");
    try {
      const res = await fetch(`/api/registrations/${registrationId}/approve`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Approve failed");
      const params = new URLSearchParams();
      params.set("registered", "1");
      if (playerName) params.set("name", playerName);
      router.push(`/dashboard/registrations?${params.toString()}`);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Error approving");
      setLoading(null);
    }
  };

  const reject = async () => {
    if (!confirm("Reject and delete this registration? This action cannot be undone.")) return;
    setError(null);
    setLoading("reject");
    try {
      const res = await fetch(`/api/registrations/${registrationId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed");
      router.push(`/dashboard/registrations?rejected=1`);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Error deleting");
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex gap-2">
        <button onClick={approve} disabled={loading !== null} className="px-4 py-2 bg-green-600 text-white rounded">
          {loading === "approve" ? "Approving…" : "Approve"}
        </button>

        <button onClick={reject} disabled={loading !== null} className="px-4 py-2 bg-red-50 text-red-700 rounded border">
          {loading === "reject" ? "Deleting…" : "Reject"}
        </button>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
