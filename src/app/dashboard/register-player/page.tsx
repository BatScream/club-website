// src/app/dashboard/register-player/page.tsx
import RegisterPlayerForm from "@/components/RegisterPlayerForm";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRegisterPlayerPage({  }: { searchParams?: { registered?: string; name?: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard/register-player");
  }

  // Render the server page: the form inside is a client component and will redirect back to /dashboard after success
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Register Player</h1>
          <Link href="/dashboard" className="text-sm text-blue-600 underline">← Back</Link>
        </div>

        <RegisterPlayerForm redirectPath="/dashboard" />
      </div>
    </main>
  );
}
