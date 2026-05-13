"use client";
import { useState } from "react";
import { 
  Calendar, Search, Download, Lock, Unlock, 
  ArrowUp, ArrowDown, Filter, Edit3, Trash2, 
  FileText, Table as TableIcon, CheckCircle, XCircle
} from "lucide-react";

const demoEntries = [
  { id: 1, date: "13 May 2026", shop: "VAKAD", collection: 45000, expense: 3200, advance: 2000, prize: 5000, balance: 34800, staff: "Staff-01", locked: true },
  { id: 2, date: "13 May 2026", shop: "CHENNARA", collection: 32000, expense: 1800, advance: 1000, prize: 0, balance: 29200, staff: "Staff-02", locked: true },
  { id: 3, date: "13 May 2026", shop: "PC PADI TIRUR", collection: 28000, expense: 2500, advance: 3000, prize: 10000, balance: 12500, staff: "Staff-03", locked: false },
  { id: 4, date: "12 May 2026", shop: "ALISHERY", collection: 38000, expense: 2800, advance: 1500, prize: 0, balance: 33700, staff: "Staff-04", locked: true },
  { id: 5, date: "12 May 2026", shop: "KOOTTU MOOCHI", collection: 22000, expense: 1200, advance: 500, prize: 3000, balance: 17300, staff: "Staff-05", locked: true },
  { id: 6, date: "11 May 2026", shop: "PACHATTRI", collection: 35000, expense: 4000, advance: 2000, prize: 0, balance: 29000, staff: "Staff-06", locked: true },
];

export default function LotteryEntriesPage() {
  const [entries, setEntries] = useState(demoEntries);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("today");

  const toggleLock = (id: number) => {
    setEntries(entries.map(e => e.id === id ? { ...e, locked: !e.locked } : e));
  };

  const deleteEntry = (id: number) => {
    if (confirm("Are you sure you want to delete this record? This action cannot be undone.")) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Lottery Entries</h1>
          <p className="text-sm text-text-secondary font-medium">Manage and audit all shop collections</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-primary py-2.5 flex items-center gap-2 text-xs">
            <FileText className="w-4 h-4" /> Export PDF
          </button>
          <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 hover:bg-emerald-700 transition-all cursor-pointer">
            <TableIcon className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass p-4 rounded-3xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by shop, ID, or staff..." 
            className="w-full h-12 pl-11 pr-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all" 
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-page border border-border rounded-xl">
          {["today", "weekly", "monthly", "custom"].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                period === p ? "bg-primary text-white" : "text-text-muted hover:text-text-primary"
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="glass rounded-4xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-page/50 border-b border-border">
                {["Date", "Shop Name", "Collection", "Exp/Adv/Prize", "Net Balance", "Staff", "Status", "Actions"].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entries.map((entry, i) => (
                <tr key={entry.id} className="hover:bg-page/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-text-primary">{entry.date}</p>
                    <p className="text-[10px] font-black text-text-muted">ID: {entry.id.toString().padStart(3, '0')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-lottery-subtle text-lottery text-[10px] font-black rounded-full border border-lottery/10">
                      {entry.shop}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono-nums font-black text-emerald-600">
                    ₹{entry.collection.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5 font-mono-nums text-[10px] font-bold">
                      <p className="text-danger">E: ₹{entry.expense}</p>
                      <p className="text-warning">A: ₹{entry.advance}</p>
                      <p className="text-info">P: ₹{entry.prize}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 font-mono-nums font-black text-sm ${entry.balance >= 0 ? "text-primary" : "text-danger"}`}>
                      {entry.balance >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      ₹{Math.abs(entry.balance).toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-text-secondary">
                    {entry.staff}
                  </td>
                  <td className="px-6 py-4">
                    {entry.locked ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase">
                        <Lock className="w-3 h-3" /> Locked
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-warning-subtle text-warning rounded-full text-[10px] font-black uppercase">
                        <Unlock className="w-3 h-3" /> Open
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* Admin Exclusive Controls */}
                      <button 
                        onClick={() => toggleLock(entry.id)}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${entry.locked ? "bg-page text-text-muted hover:text-primary" : "bg-primary text-white"}`}
                        title={entry.locked ? "Unlock Record" : "Lock Record"}
                      >
                        {entry.locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>
                      <button className="p-2 bg-page text-text-muted hover:text-primary hover:bg-primary-subtle rounded-xl transition-all cursor-pointer" title="Edit Entry">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteEntry(entry.id)}
                        className="p-2 bg-page text-text-muted hover:text-danger hover:bg-danger-subtle rounded-xl transition-all cursor-pointer" 
                        title="Delete Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
