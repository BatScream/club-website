"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Left side - Academy name */}
      <Link href="/" className="text-xl font-bold text-yellow-400">
        Revelation Football Academy
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <Link href="/" className="hover:text-yellow-300">
          Home
        </Link>
        <Link href="/dashboard" className="hover:text-yellow-300">
          Coach Dashboard
        </Link>

        {/* Loading spinner */}
        {status === "loading" && (
          <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        )}

        {/* Authenticated state */}
        {status === "authenticated" && (
          <div className="flex items-center gap-3">
            {/* Profile picture */}
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || "Profile"}
                width={32}
                height={32}
                className="rounded-full border border-yellow-400"
              />
            )}

            {/* Name - hidden on small screens */}
            <span className="hidden sm:inline text-sm font-medium text-gray-200">
              {session.user?.name}
            </span>

            {/* Logout button */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold 
                         hover:bg-yellow-300 hover:scale-105 active:scale-95 
                         shadow-md transition-all"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
