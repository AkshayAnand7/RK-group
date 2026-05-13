"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Bus, Lock, User, ArrowLeft, 
  ChevronRight, Loader2, ShieldCheck
} from "lucide-react";

export default function TravelLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth
    await new Promise(r => setTimeout(r, 1200));
    document.cookie = "staff_session=true; path=/";
    setLoading(false);
    router.push("/staff/travel/trips");
  };

  return (
    <div className="min-h-screen bg-page flex flex-col items-center justify-center py-12 px-6">
      <div className="fixed inset-0 -z-10 bg-mesh opacity-30" />

      <div className="w-full max-w-md animate-fade-in">
        <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-travel transition-colors mb-8 font-bold text-xs uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="glass p-8 sm:p-10 rounded-4xl border border-white shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="relative z-10 mb-10 text-center">
            <div className="w-16 h-16 bg-travel/10 border border-travel/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Bus className="w-8 h-8 text-travel" />
            </div>
            <p className="text-[10px] font-black text-travel uppercase tracking-[0.2em] mb-1">Fleet Management Portal</p>
            <h2 className="text-3xl font-black text-text-primary uppercase tracking-tight">
              RK <span className="text-travel">Travel</span>
            </h2>
            <p className="text-text-secondary text-xs font-bold mt-2 opacity-60">Staff Gateway</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Staff ID / Driver ID</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-travel transition-colors" />
                <input 
                  type="text" 
                  required 
                  placeholder="Enter Staff ID"
                  value={staffId}
                  onChange={e => setStaffId(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel focus:ring-4 focus:ring-travel/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-travel transition-colors" />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel focus:ring-4 focus:ring-travel/10 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-travel text-white rounded-2xl font-black text-lg shadow-xl shadow-travel/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Staff Login <ChevronRight className="w-5 h-5" /></>}
            </button>
          </form>

          {/* Decorative */}
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Bus className="w-32 h-32 text-travel -mr-16 -mt-16 rotate-12" />
          </div>
        </div>

        <div className="mt-8 text-center flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-white border border-border rounded-full shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Fleet Security Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
