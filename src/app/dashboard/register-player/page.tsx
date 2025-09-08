// src/app/dashboard/register-player/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingButton from "@/components/LoadingButton";

export default function RegisterPlayerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [jersey, setJersey] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age: Number(age), jersey: Number(jersey) }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/dashboard?registered=1&name=${encodeURIComponent(name)}`);
      } else {
        setMessage(data.error || "Something went wrong");
        setLoading(false);
      }
    } catch {
      setMessage("Network error");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white shadow rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Register Player</h1>
          <Link href="/dashboard" className="text-sm text-blue-600 underline">
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              placeholder="Player Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Age"
              value={age === "" ? "" : age}
              onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Jersey Number"
              value={jersey === "" ? "" : jersey}
              onChange={(e) => setJersey(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          {message && <p className="text-center text-red-600">{message}</p>}

          <div className="flex flex-col sm:flex-row gap-3">
            <LoadingButton
              type="submit"
              loading={loading}
              className="w-full sm:w-auto px-4 py-3 bg-blue-600 text-white rounded disabled:opacity-60"
            >
              {loading ? "Register…" : "Register"}
            </LoadingButton>

            <Link href="/dashboard" className="w-full sm:w-auto text-center px-4 py-3 bg-gray-100 rounded">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
