import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-7 w-48 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-4 w-64 bg-slate-100 rounded-lg animate-pulse mt-2" />
        </div>
        <div className="h-11 w-36 bg-slate-200 rounded-xl animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass p-5 rounded-2xl">
            <div className="h-8 w-16 bg-slate-200 rounded-lg animate-pulse mx-auto mb-2" />
            <div className="h-3 w-20 bg-slate-100 rounded animate-pulse mx-auto" />
          </div>
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass p-6 sm:p-8 rounded-3xl sm:rounded-4xl border border-border">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
            </div>
            <div className="mb-6 space-y-3">
              <div className="h-6 w-32 bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="h-11 w-full bg-slate-100 rounded-xl animate-pulse mt-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
