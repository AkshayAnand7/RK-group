"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import StaffLayout from "@/components/StaffLayout";
import { 
  Calculator, CheckCircle, Loader2, AlertCircle, 
  TrendingUp, TrendingDown, IndianRupee, Save
} from "lucide-react";

import { submitCollection } from "./actions";

export default function LotteryEntryPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    staffName: "",
    collection: "",
    expense: "",
    advance: "",
    prize: "",
    pending: ""
  });
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const col = Number(formData.collection) || 0;
    const exp = Number(formData.expense) || 0;
    const adv = Number(formData.advance) || 0;
    const prz = Number(formData.prize) || 0;
    const pend = Number(formData.pending) || 0;
    setBalance(col - exp - adv - prz - pend);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Using the name from the form and a shop name (e.g. VAKAD)
    const result = await submitCollection(formData, "VAKAD", "001");
    
    setLoading(false);
    if (result.success) {
      setSuccess(true);
    } else {
      alert(result.error);
    }
  };


  if (success) {
    return (
      <StaffLayout module="lottery" shopName="RK Shop 1">
        <div className="p-6 text-center animate-fade-in pt-12">
          <div className="w-20 h-20 rounded-full bg-success-subtle flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Submission Successful!</h2>
          <p className="text-text-secondary mt-2">Daily record has been saved and admin has been notified.</p>
          
          <div className="mt-10 space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Enter Another Record
            </button>
            <Link 
              href="/admin/dashboard"
              className="block w-full py-4 bg-page text-text-secondary border border-border rounded-2xl font-bold hover:bg-slate-100 transition-all text-center"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </StaffLayout>
    );
  }



  return (
    <StaffLayout module="lottery" shopName="RK Shop 1">
      <div className="p-4 space-y-4">
        {/* Date Display */}
        <div className="flex items-center justify-between bg-surface p-4 rounded-2xl border border-border">
          <div>
            <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Entry For</p>
            <p className="text-sm font-bold text-text-primary">Wednesday, 13 May 2026</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Status</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-warning">
              <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" /> OPEN
            </span>
          </div>
        </div>

        {/* Live Balance Card */}
        <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
          balance >= 0 ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Calculated Balance</p>
            {balance >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black font-mono-nums tracking-tight">₹{Math.abs(balance).toLocaleString("en-IN")}</span>
            <span className={`text-xs font-bold uppercase ${balance >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {balance >= 0 ? "Credit" : "Debit"}
            </span>
          </div>
          <p className="text-[10px] text-text-muted mt-2 font-medium">
            Balance = Software Sale - (Expense + Advance + Physical Sale + Pending)
          </p>
        </div>

        {/* Entry Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-surface p-6 rounded-2xl border border-border space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Staff Name</label>
              <input 
                type="text" 
                required 
                value={formData.staffName}
                onChange={e => setFormData({ ...formData, staffName: e.target.value })}
                className="w-full h-12 px-4 bg-page border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Software Sale (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="number" 
                  required 
                  placeholder="0" 
                  value={formData.collection}
                  onChange={e => setFormData({ ...formData, collection: e.target.value })}
                  className="w-full h-14 pl-11 pr-4 bg-page border border-border rounded-xl text-lg font-bold font-mono-nums focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Expenses</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={formData.expense}
                  onChange={e => setFormData({ ...formData, expense: e.target.value })}
                  className="w-full h-12 px-4 bg-page border border-border rounded-xl text-sm font-bold font-mono-nums focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Advances</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={formData.advance}
                  onChange={e => setFormData({ ...formData, advance: e.target.value })}
                  className="w-full h-12 px-4 bg-page border border-border rounded-xl text-sm font-bold font-mono-nums focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Physical Sale</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={formData.prize}
                  onChange={e => setFormData({ ...formData, prize: e.target.value })}
                  className="w-full h-12 px-4 bg-page border border-border rounded-xl text-sm font-bold font-mono-nums focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Pending Amount</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={formData.pending}
                  onChange={e => setFormData({ ...formData, pending: e.target.value })}
                  className="w-full h-12 px-4 bg-page border border-border rounded-xl text-sm font-bold font-mono-nums focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="px-2 py-4 flex items-start gap-3 bg-blue-50/50 rounded-xl border border-blue-100">
            <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
              Please double check all amounts. Once submitted, the daily entry will be locked and can only be edited by the Super Admin.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading || !formData.collection}
            className="w-full h-14 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Submit Daily Entry</>}
          </button>
        </form>
      </div>
    </StaffLayout>
  );
}
