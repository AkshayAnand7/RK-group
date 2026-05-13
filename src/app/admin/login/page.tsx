"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, Lock, User, ArrowLeft, 
  ChevronRight, Loader2, Sparkles, Key
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate Admin Auth Validation
    await new Promise(r => setTimeout(r, 1200));
    
    if (adminId === "rk_admin" && password === "rk_password123") {
      document.cookie = "admin_session=true; path=/";
      setLoading(false);
      router.push("/admin/dashboard");
    } else {
      setLoading(false);
      setError("Invalid Master Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-sidebar flex flex-col items-center justify-center py-12 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-mesh opacity-20" />
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-slow-spin" />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 font-bold text-xs uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Gateway
        </Link>

        <div className="glass-dark p-8 sm:p-10 rounded-4xl border border-white/10 shadow-2xl relative overflow-hidden bg-slate-900/90 backdrop-blur-2xl">
          {/* Header */}
          <div className="relative z-10 mb-10 text-center">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl shadow-primary/40 animate-float">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Super Admin Access</p>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              RK <span className="text-primary">Master</span> Panel
            </h2>
            <p className="text-slate-400 text-xs font-bold mt-2">Enter master credentials to unlock system</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {error && (
              <div className="p-4 bg-danger/10 border border-danger/20 rounded-2xl text-danger text-xs font-bold text-center animate-shake">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  required 
                  value={adminId}
                  onChange={e => setAdminId(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-800/50 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Master Password</label>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-800/50 border border-white/10 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Unlock Master Control <ChevronRight className="w-5 h-5" /></>}
            </button>
          </form>

          {/* Decorative Sparkle */}
          <Sparkles className="absolute top-0 right-0 w-24 h-24 text-white/5 -mr-8 -mt-8 rotate-12" />
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
             System Version 4.0.1 • Encrypted Layer Active
          </p>
        </div>
      </div>
    </div>
  );
}
