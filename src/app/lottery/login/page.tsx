"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Store, Lock, User, ArrowLeft, 
  ChevronRight, Loader2, ShieldCheck, Ticket, AlertCircle, Mail
} from "lucide-react";
import { loginToLottery } from "./actions";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shopId = searchParams.get("shopId") || "000";
  const shopName = searchParams.get("shopName") || "Unknown Shop";

  const [loading, setLoading] = useState(false);
  const [authId, setAuthId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const result = await loginToLottery(authId, password);

    if (result.success) {
      // Set frontend session state cookies that the legacy layout depends on
      document.cookie = `user_name=${authId.split('@')[0]}; path=/`;
      document.cookie = `active_shop_id=${shopId}; path=/`;
      document.cookie = `active_shop_name=${shopName}; path=/`;
      setLoading(false);
      router.push("/staff/lottery/entry");
    } else {
      setLoading(false);
      setError(result.error || "Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-page flex flex-col items-center justify-center py-12 px-6">
      <div className="fixed inset-0 -z-10 bg-mesh opacity-30" />

      <div className="w-full max-w-md animate-fade-in">
        <Link href="/lottery" className="inline-flex items-center gap-2 text-text-muted hover:text-lottery transition-colors mb-8 font-bold text-xs uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Other Shops
        </Link>

        <div className="glass p-8 sm:p-10 rounded-4xl border border-white shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="relative z-10 mb-10 text-center">
            <div className="w-16 h-16 bg-lottery/10 border border-lottery/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Store className="w-8 h-8 text-lottery" />
            </div>
            <p className="text-[10px] font-black text-lottery uppercase tracking-[0.2em] mb-1">Authenticated Terminal</p>
            <h2 className="text-3xl font-black text-text-primary uppercase tracking-tight">
              {shopName}
            </h2>
            <p className="text-text-secondary text-xs font-bold mt-2 opacity-60">ID: {shopId}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-lottery transition-colors" />
                <input 
                  type="email" 
                  required 
                  placeholder="Enter Email"
                  value={authId}
                  onChange={e => setAuthId(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-lottery focus:ring-4 focus:ring-lottery/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Terminal Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-lottery transition-colors" />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-lottery focus:ring-4 focus:ring-lottery/10 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-danger-subtle border border-danger/20 rounded-2xl flex items-center gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-danger shrink-0" />
                <p className="text-xs font-bold text-danger leading-tight">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-lottery text-white rounded-2xl font-black text-lg shadow-xl shadow-lottery/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Unlock Terminal <ChevronRight className="w-5 h-5" /></>}
            </button>
          </form>

          {/* Decorative */}
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Ticket className="w-32 h-32 text-lottery -mr-16 -mt-16 rotate-12" />
          </div>
        </div>

        <div className="mt-8 text-center flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-white border border-border rounded-full shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">End-to-End Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LotteryLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-page">
        <Loader2 className="w-8 h-8 animate-spin text-lottery" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
