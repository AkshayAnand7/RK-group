export default function LotteryLoading() {
  return (
    <div className="min-h-screen bg-page flex flex-col items-center py-12 px-6">
      <div className="fixed inset-0 -z-10 bg-mesh opacity-40" />
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="w-20 h-20 bg-slate-200 rounded-3xl animate-pulse mb-6" />
        <div className="h-9 w-48 bg-slate-200 rounded-xl animate-pulse mb-2" />
        <div className="h-4 w-56 bg-slate-100 rounded animate-pulse mb-12" />
        
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass p-6 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-xl animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
                <div className="h-5 w-28 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
