// src/app/dashboard/players/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Player, PlayerType } from "@/models/player";

type PlayerRow = {
  _id: string;
  name: string;
  age: number;
  jersey: number;
  createdAt?: string | Date;
};

export default async function PlayersPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard/players");
  }

  await connectDB();

  const rawPlayers = (await Player.find().sort({ name: 1 }).lean().exec()) as Array<
    PlayerType & { _id: unknown }
  >;

  const players: PlayerRow[] = rawPlayers.map((p) => ({
    _id: String(p._id),
    name: String(p.name),
    age: Number(p.age ?? 0),
    jersey: Number(p.jersey ?? 0),
    createdAt: p.createdAt ?? undefined,
  }));

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Players</h1>
            <p className="text-sm text-gray-600">List of registered players in your academy.</p>
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard" className="inline-block px-3 py-2 rounded bg-white shadow hover:shadow-md">
              ← Back to Dashboard
            </Link>
            <Link href="/dashboard/register-player" className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              + Register Player
            </Link>
          </div>
        </header>

        {/* Desktop/table view */}
        <div className="hidden md:block bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full text-left divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Jersey</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Registered At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {players.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No players registered yet.</td>
                </tr>
              ) : (
                players.map((p) => (
                  <tr key={p._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.jersey}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/cards view */}
        <div className="md:hidden space-y-3">
          {players.map((p) => (
            <div key={p._id} className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-sm text-gray-500 truncate">Jersey: #{p.jersey} • Age: {p.age}</div>
                </div>
                <div className="text-sm text-gray-500">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
