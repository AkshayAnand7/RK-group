"use client";
import { useState } from "react";
import StaffLayout from "@/components/StaffLayout";
import { 
  Bus, MapPin, ArrowRight, IndianRupee, 
  Calendar, CheckCircle, Loader2, Save, X,
  FileText, Plus, ChevronRight, History
} from "lucide-react";

const previousTrips = [
  { id: 1, date: "13 May 2026", route: "Mumbai - Pune", vehicle: "MH-12-AB-1234", amount: 8500, status: "Locked" },
  { id: 2, date: "12 May 2026", route: "Pune - Nashik", vehicle: "MH-14-CD-5678", amount: 4200, status: "Locked" },
  { id: 3, date: "11 May 2026", route: "Mumbai - Goa", vehicle: "MH-12-EF-9012", amount: 15000, status: "Locked" },
];

export default function TravelTripPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    driver: "Rajesh Patil",
    vehicle: "",
    from: "",
    to: "",
    type: "One Side",
    amount: "",
    received: ""
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
        
        {/* 1. Previous Reports (Shows First) */}
        {!showForm && (
          <div className="animate-fade-in space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                <History className="w-4 h-4 text-travel" /> Previous Trips
              </h2>
              <span className="text-[10px] font-bold text-text-muted">Last 3 entries</span>
            </div>

            <div className="space-y-3">
              {previousTrips.map((trip) => (
                <div key={trip.id} className="bg-surface p-4 rounded-2xl border border-border flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black text-text-primary uppercase">{trip.route}</span>
                      <span className="px-2 py-0.5 bg-page text-travel text-[8px] font-black rounded-full border border-travel/10 uppercase">{trip.vehicle}</span>
                    </div>
                    <p className="text-[10px] font-bold text-text-muted">{trip.date} • RK Travel</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-600 font-mono-nums">₹{trip.amount.toLocaleString()}</p>
                    <span className="text-[8px] font-black text-text-muted uppercase tracking-widest bg-page px-1.5 py-0.5 rounded border border-border italic">Locked</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Add New Trip Option (Below Reports) */}
            <button 
              onClick={() => setShowForm(true)}
              className="w-full h-16 bg-travel text-white rounded-2xl font-black text-sm shadow-xl shadow-travel/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-5 h-5" /> Add New Trip Details
            </button>
          </div>
        )}

        {/* 3. New Trip Form (Opens only on option click) */}
        {showForm && (
          <div className="animate-slide-up space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                <Bus className="w-4 h-4 text-travel" /> New Trip Details
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
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Type</label>
                    <select 
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full h-12 px-3 bg-page border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-travel cursor-pointer"
                    >
                      <option>One Side</option>
                      <option>Round Trip</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Driver Name</label>
                  <input 
                    required 
                    placeholder="Enter driver name" 
                    value={form.driver}
                    onChange={e => setForm({ ...form, driver: e.target.value })}
                    className="w-full h-12 px-4 bg-page border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-travel" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Vehicle</label>
                  <select 
                    required 
                    value={form.vehicle}
                    onChange={e => setForm({ ...form, vehicle: e.target.value })}
                    className="w-full h-12 px-3 bg-page border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-travel cursor-pointer"
                  >
                    <option value="">Select vehicle...</option>
                    <option>Tata Winger 1</option>
                    <option>Tata Winger 2</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Route</label>
                  <div className="flex items-center gap-2">
                    <input required placeholder="From" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} className="flex-1 h-12 px-4 bg-page border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-travel" />
                    <ArrowRight className="w-4 h-4 text-text-muted" />
                    <input required placeholder="To" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} className="flex-1 h-12 px-4 bg-page border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-travel" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Total (₹)</label>
                    <input type="number" required placeholder="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full h-12 px-4 bg-page border border-border rounded-xl text-sm font-bold font-mono-nums focus:outline-none focus:border-travel" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Received (₹)</label>
                    <input type="number" required placeholder="0" value={form.received} onChange={e => setForm({ ...form, received: e.target.value })} className="w-full h-12 px-4 bg-page border border-border rounded-xl text-sm font-bold font-mono-nums focus:outline-none focus:border-travel" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 bg-travel text-white rounded-2xl font-black shadow-lg shadow-travel/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Submit Trip Report</>}
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
            <p className="text-text-secondary text-sm font-medium mt-2">The trip has been securely locked.</p>
          </div>
        )}

      </div>
    </StaffLayout>
  );
}
