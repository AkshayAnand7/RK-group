"use client";
import Link from "next/link";
import { Ticket, Bus, ChevronRight, Settings, Monitor } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-mesh overflow-hidden py-10">
      {/* Admin Access (Discrete) */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
        <Link 
          href="/login" 
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-all group"
        >
          <Settings className="w-4 h-4 md:w-5 md:h-5 text-text-primary group-hover:rotate-90 transition-transform" />
        </Link>
      </div>

      {/* ... Background Orbs ... */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[100px] md:blur-[150px] rounded-full animate-slow-spin" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-lottery/10 blur-[80px] md:blur-[120px] rounded-full animate-pulse" />

      <div className="relative z-10 w-full max-w-6xl px-4 md:px-6 py-6 md:py-12 text-center">
        {/* Main Logo */}
        <div className="mb-8 md:mb-12 scroll-reveal flex flex-col items-center">
          <div className="relative w-32 h-32 md:w-56 md:h-56 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/30 border-4 border-white mb-6 transform hover:scale-105 transition-transform duration-500">
            <img 
              src="/logo.png?v=2" 
              alt="RK Group Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <p className="mt-2 text-text-secondary font-black tracking-[0.2em] md:tracking-[0.4em] uppercase text-[9px] md:text-xs opacity-70">
            Enterprise Management System
          </p>
        </div>

        {/* Three Separate Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto scroll-stagger">
          {/* RK Lottery Link */}
          <Link 
            href="/lottery" 
            className="group relative glass p-6 md:p-8 rounded-4xl card-hover overflow-hidden block text-left"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-lottery/10 blur-3xl -mr-16 -mt-16 group-hover:bg-lottery/20 transition-all" />
            <div className="w-12 h-12 md:w-14 md:h-14 bg-lottery rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-lottery/30 group-hover:rotate-6 transition-transform">
              <Ticket className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-text-primary mb-2 uppercase tracking-tight">RK Lottery</h2>
            <p className="text-text-secondary text-[10px] md:text-xs font-medium mb-6">Shop Terminals & Daily Collections</p>
            <div className="inline-flex items-center gap-2 font-bold text-lottery text-[9px] md:text-[10px] uppercase tracking-widest group/link">
              Select Shop <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* RK Travel Link */}
          <Link 
            href="/travel" 
            className="group relative glass p-6 md:p-8 rounded-4xl card-hover overflow-hidden block text-left"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-travel/10 blur-3xl -mr-16 -mt-16 group-hover:bg-travel/20 transition-all" />
            <div className="w-12 h-12 md:w-14 md:h-14 bg-travel rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-travel/30 group-hover:-rotate-6 transition-transform">
              <Bus className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-text-primary mb-2 uppercase tracking-tight">RK Travel</h2>
            <p className="text-text-secondary text-[10px] md:text-xs font-medium mb-6">Driver & Fleet Management Gateway</p>
            <div className="inline-flex items-center gap-2 font-bold text-travel text-[9px] md:text-[10px] uppercase tracking-widest group/link">
              Staff Login <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Software Sale Link */}
          <Link 
            href="/software-sale" 
            className="group relative glass p-6 md:p-8 rounded-4xl card-hover overflow-hidden block text-left"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-slate-500/20 transition-all" />
            <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-slate-800/30 group-hover:rotate-12 transition-transform">
              <Monitor className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-text-primary mb-2 uppercase tracking-tight">Software Sale</h2>
            <p className="text-text-secondary text-[10px] md:text-xs font-medium mb-6">Admin Software Sales & Reporting</p>
            <div className="inline-flex items-center gap-2 font-bold text-slate-800 text-[9px] md:text-[10px] uppercase tracking-widest group/link">
              Admin Login <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Footer info */}
        <div className="mt-20 text-text-muted font-bold text-[10px] uppercase tracking-widest scroll-reveal [animation-delay:600ms]">
          © 2026 RK GROUP • INDEPENDENT MODULE GATEWAY
        </div>
      </div>
    </div>
  );
}
