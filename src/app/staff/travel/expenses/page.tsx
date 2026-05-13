"use client";
import { useState } from "react";
import StaffLayout from "@/components/StaffLayout";
import { 
  Fuel, Wrench, IndianRupee, Calendar, 
  CheckCircle, Loader2, Save, X, Plus, 
  History, Bus, Wallet
} from "lucide-react";

const previousExpenses = [
  { id: 1, date: "13 May 2026", vehicle: "MH-12-AB-1234", category: "Fuel", amount: 2500, status: "Locked" },
  { id: 2, date: "12 May 2026", vehicle: "MH-14-CD-5678", category: "Maintenance", amount: 1200, status: "Locked" },
  { id: 3, date: "10 May 2026", vehicle: "MH-12-AB-1234", category: "Salary", amount: 5000, status: "Locked" },
];

export default function VehicleExpensePage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    vehicle: "",
    category: "Fuel",
    amount: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowForm(false);
    }, 2000);
  };

  return (
    <StaffLayout module="travel">
      <div className="p-4 space-y-6">
        
        {/* 1. Previous Expense Records (Shows First) */}
        {!showForm && (
          <div className="animate-fade-in space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                <Wallet className="w-4 h-4 text-travel" /> Expense Records
              </h2>
              <span className="text-[10px] font-bold text-text-muted text-right uppercase">Previous Submissions</span>
            </div>

            <div className="space-y-3">
              {previousExpenses.map((exp) => (
                <div key={exp.id} className="bg-surface p-4 rounded-2xl border border-border flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-text-primary uppercase">{exp.category}</span>
                      <span className="px-2 py-0.5 bg-page text-travel text-[8px] font-black rounded-full border border-travel/10 uppercase">{exp.vehicle}</span>
                    </div>
                    <p className="text-[10px] font-bold text-text-muted">{exp.date} • RK Travel</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-danger font-mono-nums">₹{exp.amount.toLocaleString()}</p>
                    <span className="text-[8px] font-black text-text-muted uppercase tracking-widest bg-page px-1.5 py-0.5 rounded border border-border italic">Verified</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Add New Expense Option (Below/Before Records) */}
            <button 
              onClick={() => setShowForm(true)}
              className="w-full h-16 bg-white text-travel border-2 border-travel/20 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer hover:bg-travel/5"
            >
              <Plus className="w-5 h-5" /> Add New Vehicle Expense Record
            </button>
          </div>
        )}

        {/* 3. Expense Form (Opens only on option click) */}
        {showForm && (
          <div className="animate-slide-up space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                <Fuel className="w-4 h-4 text-travel" /> New Expense Record
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-text-muted hover:text-danger">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-surface p-6 rounded-3xl border border-border shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Staff Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Reporting staff name" 
                    className="w-full h-12 px-4 bg-page border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-travel transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Vehicle Number</label>
                  <select 
                    required 
                    value={form.vehicle}
                    onChange={e => setForm({ ...form, vehicle: e.target.value })}
                    className="w-full h-12 px-4 bg-page border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-travel cursor-pointer"
                  >
                    <option value="">Select vehicle...</option>
                    <option>Tata Winger 1</option>
                    <option>Tata Winger 2</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Date</label>
                    <input 
                      type="date" 
                      required 
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full h-12 px-4 bg-page border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-travel"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Category</label>
                    <select 
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full h-12 px-3 bg-page border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-travel cursor-pointer"
                    >
                      <option>Fuel</option>
                      <option>Maintenance</option>
                      <option>Driver Salary</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Amount (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input 
                      type="number" 
                      required 
                      placeholder="0" 
                      value={form.amount} 
                      onChange={e => setForm({ ...form, amount: e.target.value })} 
                      className="w-full h-12 pl-12 pr-4 bg-page border border-border rounded-xl text-sm font-bold font-mono-nums focus:outline-none focus:border-travel" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    placeholder="Enter details..." 
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full h-24 p-4 bg-page border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-travel resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 bg-travel text-white rounded-2xl font-black shadow-lg shadow-travel/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Submit Expense</>}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Success Overlay */}
        {success && (
          <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center animate-fade-in p-6 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-slide-up">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">Record Saved</h2>
            <p className="text-text-secondary text-sm font-medium mt-2">Expense has been successfully filed.</p>
          </div>
        )}

      </div>
    </StaffLayout>
  );
}
