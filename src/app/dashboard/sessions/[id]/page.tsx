// src/app/dashboard/sessions/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Link from "next/link";
import EditSessionAttendees from "@/components/EditSessionAttendees";
import { Session } from "@/models/session";
import { Player, PlayerType } from "@/models/player";

type PlayerRow = { _id: string; name: string; jersey?: number };

export default async function SessionDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  // --- IMPORTANT: await params before accessing properties ---
  const { id } = await params;
  // --------------------------------------------------------

  const sessionAuth = await getServerSession(authOptions);
  if (!sessionAuth) redirect("/api/auth/signin?callbackUrl=/dashboard/sessions");

  await connectDB();

  // find the session
  const rawSession = await Session.findById(id).lean().exec();
  if (!rawSession) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-red-600">Session not found.</p>
          <Link href="/dashboard/sessions" className="text-sm text-blue-600 underline">
            ← Back to sessions
          </Link>
        </div>
      </main>
    );
  }

  // load players to allow adding/removing
  const rawPlayers = (await Player.find().sort({ name: 1 }).lean().exec()) as Array<
    PlayerType & { _id: unknown }
  >;
  const players: PlayerRow[] = rawPlayers.map((p) => ({
    _id: String(p._id),
    name: String(p.name),
    jersey: p.jersey ?? undefined,
  }));

  const sessionData = {
    _id: String((rawSession as { _id: unknown })._id),
    date: rawSession.date,
    name: rawSession.name,
    attendees: (rawSession.attendees ?? []).map((id: unknown) => String(id)),
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{sessionData.name}</h1>
            <p className="text-sm text-gray-600">{new Date(sessionData.date).toLocaleString()}</p>
          </div>
          <div>
            <Link href="/dashboard/sessions" className="text-sm text-blue-600 underline">
              ← Sessions
            </Link>
          </div>
        </header>

        <div className="bg-white shadow rounded p-4">
          <EditSessionAttendees
            sessionId={sessionData._id}
            players={players}
            initialAttendees={sessionData.attendees}
          />
        </div>
      </div>
    </main>
  );
}
