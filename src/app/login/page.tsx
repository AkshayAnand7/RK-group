"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, Mail, Lock, Eye, EyeOff, 
  ArrowRight, Loader2, Sparkles, Globe 
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    
    if (email.includes("admin")) router.push("/admin/dashboard");
    else if (email.includes("travel")) router.push("/staff/travel/trips");
    else router.push("/staff/lottery/entry");
  };

  return (
    <div className="min-h-screen flex bg-page overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full animate-slow-spin" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse" />

      {/* Left Column: Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-sidebar items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-10" />
        <div className="relative z-10 max-w-lg text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl mb-10 animate-float">
            <img src="/logo.png?v=2" alt="RK Group" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-5xl font-black text-white leading-tight mb-6">
            The Hub of <br />
            <span className="text-primary italic">RK Group</span> Business
          </h1>
          <p className="text-xl text-slate-400 font-medium mb-10 leading-relaxed">
            A single, secure platform to manage multi-module operations, staff, and real-time financial data.
          </p>
          <div className="space-y-4">
            {['End-to-end Encryption', 'Role-Based Access Control', 'Automated Reporting'].map(item => (
              <div key={item} className="flex items-center gap-3 text-slate-300">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Animated Background Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm" />
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo Mobile */}
          <div className="lg:hidden flex justify-center mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-border shadow-lg">
                <img src="/logo.png?v=2" alt="RK" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-black tracking-tight text-text-primary uppercase">RK Group</span>
            </div>
          </div>

          <div className="glass p-8 sm:p-10 rounded-4xl border border-white shadow-2xl">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-text-primary mb-2">Welcome Back</h2>
              <p className="text-text-secondary font-medium">Enter your credentials to access your dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    required 
                    placeholder="name@rkgroup.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-black text-text-muted uppercase tracking-widest">Password</label>
                  <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full h-14 pl-12 pr-12 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-primary transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer" />
                <label htmlFor="remember" className="text-xs font-bold text-text-secondary cursor-pointer">Remember this device</label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Access System <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs font-bold text-text-muted flex items-center justify-center gap-2">
              <Globe className="w-4 h-4" /> Secure regional gateway • RK GROUP INDIA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
