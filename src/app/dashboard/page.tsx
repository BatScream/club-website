// src/app/dashboard/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisteredToast from "@/components/RegisteredToast";

type SearchParams = { registered?: string; name?: string };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  // await searchParams first (App Router requirement)
  const sp = await searchParams;
  const registered = sp?.registered;
  const rawName = sp?.name;
  const name = rawName ? decodeURIComponent(rawName) : undefined;

  // auth guard
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* toast */}
        {registered && <RegisteredToast name={name} />}

        {/* header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Coach Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome, <span className="font-semibold">{session.user?.name}</span> — manage players and sessions.
            </p>
          </div>
        </header>

        {/* bifurcation grid */}
        <section className="grid gap-8 md:grid-cols-2">
          {/* Players column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Players</h2>
              <p className="text-sm text-gray-500">Manage registered players</p>
            </div>

            <div className="grid gap-4">
              <Link href="/dashboard/register-player" className="block">
                <div className="p-5 bg-white shadow rounded-lg hover:shadow-lg transition">
                  <h3 className="font-medium">➕ Create Player</h3>
                  <p className="text-sm text-gray-600 mt-1">Add a new player to the academy.</p>
                </div>
              </Link>

              <Link href="/dashboard/players" className="block">
                <div className="p-5 bg-white shadow rounded-lg hover:shadow-lg transition">
                  <h3 className="font-medium">📋 View Players</h3>
                  <p className="text-sm text-gray-600 mt-1">See the full players list and stats.</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Training sessions column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Training Sessions</h2>
              <p className="text-sm text-gray-500">Create sessions and mark who attended</p>
            </div>

            <div className="grid gap-4">
              <Link href="/dashboard/sessions/create" className="block">
                <div className="p-5 bg-white shadow rounded-lg hover:shadow-lg transition">
                  <h3 className="font-medium">➕ Create Session</h3>
                  <p className="text-sm text-gray-600 mt-1">Create a new session (date + name).</p>
                </div>
              </Link>

              <Link href="/dashboard/sessions" className="block">
                <div className="p-5 bg-white shadow rounded-lg hover:shadow-lg transition">
                  <h3 className="font-medium">🗓️ View & Update Sessions</h3>
                  <p className="text-sm text-gray-600 mt-1">Open a session to add/remove attendees and see attendance %.</p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
