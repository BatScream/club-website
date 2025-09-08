// src/components/RegisteredToast.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisteredToast({ name }: { name?: string | null }) {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  if (!open) return null;

  const handleClose = () => {
    setOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("registered");
    url.searchParams.delete("name");
    router.replace(url.pathname + url.search);
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg shadow">
        <div className="flex-1">
          <p className="font-semibold text-green-800">Player registered</p>
          <p className="text-sm text-green-700">
            {name ? `${name} has been added to the squad.` : "Player has been added."}
          </p>
        </div>
        <button
          aria-label="Close"
          onClick={handleClose}
          className="text-green-800 font-bold px-2 py-1 rounded hover:bg-green-100"
        >
          ×
        </button>
      </div>
    </div>
  );
}
