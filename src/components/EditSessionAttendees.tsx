// src/components/EditSessionAttendees.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingButton from "./LoadingButton";

type PlayerRow = { _id: string; name: string; jersey?: number };

export default function EditSessionAttendees({
  sessionId,
  players,
  initialAttendees,
}: {
  sessionId: string;
  players: PlayerRow[];
  initialAttendees: string[];
}) {
  const [selected, setSelected] = useState<Record<string, boolean>>(
    () => Object.fromEntries(initialAttendees.map((id) => [id, true]))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const toggle = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const attendees = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);

    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendees }),
      });
      const j = await res.json();
      if (res.ok) {
        router.refresh(); // re-fetch server-rendered data
      } else {
        setError(j.error || "Failed to save");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="max-h-72 overflow-auto border rounded p-2">
        {players.length === 0 ? (
          <p className="text-sm text-gray-500">No players available.</p>
        ) : (
          <ul className="space-y-3">
            {players.map((p) => (
              <li key={p._id} className="flex items-center justify-between">
                <label className="flex items-center gap-3 w-full">
                  <input
                    type="checkbox"
                    checked={!!selected[p._id]}
                    onChange={() => toggle(p._id)}
                    className="h-5 w-5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{p.name}</div>
                    <div className="text-sm text-gray-500 truncate">#{p.jersey ?? "-"}</div>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex flex-col sm:flex-row gap-3">
        <LoadingButton
          onClick={handleSave}
          loading={loading}
          className="w-full sm:w-auto px-4 py-3 bg-blue-600 text-white rounded disabled:opacity-60"
        >
          {loading ? "Saving…" : "Save Attendees"}
        </LoadingButton>

        <button onClick={() => router.back()} className="w-full sm:w-auto px-4 py-3 bg-gray-100 rounded">
          Close
        </button>
      </div>
    </div>
  );
}
