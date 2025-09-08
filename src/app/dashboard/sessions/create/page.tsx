// src/app/dashboard/sessions/create/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import CreateSessionForm from "@/components/CreateSessionForm";

export default async function CreateSessionPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin?callbackUrl=/dashboard/sessions/create");
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Create Training Session</h1>
            <p className="text-sm text-gray-600">Provide name and date. You can add players later.</p>
          </div>
          <Link href="/dashboard/sessions" className="text-sm text-blue-600 underline">← Sessions</Link>
        </header>

        <div className="bg-white shadow rounded p-4">
          <CreateSessionForm />
        </div>
      </div>
    </main>
  );
}
