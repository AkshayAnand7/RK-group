"use client";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Calendar, Search, Download, Lock, Unlock, 
  ArrowUp, ArrowDown, Filter, Edit3, Trash2, 
  FileText, Table as TableIcon, CheckCircle, XCircle, Loader2
} from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";
import { toggleCollectionLock, deleteCollection } from "./actions";

export default function CollectionsClient({ initialEntries }: { initialEntries: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const currentSearch = searchParams.get('search') || "";
  const currentPeriod = searchParams.get('period') || "today";

  const handleSearch = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set('search', val);
    else params.delete('search');
    router.push(`?${params.toString()}`);
  };

  const handlePeriod = (p: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('period', p);
    router.push(`?${params.toString()}`);
  };

  const handleExportPDF = () => {
    const headers = [["Date", "Shop", "Collection", "Expense", "Balance", "Staff"]];
    const data = initialEntries.map(e => [
      new Date(e.created_at).toLocaleDateString(), 
      e.shop_name, 
      e.amount, 
      e.expense || 0, 
      e.amount - (e.expense || 0), 
      e.staff_name
    ]);
    exportToPDF("RK Lottery Collections Report", headers, data, "lottery_collections");
  };

  const handleExportExcel = () => {
    const data = initialEntries.map(e => ({
      Date: new Date(e.created_at).toLocaleDateString(),
      Shop: e.shop_name,
      Collection: e.amount,
      Expense: e.expense || 0,
      Advance: e.advance || 0,
      Prize: e.prize || 0,
      Balance: e.amount - (e.expense || 0),
      Staff: e.staff_name,
      Status: e.is_locked ? "Locked" : "Open"
    }));
    exportToExcel(data, "lottery_collections");
  };

  async function handleToggleLock(id: number, currentLock: boolean) {
    startTransition(async () => {
      const result = await toggleCollectionLock(id, !currentLock);
      if (!result.success) alert(result.error);
    });
  }

  async function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this record?")) {
      startTransition(async () => {
        const result = await deleteCollection(id);
        if (!result.success) alert(result.error);
      });
    }
  }

  return (
    <div className={`space-y-6 animate-fade-in ${isPending ? 'opacity-50' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Lottery Entries</h1>
          <p className="text-sm text-text-secondary font-medium">Manage and audit all shop collections in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportPDF} className="btn-primary py-2.5 flex items-center gap-2 text-xs">
            <FileText className="w-4 h-4" /> Export PDF
          </button>
          <button onClick={handleExportExcel} className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 hover:bg-emerald-700 transition-all cursor-pointer">
            <TableIcon className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass p-4 rounded-3xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            defaultValue={currentSearch}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.currentTarget.value)}
            placeholder="Search by shop or staff (Press Enter)..." 
            className="w-full h-12 pl-11 pr-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all" 
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-page border border-border rounded-xl">
          {["today", "weekly", "monthly", "all"].map(p => (
            <button key={p} onClick={() => handlePeriod(p)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                currentPeriod === p ? "bg-primary text-white" : "text-text-muted hover:text-text-primary"
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
              {initialEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-page/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-text-primary">{new Date(entry.created_at).toLocaleDateString()}</p>
                    <p className="text-[10px] font-black text-text-muted">ID: {entry.id.toString().padStart(3, '0')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-lottery-subtle text-lottery text-[10px] font-black rounded-full border border-lottery/10">
                      {entry.shop_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono-nums font-black text-emerald-600">
                    ₹{Number(entry.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5 font-mono-nums text-[10px] font-bold">
                      <p className="text-danger">E: ₹{entry.expense || 0}</p>
                      <p className="text-warning">A: ₹{entry.advance || 0}</p>
                      <p className="text-info">P: ₹{entry.prize || 0}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 font-mono-nums font-black text-sm text-primary">
                      <ArrowUp className="w-3 h-3" />
                      ₹{Number(entry.amount - (entry.expense || 0)).toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-text-secondary">
                    {entry.staff_name}
                  </td>
                  <td className="px-6 py-4">
                    {entry.is_locked ? (
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
                      <button 
                        onClick={() => handleToggleLock(entry.id, entry.is_locked)}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${entry.is_locked ? "bg-page text-text-muted hover:text-primary" : "bg-primary text-white"}`}
                      >
                        {entry.is_locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 bg-page text-text-muted hover:text-danger hover:bg-danger-subtle rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {initialEntries.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-text-muted italic">
                    No records found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
