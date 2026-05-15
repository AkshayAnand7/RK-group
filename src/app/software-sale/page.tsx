"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Monitor, ArrowLeft, Send, History, 
  Plus, Calendar, Store, Calculator, CheckCircle2, Loader2
} from "lucide-react";
import { submitSoftwareSale } from "./actions";

export default function SoftwareSalePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    date_from: "",
    date_to: "",
    shop_name: "",
    rapido_sale: "",
    whatsapp_sale: "",
    old_amount: "",
    total: 0,
    win_amount: "",
    paid_amount: "",
    balance: 0
  });

  // Handle calculations
  useEffect(() => {
    const rapido = parseFloat(formData.rapido_sale) || 0;
    const whatsapp = parseFloat(formData.whatsapp_sale) || 0;
    const win = parseFloat(formData.win_amount) || 0;
    
    const newTotal = rapido + whatsapp;
    const newBalance = newTotal - win;

    setFormData(prev => ({
      ...prev,
      total: newTotal,
      balance: newBalance
    }));
  }, [formData.rapido_sale, formData.whatsapp_sale, formData.win_amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await submitSoftwareSale(formData);
      
      if (result.success) {
        // Send to WhatsApp
        const message = `*SOFTWARE SALE REPORT*%0A` +
          `---------------------------%0A` +
          `📅 *Date:* ${formData.date_from} to ${formData.date_to}%0A` +
          `🏪 *Shop:* ${formData.shop_name}%0A` +
          `---------------------------%0A` +
          `🔹 *Rapido Sale:* ${formData.rapido_sale}%0A` +
          `🔹 *WhatsApp Sale:* ${formData.whatsapp_sale}%0A` +
          `🔸 *Old Amount:* ${formData.old_amount}%0A` +
          `---------------------------%0A` +
          `💰 *TOTAL:* ${formData.total}%0A` +
          `🏆 *Win Amount:* ${formData.win_amount}%0A` +
          `💵 *Paid Amount:* ${formData.paid_amount}%0A` +
          `📉 *BALANCE:* ${formData.balance}%0A` +
          `---------------------------%0A` +
          `✅ *Submitted by Admin*`;

        const whatsappUrl = `https://wa.me/919847113888?text=${message}`; // Placeholder phone number
        window.open(whatsappUrl, '_blank');
        
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        
        // Reset form except dates if needed, or keep for next entry
        setFormData(prev => ({
          ...prev,
          shop_name: "",
          rapido_sale: "",
          whatsapp_sale: "",
          old_amount: "",
          win_amount: "",
          paid_amount: ""
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page flex flex-col items-center py-12 px-6">
      <div className="fixed inset-0 -z-10 bg-mesh opacity-20" />

      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-fade-in">
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
            <div className="h-10 w-[1px] bg-border mx-2 hidden md:block" />
            <p className="text-[10px] font-black text-success uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" /> Live Portal
            </p>
          </div>
        </div>

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

            {/* Shop Details */}
            <div className="space-y-6">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Rapido Sale</label>
                  <input 
                    type="number" 
                    required
                    placeholder="0.00"
                    value={formData.rapido_sale}
                    onChange={e => setFormData({...formData, rapido_sale: e.target.value})}
                    className="w-full h-14 px-5 bg-page border border-border rounded-2xl text-sm font-bold focus:border-slate-800 focus:ring-4 focus:ring-slate-800/5 transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">WhatsApp Sale</label>
                  <input 
                    type="number" 
                    required
                    placeholder="0.00"
                    value={formData.whatsapp_sale}
                    onChange={e => setFormData({...formData, whatsapp_sale: e.target.value})}
                    className="w-full h-14 px-5 bg-page border border-border rounded-2xl text-sm font-bold focus:border-slate-800 focus:ring-4 focus:ring-slate-800/5 transition-all outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Old Amount</label>
                <input 
                  type="number" 
                  required
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
                <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Rapido + WhatsApp</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Win Amount</label>
                  <input 
                    type="number" 
                    required
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
                    required
                    placeholder="0.00"
                    value={formData.paid_amount}
                    onChange={e => setFormData({...formData, paid_amount: e.target.value})}
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
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total - Win</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="col-span-full pt-6 flex flex-col md:flex-row items-center gap-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full md:flex-1 h-16 bg-slate-800 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-800/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5" /> Submit & Send to WhatsApp</>}
              </button>
              
              <button 
                type="button"
                onClick={() => setFormData({
                  date_from: "", date_to: "", shop_name: "", rapido_sale: "", 
                  whatsapp_sale: "", old_amount: "", total: 0, win_amount: "", 
                  paid_amount: "", balance: 0
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
              <p className="text-text-secondary font-medium">Redirecting to WhatsApp...</p>
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
