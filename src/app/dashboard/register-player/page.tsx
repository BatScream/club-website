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
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/players", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, age, jersey }),
        });

        const data = await res.json();
        if (res.ok) {
            router.push(`/dashboard?registered=1&name=${encodeURIComponent(name)}`);
        } else {
            setMessage("❌ " + (data.error || "Something went wrong"));
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-md mx-auto bg-white shadow rounded-xl p-6">
                {/* Header with Back link */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Register Player</h1>
                    <Link
                        href="/dashboard"
                        className="text-sm text-blue-600 underline hover:text-blue-800"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Player Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Age"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Jersey Number"
                        value={jersey}
                        onChange={(e) => setJersey(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                    />

                    <LoadingButton
                        type="submit"
                        loading={loading}
                        className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        Register
                    </LoadingButton>
                </form>

                {message && <p className="mt-4 text-center">{message}</p>}
            </div>
        </main>
    );
}
