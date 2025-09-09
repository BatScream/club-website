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
        "relative block p-5 bg-white shadow rounded-lg hover:shadow-lg transition cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
        className
      )}
    >
      {/* Card content */}
      <div className={clsx(loading && "opacity-40")}>{children}</div>

      {/* Spinner overlay when loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/60 dark:bg-black/40 rounded-full p-3">
            <LoadingSpinner size={22} />
          </div>
        </div>
      )}
    </a>
  );
}
