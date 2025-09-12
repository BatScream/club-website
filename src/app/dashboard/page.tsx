// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisteredToast from "@/components/RegisteredToast";
import CardLink from "@/components/CardLink";

export default async function DashboardPage({ searchParams }: { searchParams: { registered: string; name: string } }) {
  const { registered, name } = await searchParams
  const decodedName = decodeURIComponent(name)

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {registered && <RegisteredToast name={decodedName} />}

        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Coach Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome, <span className="font-semibold">{session.user?.name}</span></p>
          </div>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          {/* Players column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Players</h2>
              <p className="text-sm text-gray-500">Manage registered players</p>
            </div>

            <div className="grid gap-4">
              {/* Registrations card */}
              <CardLink href="/dashboard/registrations" ariaLabel="View registrations">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">
                    📥
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Registrations</div>
                    <div className="text-sm text-gray-600">View pending registrations — approve or reject</div>
                  </div>
                </div>
              </CardLink>
              <CardLink href="/dashboard/players" ariaLabel="View Players">
                <h3 className="font-medium">📋 View Approved players</h3>
                <p className="text-sm text-gray-600 mt-1">See the full players list and stats.</p>
              </CardLink>
            </div>
          </div>

          {/* Training Sessions column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Training Sessions</h2>
              <p className="text-sm text-gray-500">Create sessions and mark attendance</p>
            </div>

            <div className="grid gap-4">
              <CardLink href="/dashboard/sessions/create" ariaLabel="Create Session">
                <h3 className="font-medium">➕ Create Session</h3>
                <p className="text-sm text-gray-600 mt-1">Create a new session (date + name).</p>
              </CardLink>
              <CardLink href="/dashboard/sessions" ariaLabel="View Sessions">
                <h3 className="font-medium">🗓️ View & Update Sessions</h3>
                <p className="text-sm text-gray-600 mt-1">Open a session to add/remove attendees and see attendance %.</p>
              </CardLink>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
