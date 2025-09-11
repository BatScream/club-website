// src/components/CardLink.tsx
"use client";

import React from "react";
import Link from "next/link";
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
  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? undefined}
      className={clsx(
        "relative block bg-white rounded-xl shadow-sm border border-transparent",
        "hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5",
        "transition-all duration-200 ease-out cursor-pointer will-change-transform",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </Link>
  );
}
