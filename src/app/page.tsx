export default function Home() {
  return (
    <main className="h-screen w-full bg-gray-900 text-white flex items-center justify-center px-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">
        
        {/* Academy Info */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400">
            Revelation Football Academy
          </h1>
          <p className="text-lg text-gray-300">
            Located in <b>Urappakkam</b>, we are committed to nurturing young
            talent and instilling the values of teamwork, discipline, and fair
            play. Our structured programs are designed for aspiring footballers
            of all ages.
          </p>
          <div className="space-y-2 text-gray-400">
            <p>📍 Urappakkam, Chennai</p>
          </div>
        </div>

        {/* Coaches */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div className="w-20 h-20 mx-auto bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold text-yellow-400">
              M
            </div>
            <h3 className="mt-4 text-xl font-semibold">Mohan</h3>
            <p className="text-gray-400">Head Coach</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div className="w-20 h-20 mx-auto bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold text-yellow-400">
              K
            </div>
            <h3 className="mt-4 text-xl font-semibold">Karthik</h3>
            <p className="text-gray-400">Assistant Coach</p>
          </div>
        </div>
      </div>
    </main>
  );
}
