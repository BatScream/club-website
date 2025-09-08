// src/app/dashboard/sessions/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Session } from "@/models/session";
import { Player } from "@/models/player";

type SessionCard = {
  _id: string;
  date: string;
  name: string;
  attendeesCount: number;
  createdAt?: string | Date;
  attendees: string[]; // player ids
};

export default async function SessionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard/sessions");
  }

  await connectDB();

  // fetch total players to compute percentage
  const totalPlayers = await Player.countDocuments();

  const raw = await Session.find().sort({ date: -1 }).limit(200).lean().exec();
  const sessions: SessionCard[] = raw.map((r) => ({
    _id: String((r as { _id: unknown })._id),
    date: r.date ? new Date(r.date).toISOString() : new Date().toISOString(),
    name: r.name,
    attendees: (r.attendees ?? []).map((id: unknown) => String(id)),
    attendeesCount: (r.attendees ?? []).length,
    createdAt: r.createdAt,
  }));

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Training Sessions</h1>
            <p className="text-sm text-gray-600">Create sessions and add players who attended.</p>
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard" className="inline-block px-3 py-2 rounded bg-white shadow hover:shadow-md">
              ← Dashboard
            </Link>
            <Link href="/dashboard/sessions/create" className="inline-block px-4 py-2 rounded bg-blue-600 text-white">
              + Create Session
            </Link>
          </div>
        </header>

        <div className="grid gap-4">
          {sessions.length === 0 ? (
            <div className="p-6 bg-white shadow rounded text-gray-600">No sessions yet. Create one.</div>
          ) : (
            sessions.map((s) => {
              const pct = totalPlayers === 0 ? 0 : Math.round((s.attendeesCount / totalPlayers) * 100);
              return (
                <div key={s._id} className="p-4 bg-white shadow rounded flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-sm text-gray-500">{new Date(s.date).toLocaleString()}</div>
                    <div className="text-sm text-gray-600 mt-2">{s.attendeesCount} present</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Attendance</div>
                      <div className="font-bold text-lg">{pct}%</div>
                    </div>

                    <Link href={`/dashboard/sessions/${s._id}`} className="px-3 py-1 bg-white border rounded shadow-sm text-sm">
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
