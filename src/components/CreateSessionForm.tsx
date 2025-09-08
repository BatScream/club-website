// src/components/CreateSessionForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingButton from "./LoadingButton";

export default function CreateSessionForm() {
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [name, setName] = useState<string>("");
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
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Session name"
          className="w-full p-3 border rounded"
          required
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex flex-col sm:flex-row gap-3">
        <LoadingButton
          type="submit"
          loading={loading}
          className="w-full sm:w-auto px-4 py-3 bg-blue-600 text-white rounded disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create"}
        </LoadingButton>

        <button
          type="button"
          onClick={() => history.back()}
          className="w-full sm:w-auto px-4 py-3 bg-gray-100 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
