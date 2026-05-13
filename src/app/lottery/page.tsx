"use client";
import Link from "next/link";
import { Ticket, Store, ChevronRight, ArrowLeft } from "lucide-react";

const shops = [
  { id: "001", name: "VAKAD" },
  { id: "002", name: "CHENNARA" },
  { id: "003", name: "PC PADI TIRUR" },
  { id: "004", name: "ALISHERY" },
  { id: "005", name: "KOOTTU MOOCHI" },
  { id: "006", name: "PACHATTRI" },
];

export default function LotteryShopList() {
  return (
    <div className="min-h-screen bg-page flex flex-col items-center py-12 px-6">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-mesh opacity-40" />

      {/* Header */}
      <div className="w-full max-w-2xl mb-12 flex flex-col items-center">
        <Link href="/" className="self-start flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8 font-bold text-xs uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="w-16 h-16 bg-lottery rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-lottery/20 animate-float">
          <Ticket className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-black text-text-primary uppercase tracking-tight mb-2">
          RK <span className="text-lottery">Lottery</span>
        </h1>
        <p className="text-text-secondary font-medium">Select your shop to proceed</p>
      </div>

      {/* Shop Grid */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        {shops.map((shop, i) => (
          <Link 
            key={shop.id}
            href={`/lottery/login?shopId=${shop.id}&shopName=${encodeURIComponent(shop.name)}`}
            className="group relative glass p-6 rounded-3xl card-hover flex items-center gap-4 animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="w-12 h-12 bg-lottery-subtle rounded-xl flex items-center justify-center text-lottery font-black text-xs shrink-0 group-hover:bg-lottery group-hover:text-white transition-all">
              {shop.id}
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-0.5">Shop Terminal</p>
              <h3 className="text-lg font-black text-text-primary tracking-tight leading-none uppercase">
                {shop.name}
              </h3>
            </div>
            <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-lottery group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">
          Secure Shop Portal • RK Group
        </p>
      </div>
    </div>
  );
}
