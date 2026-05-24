"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-fade-in">
      <div className="w-20 h-20 bg-danger-subtle rounded-2xl flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-danger" />
      </div>
      <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-text-secondary font-medium mb-1 max-w-md">
        An error occurred while loading this page. This could be a temporary issue.
      </p>
      <p className="text-[10px] text-text-muted font-mono mb-8 bg-page px-3 py-1 rounded-lg border border-border">
        {error.message || "Unknown error"}
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" /> Try Again
      </button>
    </div>
  );
}
