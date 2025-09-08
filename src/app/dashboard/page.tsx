// app/dashboard/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisteredToast from "@/components/RegisteredToast"; // client component

type SearchParams = { registered?: string; name?: string };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  // --- CORRECT: await the searchParams object first ---
  const sp = await searchParams;
  const registered = sp?.registered;
  const rawName = sp?.name;
  const name = rawName ? decodeURIComponent(rawName) : undefined;
  // ----------------------------------------------------

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Render toast if registered */}
        {registered && <RegisteredToast name={name} />}

        <header className="mb-8">
          <h1 className="text-3xl font-bold">Coach Dashboard</h1>
          <p className="mt-1 text-gray-700">
            Welcome, <span className="font-semibold">{session.user?.name}</span> 👋
          </p>
        </header>

        {/* Single feature card: Register Player */}
        <section>
          <Link href="/dashboard/register-player" className="block">
            <div className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-1">👥 Register Player</h2>
              <p className="text-gray-600">Quickly add a new player to the academy.</p>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
