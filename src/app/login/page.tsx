"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ShieldCheck, Lock, Eye, EyeOff,
  ChevronRight, Loader2, User, AlertCircle, ArrowLeft
} from "lucide-react"
import { signIn, getSession } from "next-auth/react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Detect which module the user is trying to access
  const callbackUrl = searchParams.get("callbackUrl") || ""
  const moduleInfo = (() => {
    if (callbackUrl.startsWith("/lottery")) return { label: "RK Lottery", subtitle: "Shop Terminal Portal", color: "text-lottery" }
    if (callbackUrl.startsWith("/travel")) return { label: "RK Travel", subtitle: "Fleet Management Portal", color: "text-travel" }
    if (callbackUrl.startsWith("/software-sale")) return { label: "Software Sale", subtitle: "Sales & Reporting Portal", color: "text-slate-800" }
    if (callbackUrl.startsWith("/admin")) return { label: "Admin Panel", subtitle: "System Administration", color: "text-primary" }
    return { label: "RK Group", subtitle: "Secure Operations Portal", color: "text-text-primary" }
  })()

  useEffect(() => {
    const err = searchParams.get("error")
    if (err === "Unauthorized") {
      setError("You are not authorized to view that page. Please log in with a permitted account.")
    } else if (err) {
      setError("Authentication failed. Please try again.")
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        user_id: userId,
        password: password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error.includes("Invalid user ID") || result.error.includes("CredentialsSignin")) {
          setError("Invalid User ID or password")
        } else if (result.error.includes("User disabled")) {
          setError("Your account is currently inactive")
        } else {
          setError("Invalid User ID or password")
        }
        setLoading(false)
      } else {
        // If there's a callbackUrl, go there. Otherwise, redirect based on role.
        if (callbackUrl) {
          window.location.replace(callbackUrl);
        } else {
          // Fetch the fresh session to get the user's role
          const session = await getSession();
          const role = (session?.user as any)?.role || '';
          const roleDefaultPages: Record<string, string> = {
            admin: '/admin/dashboard',
            agent: '/software-sale',
            lottery_staff: '/lottery',
            travel_staff: '/travel',
            staff: '/travel',
          };
          window.location.replace(roleDefaultPages[role] || '/');
        }
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

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
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shadow-lg mb-6 mx-auto">
              <img src="/logo.png?v=2" alt="RK Group" className="w-full h-full object-cover" />
            </div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">{moduleInfo.subtitle}</p>
            <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight ${moduleInfo.color}`}>
              {moduleInfo.label}
            </h2>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 mb-6 bg-danger-subtle border border-danger/20 rounded-2xl flex items-center gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-danger shrink-0" />
              <p className="text-xs font-bold text-danger leading-tight">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">User ID</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-slate-800 transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="e.g. ADMIN01"
                  value={userId}
                  onChange={e => setUserId(e.target.value.toUpperCase())}
                  className="w-full h-14 pl-12 pr-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-slate-800 focus:ring-4 focus:ring-slate-800/10 transition-all uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-slate-800 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-12 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-slate-800 focus:ring-4 focus:ring-slate-800/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-slate-800 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-slate-800 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-800/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Sign In <ChevronRight className="w-5 h-5" /></>}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-white border border-border rounded-full shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Authorized Access Only</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-page">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
