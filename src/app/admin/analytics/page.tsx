"use client";
import { useState } from "react";
import { 
  Bus, Fuel, Wrench, TrendingUp, TrendingDown, 
  BarChart3, PieChart as PieIcon, ArrowRight, 
  AlertCircle, ChevronRight, Filter, Download
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from "recharts";

const expenseTrends = [
  { month: "Jan", fuel: 45000, maint: 12000 },
  { month: "Feb", fuel: 42000, maint: 15000 },
  { month: "Mar", fuel: 48000, maint: 8000 },
  { month: "Apr", fuel: 51000, maint: 22000 },
  { month: "May", fuel: 47000, maint: 18000 },
];

const vehicleStats = [
  { id: "MH-12-AB-1234", profit: 45000, fuel: 12000, maint: 5000 },
  { id: "MH-14-CD-5678", profit: 32000, fuel: 15000, maint: 8000 },
  { id: "MH-12-EF-9012", profit: 28000, fuel: 11000, maint: 3000 },
  { id: "MH-20-GH-3456", profit: -5000, fuel: 18000, maint: 12000 },
];

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

export default function VehicleAnalyticsPage() {
  const [period, setPeriod] = useState("month");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Vehicle Analytics</h1>
          <p className="text-sm text-text-secondary font-medium">Deep insights into fleet performance and operational costs</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-border rounded-xl text-xs font-bold text-text-primary hover:bg-page transition-all flex items-center gap-2">
            <Download className="w-4 h-4 text-text-muted" /> Export Analysis
          </button>
        </div>
      </div>

      {/* Top Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-4xl border-l-4 border-l-travel">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-travel/10 flex items-center justify-center">
              <Fuel className="w-5 h-5 text-travel" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">Total Fuel Expense</h3>
          </div>
          <p className="text-3xl font-black text-text-primary font-mono-nums">₹2.4L</p>
          <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-danger">
            <TrendingUp className="w-3 h-3" /> +5.2% from last month
          </div>
        </div>

        <div className="glass p-6 rounded-4xl border-l-4 border-l-warning">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-warning/10 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-warning" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">Maintenance Costs</h3>
          </div>
          <p className="text-3xl font-black text-text-primary font-mono-nums">₹85.2k</p>
          <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
            <TrendingDown className="w-3 h-3" /> -2.4% from last month
          </div>
        </div>

        <div className="glass p-6 rounded-4xl border-l-4 border-l-primary">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">Avg. Profit / Vehicle</h3>
          </div>
          <p className="text-3xl font-black text-text-primary font-mono-nums">₹32.5k</p>
          <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-text-muted">
            Across 8 active vehicles
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Trends */}
        <div className="glass p-8 rounded-4xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Expense Trends</h3>
              <p className="text-[10px] font-bold text-text-muted mt-1 uppercase">Fuel vs Maintenance</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-travel" /> <span className="text-[10px] font-bold text-text-muted uppercase">Fuel</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warning" /> <span className="text-[10px] font-bold text-text-muted uppercase">Maint</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={expenseTrends}>
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
        <div className="glass p-8 rounded-4xl">
          <div className="mb-10">
            <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Profit per Vehicle</h3>
            <p className="text-[10px] font-bold text-text-muted mt-1 uppercase">Monthly Performance breakdown</p>
          </div>
          <div className="space-y-4">
            {vehicleStats.map((v, i) => (
              <div key={v.id} className="p-4 bg-page/50 rounded-2xl border border-border/50 group hover:bg-white hover:shadow-lg hover:border-transparent transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-travel/10 flex items-center justify-center text-travel font-black text-[10px]">
                      {v.id.split('-').pop()}
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
                    style={{ width: `${Math.max(10, Math.min(100, (v.profit / 50000) * 100))}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center gap-4 text-[10px] font-bold text-text-muted uppercase">
                  <span>Fuel: ₹{v.fuel.toLocaleString("en-IN")}</span>
                  <span>Maint: ₹{v.maint.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
