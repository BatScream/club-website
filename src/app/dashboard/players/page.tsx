// src/app/dashboard/players/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Player, PlayerType } from "@/models/player";
import { Types } from "mongoose";

type PlayerRow = {
  _id: string;
  name: string;
  age: number;
  jersey: number;
  createdAt?: string | Date;
};

export default async function PlayersPage() {
  // auth guard
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard/players");
  }

  try {
    await connectDB();

    // Type the raw results as PlayerType with ObjectId _id (no `any`)
    const rawPlayers = (await Player.find()
      .sort({ createdAt: -1 })
      .limit(500)
      .lean()
      .exec()) as Array<PlayerType & { _id: Types.ObjectId }>;

    // Map/normalize into the tidy PlayerRow[] shape (convert ObjectId -> string)
    const players: PlayerRow[] = rawPlayers.map((r) => ({
      _id: r._id.toString(),
      name: String(r.name),
      age: Number(r.age ?? 0),
      jersey: Number(r.jersey ?? 0),
      createdAt: r.createdAt ?? undefined,
    }));

    return (
      <main className="min-h-screen bg-gray-100 p-8">
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

              <Link
                href="/dashboard/register-player"
                className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                + Register Player
              </Link>
            </div>
          </header>

          <div className="bg-white shadow rounded-lg overflow-x-auto">
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
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No players registered yet.
                    </td>
                  </tr>
                ) : (
                  players.map((p) => {
                    const created = p.createdAt ? new Date(p.createdAt).toLocaleString() : "-";
                    return (
                      <tr key={p._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.age}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.jersey}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{created}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("PlayersPage error:", err.message);
    } else {
      console.error("PlayersPage unknown error:", err);
    }

    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Players</h1>
          <div className="p-6 bg-white shadow rounded">
            <p className="text-red-600">Unable to load players. Check server logs for details.</p>
            <div className="mt-4">
              <Link href="/dashboard" className="text-sm text-blue-600 underline">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
