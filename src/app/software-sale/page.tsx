"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Monitor, ArrowLeft, Send, History, 
  Plus, Calendar, Store, Calculator, CheckCircle2, Loader2, User, AlertTriangle, X, MessageSquare
} from "lucide-react";
import { submitSoftwareSale, getLastOldAmount } from "./actions";

export default function SoftwareSalePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [whatsappStatus, setWhatsappStatus] = useState<string | null>(null);
  const [lastOldAmount, setLastOldAmount] = useState<any>(null);
  const [showReminder, setShowReminder] = useState(true);

  const [formData, setFormData] = useState({
    date_from: "",
    date_to: "",
    shop_name: "",
    agent_name: "",
    software_sale_1: "",
    whatsapp_count: "",
    whatsapp_cm: "",
    whatsapp_total: 0,
    old_amount: "",
    total: 0,
    win_amount: "",
    paid_amount: "",
    collected_amount: "",
    balance: 0
  });

  // Fetch last old amount on page load
  useEffect(() => {
    async function fetchLastOld() {
      try {
        const data = await getLastOldAmount();
        if (data && data.pending !== 0) {
          setLastOldAmount(data);
        }
      } catch (err) {
        console.error("Error fetching last old amount:", err);
      }
    }
    fetchLastOld();
  }, []);

  // Auto-calculate WhatsApp Total = count * commission
  useEffect(() => {
    const count = parseFloat(formData.whatsapp_count) || 0;
    const cm = parseFloat(formData.whatsapp_cm) || 0;
    const waTotal = count * cm;
    setFormData(prev => ({ ...prev, whatsapp_total: waTotal }));
  }, [formData.whatsapp_count, formData.whatsapp_cm]);

  // Handle main calculations
  useEffect(() => {
    const sw1 = parseFloat(formData.software_sale_1) || 0;
    const waTotal = formData.whatsapp_total || 0;
    const win = parseFloat(formData.win_amount) || 0;
    const old = parseFloat(formData.old_amount) || 0;
    
    const newTotal = sw1 + waTotal;
    const newBalance = newTotal - win - old;

    setFormData(prev => ({
      ...prev,
      total: newTotal,
      balance: newBalance
    }));
  }, [formData.software_sale_1, formData.whatsapp_total, formData.win_amount, formData.old_amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await submitSoftwareSale(formData);
      
      if (result.success) {
        setSuccess(true);
        setWhatsappStatus(result.whatsappError ? 'Data saved but WhatsApp failed' : 'Sent via WhatsApp ✓');
        setTimeout(() => { setSuccess(false); setWhatsappStatus(null); }, 4000);
        
        // Reset form fields but keep dates
        setFormData(prev => ({
          ...prev,
          shop_name: "",
          agent_name: "",
          software_sale_1: "",
          whatsapp_count: "",
          whatsapp_cm: "",
          whatsapp_total: 0,
          old_amount: "",
          win_amount: "",
          paid_amount: "",
          collected_amount: ""
        }));

        // Hide reminder after successful submission
        setShowReminder(false);
      } else {
        alert(result.error || "Error submitting sale. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting sale. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page flex flex-col items-center py-12 px-6">
      <div className="fixed inset-0 -z-10 bg-mesh opacity-20" />

      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-fade-in">
          <div className="flex items-center gap-6">
            <Link href="/" className="p-3 bg-white shadow-lg rounded-2xl hover:scale-110 transition-transform">
              <ArrowLeft className="w-5 h-5 text-text-muted" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Monitor className="w-5 h-5 text-slate-800" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Admin Module</span>
              </div>
              <h1 className="text-4xl font-black text-text-primary uppercase tracking-tight">Software <span className="text-slate-800">Sale</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/software-sale/history" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border rounded-xl font-bold text-xs uppercase tracking-widest text-text-secondary hover:bg-slate-50 transition-colors">
              <History className="w-4 h-4" /> View History
            </Link>
          </div>
        </div>

        {/* Old Amount Reminder Banner */}
        {lastOldAmount && showReminder && (
          <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4 animate-fade-in relative">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">Previous Balance Reminder</p>
              <p className="text-sm font-bold text-amber-700">
                Last submission for <span className="font-black">{lastOldAmount.shop_name}</span> (ending {lastOldAmount.date_to}) had a pending amount of <span className="text-lg font-black text-amber-900">₹{lastOldAmount.pending.toLocaleString("en-IN")}</span>
                <span className="text-xs opacity-70 ml-1">(Balance ₹{lastOldAmount.balance.toLocaleString("en-IN")} - Collected ₹{lastOldAmount.collected_amount.toLocaleString("en-IN")})</span>
              </p>
              <button 
                onClick={() => {
                  setFormData(prev => ({ ...prev, old_amount: lastOldAmount.pending.toString() }));
                  setShowReminder(false);
                }}
                className="mt-2 px-4 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
              >
                Use ₹{lastOldAmount.pending.toLocaleString("en-IN")} as Old Amount
              </button>
            </div>
            <button onClick={() => setShowReminder(false)} className="p-1 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer">
              <X className="w-4 h-4 text-amber-500" />
            </button>
          </div>
        )}

        {/* Form Card */}
        <div className="glass p-8 md:p-12 rounded-4xl border border-white shadow-2xl relative overflow-hidden animate-fade-in">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            
            {/* Date Range Section */}
            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Date From
                </label>
                <input 
                  type="date" 
                  required
                  value={formData.date_from}
                  onChange={e => setFormData({...formData, date_from: e.target.value})}
                  className="w-full h-12 px-4 bg-white border border-border rounded-xl text-sm font-bold focus:border-slate-800 focus:ring-4 focus:ring-slate-800/5 transition-all outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Date To
                </label>
                <input 
                  type="date" 
                  required
                  value={formData.date_to}
                  onChange={e => setFormData({...formData, date_to: e.target.value})}
                  className="w-full h-12 px-4 bg-white border border-border rounded-xl text-sm font-bold focus:border-slate-800 focus:ring-4 focus:ring-slate-800/5 transition-all outline-none" 
                />
              </div>
            </div>

            {/* Shop & Agent Details */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <Store className="w-3.5 h-3.5" /> Shop Name
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter shop name"
                    value={formData.shop_name}
                    onChange={e => setFormData({...formData, shop_name: e.target.value})}
                    className="w-full h-14 px-5 bg-page border border-border rounded-2xl text-sm font-bold focus:border-slate-800 focus:ring-4 focus:ring-slate-800/5 transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Agent Name
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter agent name"
                    value={formData.agent_name}
                    onChange={e => setFormData({...formData, agent_name: e.target.value})}
                    className="w-full h-14 px-5 bg-page border border-border rounded-2xl text-sm font-bold focus:border-slate-800 focus:ring-4 focus:ring-slate-800/5 transition-all outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Software Sale 1</label>
                <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  value={formData.software_sale_1}
                  onChange={e => setFormData({...formData, software_sale_1: e.target.value})}
                  className="w-full h-14 px-5 bg-page border border-border rounded-2xl text-sm font-bold focus:border-slate-800 focus:ring-4 focus:ring-slate-800/5 transition-all outline-none" 
                />
              </div>

              {/* WhatsApp Sale Section */}
              <div className="p-5 bg-green-50 rounded-2xl border border-green-100 space-y-3">
                <label className="text-[10px] font-black text-green-700 uppercase tracking-widest">WhatsApp Sale</label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-green-600 uppercase tracking-widest">Count</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      value={formData.whatsapp_count}
                      onChange={e => setFormData({...formData, whatsapp_count: e.target.value})}
                      className="w-full h-12 px-3 bg-white border border-green-200 rounded-xl text-sm font-bold focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-green-600 uppercase tracking-widest">Commission (CM)</label>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      min="1"
                      max="10"
                      value={formData.whatsapp_cm}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        if (val > 10) return;
                        setFormData({...formData, whatsapp_cm: e.target.value});
                      }}
                      className="w-full h-12 px-3 bg-white border border-green-200 rounded-xl text-sm font-bold focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-green-600 uppercase tracking-widest">Total</label>
                    <div className="w-full h-12 px-3 bg-green-100 border border-green-200 rounded-xl text-sm font-black text-green-800 flex items-center">
                      ₹ {formData.whatsapp_total.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Old Amount</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={formData.old_amount}
                  onChange={e => setFormData({...formData, old_amount: e.target.value})}
                  className="w-full h-14 px-5 bg-page border border-border rounded-2xl text-sm font-bold focus:border-slate-800 focus:ring-4 focus:ring-slate-800/5 transition-all outline-none" 
                />
              </div>
            </div>

            {/* Calculations & Summary */}
            <div className="space-y-6">
              <div className="p-6 bg-slate-800 rounded-3xl text-white space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Calculated Total</span>
                  <Calculator className="w-4 h-4 opacity-40" />
                </div>
                <div className="text-4xl font-black">₹ {formData.total.toLocaleString()}</div>
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Software Sale 1 + WhatsApp Total</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Win Amount</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={formData.win_amount}
                    onChange={e => setFormData({...formData, win_amount: e.target.value})}
                    className="w-full h-14 px-5 bg-page border border-border rounded-2xl text-sm font-bold focus:border-slate-800 focus:ring-4 focus:ring-slate-800/5 transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Paid Amount</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={formData.paid_amount}
                    onChange={e => setFormData({...formData, paid_amount: e.target.value})}
                    className="w-full h-14 px-5 bg-page border border-border rounded-2xl text-sm font-bold focus:border-slate-800 focus:ring-4 focus:ring-slate-800/5 transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Collected</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={formData.collected_amount}
                    onChange={e => setFormData({...formData, collected_amount: e.target.value})}
                    className="w-full h-14 px-5 bg-page border border-border rounded-2xl text-sm font-bold focus:border-slate-800 focus:ring-4 focus:ring-slate-800/5 transition-all outline-none" 
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-100 rounded-3xl space-y-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Net Balance</span>
                  <div className="px-2 py-0.5 bg-slate-200 rounded text-[8px] font-black uppercase text-slate-600 tracking-tighter">Auto</div>
                </div>
                <div className="text-4xl font-black text-slate-800">₹ {formData.balance.toLocaleString()}</div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total - Win - Old</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="col-span-full pt-6 flex flex-col md:flex-row items-center gap-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full md:flex-1 h-16 bg-slate-800 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-800/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? <><Loader2 className="w-6 h-6 animate-spin" /> Submitting...</> : <><Send className="w-5 h-5" /> Submit & Send Report</>}
              </button>
              
              <button 
                type="button"
                onClick={() => setFormData({
                  date_from: "", date_to: "", shop_name: "", agent_name: "",
                  software_sale_1: "", whatsapp_count: "", whatsapp_cm: "",
                  whatsapp_total: 0, old_amount: "", total: 0, win_amount: "", 
                  paid_amount: "", collected_amount: "", balance: 0
                })}
                className="w-full md:w-auto h-16 px-8 bg-white border border-border rounded-2xl font-black text-xs uppercase tracking-widest text-text-muted hover:bg-slate-50 transition-colors"
              >
                Reset Form
              </button>
            </div>
          </form>

          {/* Success Overlay */}
          {success && (
            <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight mb-2">Sale Recorded!</h3>
              <div className="flex items-center gap-2 text-text-secondary font-medium">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <p>{whatsappStatus || 'WhatsApp report sent'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">RK Group Software Portal</p>
        </div>
      </div>
    </div>
  );
}
