"use client";

import { useState } from "react";

type Props = {
  fileId: string;
  filename?: string | null;
};

export default function FileDownloadButton({ fileId, filename }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `/api/uploads/drive-download?fileId=${encodeURIComponent(fileId)}`
      );
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Failed to get file (${res.status})`);
      }

      // The endpoint streams the file directly, so open it in a new tab
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || "document";
      link.target = "_blank";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("download error", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={handleOpen}
        disabled={loading}
        aria-label={`Open ${filename ?? "file"}`}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm disabled:opacity-60"
      >
        {loading ? "Opening…" : "Open"}
      </button>
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
}
