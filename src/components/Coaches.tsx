export default function Coaches() {
  const coaches = [
    { name: "Mohan", role: "Head Coach" },
    { name: "Karthik", role: "Assistant Coach" },
  ];

  return (
    <div className="py-20 px-6 max-w-5xl mx-auto text-center">
      <h2 className="text-4xl font-bold text-[#FFED02] mb-12">Our Coaches</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {coaches.map((coach) => (
          <div
            key={coach.name}
            className="bg-[#22265A] p-8 rounded-xl shadow-lg hover:scale-105 transition"
          >
            <h3 className="text-2xl font-bold">{coach.name}</h3>
            <p className="mt-2 text-gray-300">{coach.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
