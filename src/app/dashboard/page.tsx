import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // If for some reason middleware missed it, double-check here
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Coach Dashboard
        </h1>

        <p className="mb-4">
          Welcome, <span className="font-semibold">{session.user?.name}</span> 👋
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Attendance card */}
          <div className="p-6 bg-white shadow rounded-xl">
            <h2 className="text-xl font-semibold mb-2">📋 Attendance</h2>
            <p className="text-gray-600">Track player attendance for training sessions.</p>
          </div>

          {/* Payments card */}
          <div className="p-6 bg-white shadow rounded-xl">
            <h2 className="text-xl font-semibold mb-2">💳 Payments</h2>
            <p className="text-gray-600">Manage player fees and payment history.</p>
          </div>

          {/* Players card */}
          <div className="p-6 bg-white shadow rounded-xl">
            <h2 className="text-xl font-semibold mb-2">👥 Players</h2>
            <p className="text-gray-600">View and manage registered players.</p>
          </div>

          {/* Settings card */}
          <div className="p-6 bg-white shadow rounded-xl">
            <h2 className="text-xl font-semibold mb-2">⚙️ Settings</h2>
            <p className="text-gray-600">Update academy info and preferences.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
