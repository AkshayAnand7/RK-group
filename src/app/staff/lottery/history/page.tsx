"use client";
import { useState } from "react";
import StaffLayout from "@/components/StaffLayout";
import { 
  History, Calendar, IndianRupee, ChevronRight, 
  Search, Filter, Lock, CheckCircle2, AlertCircle, Loader2
} from "lucide-react";

import { getHistory } from "./actions";
import { useEffect } from "react";

export default function LotteryHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getHistory();
      setHistory(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredHistory = history.filter(item => 
    (item.shop_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.staff_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StaffLayout module="lottery" shopName="Lottery Terminal">
      <div className="p-4 space-y-6">
        
        {/* Header & Search */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
              <History className="w-4 h-4 text-lottery" /> Entry History
            </h2>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-surface border border-border rounded-lg text-text-muted">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search by date or amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-surface border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-lottery transition-all"
            />
          </div>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-lottery animate-spin mx-auto opacity-20" />
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-4">Fetching Records...</p>
            </div>
          ) : filteredHistory.map((item) => (
            <div key={item.id} className="bg-surface p-4 rounded-2xl border border-border active:scale-[0.98] transition-transform group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-page flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-text-muted" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-text-primary uppercase tracking-tight">
                      {new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-[10px] font-bold text-text-muted uppercase">{item.shop_name}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${
                  item.is_locked 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}>
                  {item.is_locked ? <Lock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    {item.is_locked ? "Locked" : "Open"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/50">
                <div>
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Collection</p>
                  <p className="text-sm font-black text-text-primary font-mono-nums">₹{Number(item.amount).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Net Balance</p>
                  <p className="text-sm font-black text-emerald-600 font-mono-nums">₹{(item.amount - (item.expense || 0)).toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between p-2 bg-page rounded-xl">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[8px] font-black text-text-muted uppercase">Exp</p>
                    <p className="text-[10px] font-bold text-red-500 font-mono-nums">₹{item.expense || 0}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-text-muted uppercase">Prize</p>
                    <p className="text-[10px] font-bold text-amber-600 font-mono-nums">₹{item.prize || 0}</p>
                  </div>
                </div>
                <div className="text-[9px] font-bold text-text-muted uppercase italic">
                  By {item.staff_name}
                </div>
              </div>
            </div>
          ))}
          {!loading && filteredHistory.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl">
              <AlertCircle className="w-8 h-8 text-text-muted mx-auto opacity-20" />
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-4">No records found</p>
            </div>
          )}
        </div>

        {/* Empty State / Bottom Info */}
        <div className="py-8 text-center space-y-2">
          <AlertCircle className="w-6 h-6 text-text-muted mx-auto opacity-20" />
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Showing last 30 days of records</p>
          <p className="text-[9px] text-text-muted/60 font-medium px-8 leading-relaxed">
            Locked records cannot be edited by staff. Please contact the administrator for any corrections.
          </p>
        </div>

      </div>
    </StaffLayout>
  );
}
