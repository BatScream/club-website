// src/app/register/page.tsx
import RegisterPlayerForm from "@/components/RegisterPlayerForm";

export const metadata = {
  title: "Register Player",
};

export default function PublicRegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Register Player</h1>
          <p className="text-sm text-gray-600 mt-1">Fill the form to register a player.</p>
        </header>

        <RegisterPlayerForm redirectPath="/" />
      </div>
    </main>
  );
}
