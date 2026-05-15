"use client";
import Link from "next/link";
import { Ticket, Store, ChevronRight, ArrowLeft } from "lucide-react";

import { useState, useEffect } from "react";
import { getShops } from "@/app/admin/shops/actions";

export default function LotteryShopList() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShops() {
      try {
        const data = await getShops();
        setShops(data);
      } catch (err: any) {
        console.error("Failed to fetch shops:", err);
        setError("Failed to load shops. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchShops();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-page">
      <div className="w-8 h-8 border-4 border-lottery border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-page px-6 text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
        <Ticket className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black text-text-primary mb-2 uppercase">Oops!</h2>
      <p className="text-text-secondary mb-6">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-lottery text-white font-bold rounded-xl hover:bg-lottery/90 transition-colors"
      >
        Retry
      </button>
    </div>
  );
  return (
    <div className="min-h-screen bg-page flex flex-col items-center py-12 px-6">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-mesh opacity-40" />

      {/* Header */}
      <div className="w-full max-w-2xl mb-12 flex flex-col items-center">
        <Link href="/" className="self-start flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8 font-bold text-xs uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl overflow-hidden shadow-2xl shadow-lottery/20 border-2 border-white mb-6 animate-float">
          <img src="/logo.png?v=2" alt="RK Group" className="w-full h-full object-cover" />
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
            key={shop.shop_id}
            href={`/lottery/login?shopId=${shop.shop_id}&shopName=${encodeURIComponent(shop.name)}`}
            className="group relative glass p-4 md:p-6 rounded-3xl card-hover flex items-center gap-4 animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-lottery-subtle rounded-xl flex items-center justify-center text-lottery font-black text-[10px] md:text-xs shrink-0 group-hover:bg-lottery group-hover:text-white transition-all uppercase">
              {shop.shop_id.slice(0, 3)}
            </div>
            <div className="flex-1">
              <p className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-widest mb-0.5">Shop Terminal</p>
              <h3 className="text-base md:text-lg font-black text-text-primary tracking-tight leading-none uppercase">
                {shop.name}
              </h3>
            </div>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-text-muted group-hover:text-lottery group-hover:translate-x-1 transition-all" />
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
