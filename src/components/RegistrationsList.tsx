// src/components/RegistrationsList.tsx
"use client";

import React, { useState } from "react";

type Reg = {
    _id: string;
    playerName?: string | null;
    email?: string | null;
    phone?: string | null;
    createdAt?: string | null;
    position?: string | null;
    purpose?: string | null;
    yearsExp?: string | null;
    previousClub?: string | null;
    injuries?: string | null;
    parentName?: string | null;
    relationship?: string | null;
    parentContact?: string | null;
    program?: string | null;
    photoFilename?: string | null;
    idDocFilename?: string | null;
    birthProofFilename?: string | null;
};

export default function RegistrationsList({ initialRegistrations }: { initialRegistrations: Reg[] }) {
    const [items, setItems] = useState<Reg[]>(initialRegistrations);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const removeItem = (id: string) => setItems((s) => s.filter((r) => r._id !== id));

    const approve = async (id: string) => {
        setError(null);
        setLoadingId(id);
        try {
            const res = await fetch(`/api/registrations/${id}/approve`, { method: "POST" });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Approve failed");
            // remove from list
            removeItem(id);
        } catch (err: any) {
            setError(err?.message || "Error approving");
        } finally {
            setLoadingId(null);
        }
    };

    const reject = async (id: string) => {
        if (!confirm("Reject and delete this registration? This action cannot be undone.")) return;
        setError(null);
        setLoadingId(id);
        try {
            const res = await fetch(`/api/registrations/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Delete failed");
            removeItem(id);
        } catch (err: any) {
            setError(err?.message || "Error deleting");
        } finally {
            setLoadingId(null);
        }
    };

    if (items.length === 0) {
        return <div className="p-6 bg-white rounded shadow text-center text-gray-600">No pending registrations.</div>;
    }

    return (
        <div className="space-y-4">
            {error && <div className="text-sm text-red-600">{error}</div>}

            {items.map((r) => (
                <div key={r._id} className="bg-white p-4 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                            <div className="min-w-0">
                                <div className="font-medium text-gray-900 truncate">
                                    <a href={`/dashboard/registrations/${r._id}`} className="hover:underline">{r.playerName}</a>
                                </div>
                                <div className="text-sm text-gray-600 truncate">{r.email} • {r.phone}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {r.position ? `${r.position} • ` : ""}{r.yearsExp ? `${r.yearsExp} yrs • ` : ""}{r.program ? r.program : ""}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">Submitted {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Files: {r.photoFilename ?? "—"} {r.idDocFilename ? ` • ${r.idDocFilename}` : ""} {r.birthProofFilename ? ` • ${r.birthProofFilename}` : ""}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 items-center">
                        <button
                            disabled={loadingId !== null}
                            onClick={() => approve(r._id)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded text-sm disabled:opacity-60"
                        >
                            {loadingId === r._id ? "Approving…" : "Approve"}
                        </button>

                        <button
                            disabled={loadingId !== null}
                            onClick={() => reject(r._id)}
                            className="px-3 py-1.5 bg-red-50 text-red-700 rounded border border-red-100 text-sm disabled:opacity-60"
                        >
                            {loadingId === r._id ? "Deleting…" : "Reject"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
