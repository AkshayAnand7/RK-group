'use client'

import { useState } from "react";
import { 
  IndianRupee, Store, Bus, 
  Fuel, AlertCircle, TrendingUp, TrendingDown 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer 
} from "recharts";

import { useRouter, useSearchParams } from "next/navigation";

export default function DashboardClient({ stats }: { stats: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod = stats.period || "week";

  const handlePeriod = (p: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('period', p);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 scroll-reveal">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">Dashboard Overview</h1>
          <p className="text-xs sm:text-sm text-text-secondary font-medium">RK Group Enterprise Management Command Center</p>
        </div>
        <div className="flex gap-1 p-1 bg-white border border-border rounded-xl shadow-sm overflow-x-auto scrollbar-none">
          {["today", "week", "month", "all"].map(p => (
            <button key={p} onClick={() => handlePeriod(p)}
              className={`px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all duration-150 capitalize cursor-pointer whitespace-nowrap ${
                currentPeriod === p ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-text-secondary hover:text-text-primary"
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* RK Lottery Summary */}
      <div className="space-y-4 scroll-reveal">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-lottery/10 flex items-center justify-center">
            <Store className="w-4 h-4 text-lottery" />
          </div>
          <h2 className="text-base sm:text-lg font-black uppercase tracking-widest text-text-primary">RK Lottery Summary</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 scroll-stagger">
          {[
            { label: "Total Collection", value: stats.lottery.totalCollection, color: "text-lottery", bg: "bg-lottery-subtle" },
            { label: "Total Expense", value: stats.lottery.totalExpense, color: "text-danger", bg: "bg-danger-subtle" },
            { label: "Net Balance", value: stats.lottery.netBalance, color: "text-white", bg: "bg-lottery", highlight: true },
          ].map((card, i) => (
            <div key={card.label} className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-border flex flex-col justify-between transition-all hover:shadow-xl ${card.highlight ? card.bg + " shadow-xl shadow-lottery/20 border-transparent" : "bg-white"}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-3 sm:mb-4 ${card.highlight ? "text-white/70" : "text-text-muted"}`}>{card.label}</p>
              <p className={`text-lg sm:text-xl font-black font-mono-nums ${card.highlight ? "text-white" : card.color}`}>₹{Number(card.value).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RK Travel Summary */}
      <div className="space-y-4 scroll-reveal">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-travel/10 flex items-center justify-center">
            <Bus className="w-4 h-4 text-travel" />
          </div>
          <h2 className="text-base sm:text-lg font-black uppercase tracking-widest text-text-primary">RK Travel Summary</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 scroll-stagger">
          {[
            { label: "Total Trip Income", value: stats.travel.totalIncome, color: "text-travel", icon: IndianRupee },
            { label: "Vehicle Expenses", value: stats.travel.totalExpense, color: "text-danger", icon: Fuel },
            { label: "Pending Amounts", value: stats.travel.pendingAmount, color: "text-warning", icon: AlertCircle },
            { label: "Net Profit", value: stats.travel.netProfit, color: "text-white", bg: "bg-travel", highlight: true },
          ].map((card, i) => (
            <div key={card.label} className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border flex flex-col transition-all hover:shadow-xl ${card.highlight ? card.bg + " shadow-xl shadow-travel/20 border-transparent" : "bg-white"}`}>
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${card.highlight ? "text-white/70" : "text-text-muted"}`}>{card.label}</p>
                {card.icon && <card.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${card.highlight ? "text-white/70" : "text-text-muted opacity-40"}`} />}
              </div>
              <p className={`text-lg sm:text-2xl font-black font-mono-nums ${card.highlight ? "text-white" : card.color}`}>₹{Number(card.value).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="glass p-4 sm:p-6 rounded-3xl sm:rounded-4xl scroll-reveal">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-text-primary">Revenue Breakdown</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-lottery" /> <span className="text-[10px] font-bold text-text-muted uppercase">Lottery</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-travel" /> <span className="text-[10px] font-bold text-text-muted uppercase">Travel</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.revenueData}>
              <defs>
                <linearGradient id="colorLottery" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTravel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} tickFormatter={(value) => `₹${(value/1000).toFixed(1)}k`} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="lottery" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorLottery)" />
              <Area type="monotone" dataKey="travel" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorTravel)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass p-4 sm:p-6 rounded-3xl sm:rounded-4xl flex flex-col justify-center scroll-reveal">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-text-primary">Combined Monthly P&L</h3>
            <p className="text-[10px] text-text-muted font-bold mt-1">TOTAL GROUP PERFORMANCE</p>
          </div>
          <div className="flex items-center justify-center gap-6 sm:gap-12">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-lottery/10 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-lottery" />
              </div>
              <p className="text-lg sm:text-2xl font-black text-text-primary font-mono-nums">₹{((stats.lottery.totalCollection + stats.travel.totalIncome)/100000).toFixed(1)}L</p>
              <p className="text-[9px] sm:text-[10px] font-black text-text-muted uppercase tracking-widest">Total Revenue</p>
            </div>
            <div className="w-px h-16 sm:h-20 bg-border" />
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-danger/10 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-danger" />
              </div>
              <p className="text-lg sm:text-2xl font-black text-text-primary font-mono-nums">₹{((stats.lottery.totalExpense + stats.travel.totalExpense)/100000).toFixed(1)}L</p>
              <p className="text-[9px] sm:text-[10px] font-black text-text-muted uppercase tracking-widest">Total Expense</p>
            </div>
          </div>
          <div className="mt-8 sm:mt-10 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-primary text-white shadow-2xl shadow-primary/30 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">Estimated Net Profit</p>
            <p className="text-2xl sm:text-4xl font-black font-mono-nums tracking-tight">₹{(stats.lottery.netBalance + stats.travel.netProfit).toLocaleString("en-IN")}</p>
            <p className="text-[10px] font-bold mt-2 text-primary-subtle">LIVE DATABASE SYNC</p>
          </div>
        </div>
      </div>
    </div>
  );
}
