// src/app/page.tsx
import CardLink from "@/components/CardLink";
import RegisteredToast from "@/components/RegisteredToast";

type SearchParams = { registered?: string; name?: string };

export default async function Home({ searchParams }: { searchParams?: SearchParams }) {
  const sp = await searchParams;
  const registered = sp?.registered;
  const rawName = sp?.name;
  const name = rawName ? decodeURIComponent(rawName) : undefined;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">

      <main className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          {registered && <RegisteredToast name={name} />}

          <section className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-yellow-600">Revelation Football Academy</h1>
            <p className="text-sm text-gray-600 mt-1 max-w-xl mx-auto">
              Urappakkam — nurturing young football talent with safe, structured coaching.
            </p>
          </section>

          {/* three columns: mobile-first stacks into 1 column */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Parents column */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Parents</h3>
              <CardLink
                href="/register"
                ariaLabel="Register a player (public)"
                className="bg-white p-4"
              >
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded flex items-center justify-center text-white font-bold">
                      ➕
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Register your child</div>
                      <div className="text-xs text-gray-500">Shareable public form for parents</div>
                    </div>
                  </div>
                </div>
              </CardLink>
            </div>

            {/* Players column - non-clickable card */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Players</h3>

              {/* static card (not clickable) */}
              <div
                className="relative block w-full p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                aria-hidden
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-600 font-semibold">
                    👥
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Player portal</div>
                    <div className="text-xs text-gray-500">(coming soon)</div>
                  </div>
                </div>

                {/* subtle "disabled" hint */}
                <div className="mt-3 text-xs text-gray-400">This area is informational</div>
              </div>
            </div>

            {/* Coaches column */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Coaches</h3>
              <CardLink
                href="/dashboard"
                ariaLabel="Coach dashboard"
                className="bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-yellow-400 font-bold">
                    ⚙️
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Coach dashboard</div>
                    <div className="text-xs text-gray-500">Manage players, sessions & attendance</div>
                  </div>
                </div>
              </CardLink>
            </div>
          </div>

          {/* small footer area inside main to avoid page scroll */}
          <div className="mt-6 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Revelation Football Academy
          </div>
        </div>
      </main>
    </div>
  );
}
