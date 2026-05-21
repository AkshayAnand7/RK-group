"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Monitor, Lock, User, ArrowLeft, 
  ChevronRight, Loader2, ShieldCheck, AlertCircle, Mail
} from "lucide-react";
import { loginToSoftwareSale } from "./actions";

export default function SoftwareSaleLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await loginToSoftwareSale(email, password);

      if (result.success) {
        window.location.href = "/software-sale";
      } else {
        setError(result.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
      <div className="fixed inset-0 -z-10 bg-mesh opacity-30" />

      <div className="w-full max-w-md animate-fade-in">
        <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-slate-800 transition-colors mb-8 font-bold text-xs uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="glass p-6 sm:p-8 md:p-10 rounded-3xl sm:rounded-4xl border border-white shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="relative z-10 mb-10 text-center">
            <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Monitor className="w-8 h-8 text-slate-800" />
            </div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Admin Software Portal</p>
            <h2 className="text-2xl sm:text-3xl font-black text-text-primary uppercase tracking-tight">
              Software Sale
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-slate-800 transition-colors" />
                <input 
                  type="email" 
                  required 
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-slate-800 focus:ring-4 focus:ring-slate-800/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-slate-800 transition-colors" />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-slate-800 focus:ring-4 focus:ring-slate-800/10 transition-all"
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
              className="w-full h-14 bg-slate-800 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-800/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Access Portal <ChevronRight className="w-5 h-5" /></>}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-white border border-border rounded-full shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Authorized Access Only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
