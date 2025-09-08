// components/CreateSessionForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PlayerRow = { _id: string; name: string; jersey?: number };

export default function CreateSessionForm({  }: { players: PlayerRow[] }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: new Date(date).toISOString(), name }),
      });
      const j = await res.json();
      if (res.ok) {
        router.push("/dashboard/sessions");
      } else {
        setError(j.error || "Failed to create session");
      }
    } catch (err) {
      setError("Network error" + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 border rounded" required />
        <input type="text" placeholder="Session name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 p-2 border rounded" required />
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? "Creating…" : "Create"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
      </div>
    </form>
  );
}
