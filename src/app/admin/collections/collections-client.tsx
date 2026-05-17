"use client";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Calendar, Search, Download, Lock, Unlock, 
  ArrowUp, ArrowDown, Filter, Edit3, Trash2, 
  FileText, Table as TableIcon, CheckCircle, XCircle, Loader2, Store, X, Ticket
} from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";
import { toggleCollectionLock, updateCollection, deleteCollection } from "./actions";

export default function CollectionsClient({ initialEntries, initialShops = [] }: { initialEntries: any[], initialShops?: any[] }) {
  // Initialize with all shops
  const shopTotals: Record<string, { collection: number; expense: number; entries: number; shop_id: string }> = 
    initialShops.reduce((acc, shop) => {
      acc[shop.name] = { collection: 0, expense: 0, entries: 0, shop_id: shop.shop_id };
      return acc;
    }, {});

  // Compute shop-wise totals from entries
  initialEntries.forEach((entry) => {
    const shop = entry.shop_name || 'Unknown';
    if (!shopTotals[shop]) shopTotals[shop] = { collection: 0, expense: 0, entries: 0, shop_id: 'N/A' };
    shopTotals[shop].collection += Number(entry.amount) || 0;
    shopTotals[shop].expense += Number(entry.expense) || 0;
    shopTotals[shop].entries += 1;
  });
  
  const shopList = Object.entries(shopTotals).sort((a, b) => {
    // Sort by collection descending, then alphabetically
    if (b[1].collection !== a[1].collection) {
      return b[1].collection - a[1].collection;
    }
    return a[0].localeCompare(b[0]);
  });
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [editingEntry, setEditingEntry] = useState<any>(null);
  
  // State for the Shop History Modal
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  
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

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      const result = await updateCollection(editingEntry.id, formData);
      if (result.success) {
        setEditingEntry(null);
      } else {
        alert(result.error);
      }
    });
  };

  async function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this record?")) {
      startTransition(async () => {
        const result = await deleteCollection(id);
        if (!result.success) alert(result.error);
      });
    }
  }

  // Entries for the currently selected shop in the modal
  const selectedShopEntries = selectedShop ? initialEntries.filter(e => (e.shop_name || 'Unknown') === selectedShop) : [];

  return (
    <div className={`space-y-6 animate-fade-in ${isPending ? 'opacity-50' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Lottery Collections</h1>
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

      {/* Grid of Shops (Replicating the Shop Management UI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {shopList.map(([shop, totals]: [string, any]) => (
          <div key={shop} className="glass p-8 rounded-4xl border border-border group hover:bg-white hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all" />
            
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30 group-hover:rotate-6 transition-transform">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Shop ID</p>
                <p className="text-xl font-black text-text-primary font-mono-nums">{totals.shop_id !== 'N/A' ? totals.shop_id : '-'}</p>
                <p className="text-[10px] font-bold text-emerald-500 mt-1">{totals.entries} Entries</p>
              </div>
            </div>

            <div className="mb-6 flex-grow relative z-10">
              <h3 className="text-2xl font-black text-text-primary tracking-tight mb-4 uppercase">{shop}</h3>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Total Collection</span>
                  <span className="text-sm font-bold text-text-primary font-mono-nums">₹{totals.collection.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Total Expense</span>
                  <span className="text-sm font-bold text-danger font-mono-nums">₹{totals.expense.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Net Balance</span>
                  <span className="text-2xl font-black text-emerald-600 font-mono-nums">₹{(totals.collection - totals.expense).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border/50 relative z-10 mt-auto">
              <button 
                onClick={() => setSelectedShop(shop)}
                className="w-full h-11 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" /> View History
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {shopList.length === 0 && (
        <div className="py-20 text-center text-text-muted italic glass rounded-4xl border border-border">
          No records found for this period.
        </div>
      )}

      {/* History Modal */}
      {selectedShop && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedShop(null)} />
          <div className="relative w-full max-w-6xl max-h-[90vh] glass rounded-4xl border border-white shadow-2xl flex flex-col animate-fade-in overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-border/50 bg-page/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">{selectedShop}</h2>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Collection History</p>
                </div>
              </div>
              <button onClick={() => setSelectedShop(null)} className="p-2 bg-white hover:bg-slate-100 text-slate-500 rounded-xl shadow-sm transition-all cursor-pointer border border-border">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Table Content */}
            <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar flex-1 bg-page/30">
              <div className="glass rounded-3xl border border-border overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                  <table className="w-full text-sm text-left min-w-[900px]">
                    <thead>
                      <tr className="bg-page/50 border-b border-border">
                        {["Date", "Collection", "Exp/Adv/Prize", "Net Balance", "Staff", "Status", "Actions"].map(h => (
                          <th key={h} className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedShopEntries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-white/50 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-bold text-text-primary">{new Date(entry.created_at).toLocaleDateString()}</p>
                            <p className="text-[10px] font-black text-text-muted">ID: {entry.id.toString().padStart(3, '0')}</p>
                          </td>
                          <td className="px-6 py-4 font-mono-nums font-black text-text-primary whitespace-nowrap text-lg">
                            ₹{Number(entry.amount).toLocaleString("en-IN")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-0.5 font-mono-nums text-[10px] font-bold">
                              <p className="text-danger">E: ₹{entry.expense || 0}</p>
                              <p className="text-warning">A: ₹{entry.advance || 0}</p>
                              <p className="text-info">P: ₹{entry.prize || 0}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5 font-mono-nums font-black text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                              <ArrowUp className="w-3 h-3" />
                              ₹{Number(entry.amount - (entry.expense || 0)).toLocaleString("en-IN")}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-text-secondary whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary font-black">
                                {(entry.staff_name || 'U')[0]}
                              </div>
                              {entry.staff_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {entry.is_locked ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase shadow-sm">
                                <Lock className="w-3 h-3" /> Locked
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-warning-subtle text-warning rounded-full text-[10px] font-black uppercase shadow-sm">
                                <Unlock className="w-3 h-3" /> Open
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => handleToggleLock(entry.id, entry.is_locked)}
                                className={`p-2 rounded-xl transition-all cursor-pointer shadow-sm ${entry.is_locked ? "bg-white border border-border text-text-muted hover:text-primary" : "bg-primary text-white shadow-primary/20"}`}
                              >
                                {entry.is_locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                              </button>
                              <button 
                                onClick={() => setEditingEntry(entry)}
                                className="p-2 bg-white border border-border text-text-muted hover:text-primary hover:bg-primary-subtle rounded-xl transition-all cursor-pointer shadow-sm"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(entry.id)}
                                className="p-2 bg-white border border-border text-text-muted hover:text-danger hover:bg-danger-subtle rounded-xl transition-all cursor-pointer shadow-sm"
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
          </div>
        </div>
      )}

      {/* Edit Modal (Overlays everything if editing) */}
      {editingEntry && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setEditingEntry(null)} />
          <div className="relative w-full max-w-md glass p-8 rounded-4xl border-white shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">Edit Collection</h2>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">{editingEntry.shop_name} • {new Date(editingEntry.created_at).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setEditingEntry(null)} className="p-2 bg-white border border-border hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                <XCircle className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Total Collection (₹)</label>
                <input name="amount" type="number" required defaultValue={editingEntry.amount} className="w-full h-12 px-4 bg-white border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 text-[8px]">Expense</label>
                  <input name="expense" type="number" defaultValue={editingEntry.expense} className="w-full h-12 px-3 bg-white border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 text-[8px]">Advance</label>
                  <input name="advance" type="number" defaultValue={editingEntry.advance} className="w-full h-12 px-3 bg-white border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 text-[8px]">Prize</label>
                  <input name="prize" type="number" defaultValue={editingEntry.prize} className="w-full h-12 px-3 bg-white border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setEditingEntry(null)} className="flex-1 h-12 bg-white text-text-secondary rounded-2xl font-black text-xs uppercase tracking-widest border border-border hover:bg-slate-50 shadow-sm transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isPending} className="flex-1 h-12 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center">
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
