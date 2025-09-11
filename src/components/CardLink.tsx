// src/components/CardLink.tsx
"use client";

import React, { useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";
import clsx from "clsx";

export default function CardLink({
  href,
  children,
  className = "",
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    // use startTransition to let React know this is non-urgent
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseEnter={() => router.prefetch(href)}
      onTouchStart={() => router.prefetch(href)}
      aria-label={ariaLabel ?? undefined}
      aria-busy={loading}
      className={clsx(
        "relative block bg-white rounded-xl shadow-sm border border-transparent",
        "hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5",
        "transition-all duration-200 ease-out cursor-pointer will-change-transform",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2",
        className
      )}
    >
      {/* Card content */}
      <div className={clsx(loading && "opacity-40")}>{children}</div>

      {/* Spinner overlay when loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/70 dark:bg-black/40 rounded-full p-3 shadow">
            <LoadingSpinner size={22} />
          </div>
        </div>
      )}
    </a>
  );
}
