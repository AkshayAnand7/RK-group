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

export default function DashboardClient({ stats }: { stats: any }) {
  const [period, setPeriod] = useState("week");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-text-secondary font-medium">RK Group Enterprise Management Command Center</p>
        </div>
        <div className="flex gap-1 p-1 bg-white border border-border rounded-xl shadow-sm">
          {["today", "week", "month", "custom"].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-150 capitalize cursor-pointer ${
                period === p ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-text-secondary hover:text-text-primary"
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* RK Lottery Summary */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-lottery/10 flex items-center justify-center">
            <Store className="w-4 h-4 text-lottery" />
          </div>
          <h2 className="text-lg font-black uppercase tracking-widest text-text-primary">RK Lottery Summary</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {[
            { label: "Total Collection", value: stats.lottery.totalCollection, color: "text-lottery", bg: "bg-lottery-subtle" },
            { label: "Total Expense", value: stats.lottery.totalExpense, color: "text-danger", bg: "bg-danger-subtle" },
            { label: "Net Balance", value: stats.lottery.netBalance, color: "text-white", bg: "bg-lottery", highlight: true },
          ].map((card, i) => (
            <div key={card.label} className={`p-5 rounded-3xl border border-border flex flex-col justify-between transition-all hover:shadow-xl ${card.highlight ? card.bg + " shadow-xl shadow-lottery/20 border-transparent" : "bg-white"}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${card.highlight ? "text-white/70" : "text-text-muted"}`}>{card.label}</p>
              <p className={`text-xl font-black font-mono-nums ${card.highlight ? "text-white" : card.color}`}>₹{Number(card.value).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RK Travel Summary */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-travel/10 flex items-center justify-center">
            <Bus className="w-4 h-4 text-travel" />
          </div>
          <h2 className="text-lg font-black uppercase tracking-widest text-text-primary">RK Travel Summary</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Trip Income", value: stats.travel.totalIncome, color: "text-travel", icon: IndianRupee },
            { label: "Vehicle Expenses", value: stats.travel.totalExpense, color: "text-danger", icon: Fuel },
            { label: "Pending Amounts", value: stats.travel.pendingAmount, color: "text-warning", icon: AlertCircle },
            { label: "Net Profit", value: stats.travel.netProfit, color: "text-white", bg: "bg-travel", highlight: true },
          ].map((card, i) => (
            <div key={card.label} className={`p-6 rounded-3xl border border-border flex flex-col transition-all hover:shadow-xl ${card.highlight ? card.bg + " shadow-xl shadow-travel/20 border-transparent" : "bg-white"}`}>
              <div className="flex items-start justify-between mb-6">
                <p className={`text-[10px] font-black uppercase tracking-widest ${card.highlight ? "text-white/70" : "text-text-muted"}`}>{card.label}</p>
                {card.icon && <card.icon className={`w-4 h-4 ${card.highlight ? "text-white/70" : "text-text-muted opacity-40"}`} />}
              </div>
              <p className={`text-2xl font-black font-mono-nums ${card.highlight ? "text-white" : card.color}`}>₹{Number(card.value).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-4xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Revenue Breakdown</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-lottery" /> <span className="text-[10px] font-bold text-text-muted uppercase">Lottery</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-travel" /> <span className="text-[10px] font-bold text-text-muted uppercase">Travel</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
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

        <div className="glass p-6 rounded-4xl flex flex-col justify-center">
          <div className="text-center mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Combined Monthly P&L</h3>
            <p className="text-[10px] text-text-muted font-bold mt-1">TOTAL GROUP PERFORMANCE</p>
          </div>
          <div className="flex items-center justify-center gap-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-3xl bg-lottery/10 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-lottery" />
              </div>
              <p className="text-2xl font-black text-text-primary font-mono-nums">₹{((stats.lottery.totalCollection + stats.travel.totalIncome)/100000).toFixed(1)}L</p>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Total Revenue</p>
            </div>
            <div className="w-px h-20 bg-border" />
            <div className="text-center">
              <div className="w-16 h-16 rounded-3xl bg-danger/10 flex items-center justify-center mx-auto mb-3">
                <TrendingDown className="w-8 h-8 text-danger" />
              </div>
              <p className="text-2xl font-black text-text-primary font-mono-nums">₹{((stats.lottery.totalExpense + stats.travel.totalExpense)/100000).toFixed(1)}L</p>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Total Expense</p>
            </div>
          </div>
          <div className="mt-10 p-6 rounded-3xl bg-primary text-white shadow-2xl shadow-primary/30 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">Estimated Net Profit</p>
            <p className="text-4xl font-black font-mono-nums tracking-tight">₹{(stats.lottery.netBalance + stats.travel.netProfit).toLocaleString("en-IN")}</p>
            <p className="text-[10px] font-bold mt-2 text-primary-subtle">LIVE DATABASE SYNC</p>
          </div>
        </div>
      </div>
    </div>
  );
}
