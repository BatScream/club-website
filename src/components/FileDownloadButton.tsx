// src/components/FileDownloadButton.tsx
"use client";

import React, { useState } from "react";

/**
 * FileDownloadButton
 * Calls server endpoint /api/uploads/download?key=<S3 key> which returns a presigned GET URL,
 * then opens that URL in a new tab.
 *
 * Props:
 *  - filename?: string
 *  - keyProp: s3 key string (passed in for clarity)
 */
export default function FileDownloadButton({ keyProp }: { regId: string; field: string; filename?: string | null; keyProp: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = async () => {
    setError(null);
    setLoading(true);
    try {
      // call server to generate download presigned url
      const res = await fetch(`/api/uploads/download?key=${encodeURIComponent(keyProp)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error((body && body.error) || `Failed to get download URL (${res.status})`);
      }
      const json = await res.json();
      const { downloadUrl } = json;
      if (!downloadUrl) throw new Error("No download URL returned");

      // open in new tab
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      console.error("download error", err);
      setError(err?.message || "Download failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button type="button" onClick={handleOpen} disabled={loading} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm disabled:opacity-60">
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-20" /><path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>
            <span>Opening…</span>
          </>
        ) : (
          <span>Open</span>
        )}
      </button>

      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
}
