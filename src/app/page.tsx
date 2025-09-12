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
    <div className="min-h-screen bg-[linear-gradient(180deg,#0f172a_0%,#0f172a_55%,#0b1223_100%)] text-gray-50 flex flex-col">
      <header className="px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="text-white">Revelation </span>
            <span className="text-amber-400">Football Academy</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Urappakkam — nurturing young football talent with safe, structured coaching.
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-14">
        <div className="w-full max-w-6xl mx-auto">
          {registered && <RegisteredToast name={name} />}

          {/* Feature grid with equal-height cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Parents */}
            <section className="flex flex-col">
              <h2 className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase mb-3">Parents</h2>
              <CardLink href="/register" ariaLabel="Register a player (public)" className="h-full p-6 bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-400 text-white flex items-center justify-center text-xl shadow-inner">+
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-slate-900">Register your child</div>
                    <p className="text-sm text-slate-600 mt-1">Shareable public form for parents</p>
                  </div>
                </div>
              </CardLink>
            </section>

            {/* Players */}
            <section className="flex flex-col">
              <h2 className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase mb-3">Players</h2>
              <div className="h-full p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center text-xl">👥</div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-slate-900">Player portal</div>
                    <div className="text-sm text-slate-500">(coming soon)</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-400">This area is informational</div>
              </div>
            </section>

            {/* Coaches */}
            <section className="flex flex-col">
              <h2 className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase mb-3">Coaches</h2>
              <CardLink href="/dashboard" ariaLabel="Coach dashboard" className="h-full p-6 bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center text-xl">⚙️</div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-slate-900">Coach dashboard</div>
                    <p className="text-sm text-slate-600 mt-1">Manage players, sessions & attendance</p>
                  </div>
                </div>
              </CardLink>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-xs sm:text-sm text-slate-400">
            © {new Date().getFullYear()} Revelation Football Academy
          </div>
        </div>
      </main>
    </div>
  );
}
