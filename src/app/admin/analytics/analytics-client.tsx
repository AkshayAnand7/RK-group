"use client";
import { useState } from "react";
import { 
  Bus, Fuel, Wrench, TrendingUp, TrendingDown, 
  BarChart3, PieChart as PieIcon, ArrowRight, 
  AlertCircle, ChevronRight, Filter, Download, IndianRupee
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from "recharts";

export default function AnalyticsClient({ initialTrips, initialExpenses }: { initialTrips: any[], initialExpenses: any[] }) {
  // Aggregate Stats
  const totalFuel = initialExpenses.filter(e => e.category === 'fuel').reduce((s, e) => s + Number(e.amount), 0);
  const totalMaint = initialExpenses.filter(e => e.category === 'maintenance').reduce((s, e) => s + Number(e.amount), 0);
  const totalIncome = initialTrips.reduce((s, t) => s + Number(t.received_amount), 0);
  
  // Vehicle-wise Breakdown
  const vehicles = Array.from(new Set(initialTrips.map(t => t.vehicle).filter(Boolean)));
  const vehicleStats = vehicles.map(v => {
    const vTrips = initialTrips.filter(t => t.vehicle === v);
    const vExp = initialExpenses.filter(e => e.vehicle === v);
    
    const profit = vTrips.reduce((s, t) => s + Number(t.received_amount), 0) - vExp.reduce((s, e) => s + Number(e.amount), 0);
    const fuel = vExp.filter(e => e.category === 'fuel').reduce((s, e) => s + Number(e.amount), 0);
    const maint = vExp.filter(e => e.category === 'maintenance').reduce((s, e) => s + Number(e.amount), 0);
    
    return { id: v, profit, fuel, maint };
  }).sort((a, b) => b.profit - a.profit);

  // Month-wise aggregation (simplified for demo/production)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const trendData = months.map((m, idx) => {
    const monthExpenses = initialExpenses.filter(e => new Date(e.date).getMonth() === idx);
    const fuel = monthExpenses.filter(e => e.category === 'fuel').reduce((s, e) => s + Number(e.amount), 0);
    const maint = monthExpenses.filter(e => e.category === 'maintenance').reduce((s, e) => s + Number(e.amount), 0);
    return { month: m, fuel, maint };
  }).filter(d => d.fuel > 0 || d.maint > 0); // Only show months with data

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 scroll-reveal">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary uppercase tracking-tight">Vehicle Analytics</h1>
          <p className="text-xs sm:text-sm text-text-secondary font-medium">Live insights into fleet performance and operational costs</p>
        </div>
      </div>

      {/* Top Level Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 scroll-stagger">
        <div className="glass p-4 sm:p-6 rounded-3xl sm:rounded-4xl border-l-4 border-l-travel shadow-xl shadow-travel/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-travel/10 flex items-center justify-center">
              <Fuel className="w-5 h-5 text-travel" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">Total Fuel Expense</h3>
          </div>
          <p className="text-3xl font-black text-text-primary font-mono-nums">₹{totalFuel.toLocaleString("en-IN")}</p>
        </div>

        <div className="glass p-4 sm:p-6 rounded-3xl sm:rounded-4xl border-l-4 border-l-warning shadow-xl shadow-warning/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-warning/10 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-warning" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">Maintenance Costs</h3>
          </div>
          <p className="text-3xl font-black text-text-primary font-mono-nums">₹{totalMaint.toLocaleString("en-IN")}</p>
        </div>

        <div className="glass p-4 sm:p-6 rounded-3xl sm:rounded-4xl border-l-4 border-l-primary shadow-xl shadow-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">Total Trip Income</h3>
          </div>
          <p className="text-3xl font-black text-text-primary font-mono-nums">₹{totalIncome.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Expense Trends */}
        <div className="glass p-4 sm:p-8 rounded-3xl sm:rounded-4xl scroll-reveal">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Expense Trends</h3>
              <p className="text-[10px] font-bold text-text-muted mt-1 uppercase">Fuel vs Maintenance</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> <span className="text-[10px] font-bold text-text-muted uppercase">Fuel</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> <span className="text-[10px] font-bold text-text-muted uppercase">Maint</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} tickFormatter={(value) => `₹${value/1000}k`} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="fuel" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="maint" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profit per Vehicle */}
        <div className="glass p-4 sm:p-8 rounded-3xl sm:rounded-4xl">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Profit per Vehicle</h3>
              <p className="text-[10px] font-bold text-text-muted mt-1 uppercase">Real-time Performance breakdown</p>
            </div>
            <PieIcon className="w-5 h-5 text-text-muted" />
          </div>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {vehicleStats.map((v, i) => (
              <div key={v.id} className="p-4 bg-page/50 rounded-2xl border border-border/50 group hover:bg-white hover:shadow-lg hover:border-transparent transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-travel/10 flex items-center justify-center text-travel font-black text-[10px]">
                      {i + 1}
                    </div>
                    <span className="text-xs font-black text-text-primary uppercase tracking-tight">{v.id}</span>
                  </div>
                  <span className={`text-xs font-black font-mono-nums ${v.profit >= 0 ? "text-emerald-600" : "text-danger"}`}>
                    {v.profit >= 0 ? "+" : ""}₹{v.profit.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${v.profit >= 0 ? "bg-emerald-500" : "bg-danger"}`}
                    style={{ width: `${Math.max(10, Math.min(100, (v.profit / (vehicleStats[0].profit || 1)) * 100))}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center gap-4 text-[10px] font-bold text-text-muted uppercase">
                  <span className="flex items-center gap-1"><Fuel className="w-3 h-3" /> ₹{v.fuel.toLocaleString("en-IN")}</span>
                  <span className="flex items-center gap-1"><Wrench className="w-3 h-3" /> ₹{v.maint.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
            {vehicleStats.length === 0 && (
              <div className="py-20 text-center text-text-muted italic text-sm">
                Enter trip and expense records to see vehicle performance here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
