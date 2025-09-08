// src/components/LoadingSpinner.tsx
"use client";

export default function LoadingSpinner({ size = 20 }: { size?: number }) {
  // size in px
  const s = size;
  return (
    <svg
      role="img"
      aria-hidden="true"
      className="animate-spin"
      style={{ width: s, height: s }}
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        strokeOpacity="0.25"
        fill="none"
      />
      <path
        d="M4 12a8 8 0 018-8"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
