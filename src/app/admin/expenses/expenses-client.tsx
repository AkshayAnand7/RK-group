"use client";
import { useState, useTransition } from "react";
import { 
  Plus, Search, X, Loader2, CheckCircle, Fuel, Wrench, 
  Users, AlertTriangle, Trash2, Calendar, IndianRupee 
} from "lucide-react";
import { addExpense, deleteExpense } from "./actions";

const categories = [
  { value: "fuel", label: "Fuel Expense", icon: Fuel, color: "text-warning", bg: "bg-warning-subtle" },
  { value: "salary", label: "Driver Salary", icon: Users, color: "text-info", bg: "bg-info-subtle" },
  { value: "maintenance", label: "Vehicle Maintenance", icon: Wrench, color: "text-danger", bg: "bg-danger-subtle" },
  { value: "other", label: "Other Expense", icon: Settings, color: "text-primary", bg: "bg-primary-subtle" },
];

import { Settings } from "lucide-react";

const fuelTypes = ["Diesel", "Petrol"];
const maintenanceTypes = ["Washing", "Service", "Cleaning", "Tire Change", "Oil Change"];

export default function ExpensesClient({ 
  initialExpenses, 
  initialVehicles 
}: { 
  initialExpenses: any[], 
  initialVehicles: any[] 
}) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [catFilter, setCatFilter] = useState("all");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await addExpense(formData);
      if (result.success) {
        setShowForm(false);
        window.location.reload();
      } else {
        alert(result.error);
      }
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this expense record?")) {
      startTransition(async () => {
        const result = await deleteExpense(id);
        if (result.success) {
          window.location.reload();
        } else {
          alert(result.error);
        }
      });
    }
  };

  const getCatInfo = (cat: string) => categories.find(c => c.value === cat);
  
  const filtered = initialExpenses.filter(e => {
    const matchesSearch = (e.detail || '').toLowerCase().includes(search.toLowerCase()) || 
                          (e.vehicle || '').toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter === "all" || e.category === catFilter;
    return matchesSearch && matchesCat;
  });

  const total = filtered.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className={`space-y-6 animate-fade-in ${isPending ? 'opacity-50' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Financial Expenses</h1>
          <p className="text-sm text-text-secondary font-medium">Track fuel, salary, and overhead costs across the group</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add New Expense
        </button>
      </div>

      <div className="glass p-4 rounded-3xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by vehicle, detail, or driver..." 
            className="w-full h-12 pl-11 pr-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all" 
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-page border border-border rounded-xl">
          <button onClick={() => setCatFilter("all")} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${catFilter === "all" ? "bg-primary text-white" : "text-text-muted"}`}>
            All
          </button>
          {categories.map(c => (
            <button key={c.value} onClick={() => setCatFilter(c.value)} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${catFilter === c.value ? "bg-primary text-white" : "text-text-muted"}`}>
              {c.value}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-primary text-white p-6 rounded-4xl shadow-xl shadow-primary/20 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">Total Period Expense</p>
          <p className="text-3xl font-black font-mono-nums">₹{total.toLocaleString("en-IN")}</p>
        </div>
        <IndianRupee className="w-12 h-12 opacity-20" />
      </div>

      <div className="glass rounded-4xl border border-border overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-sm text-left min-w-[800px]">
            <thead>
              <tr className="bg-page/50 border-b border-border">
                {["Date", "Category", "Vehicle / Unit", "Details", "Amount", "Actions"].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(exp => {
                const cat = getCatInfo(exp.category);
                return (
                  <tr key={exp.id} className="hover:bg-page/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-bold text-text-primary">{new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${cat?.bg} ${cat?.color}`}>
                        {cat && <cat.icon className="w-3.5 h-3.5" />} {cat?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-text-primary uppercase tracking-tight whitespace-nowrap">
                      {exp.vehicle || "LOTTERY UNIT"}
                    </td>
                    <td className="px-6 py-4 text-text-secondary font-medium whitespace-nowrap">
                      {exp.detail}
                    </td>
                    <td className="px-6 py-4 font-mono-nums font-black text-red-600 text-lg whitespace-nowrap">
                      ₹{Number(exp.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleDelete(exp.id)}
                        className="p-2 bg-page text-text-muted hover:text-danger hover:bg-danger-subtle rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-md glass p-8 rounded-4xl border-white shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">Add Expense</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-page rounded-xl transition-colors cursor-pointer">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Date</label>
                  <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Module</label>
                  <select name="vehicle" className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all cursor-pointer">
                    <option value="">Lottery (General)</option>
                    {initialVehicles.map(v => (
                      <option key={v.id} value={v.vehicle_number}>{v.vehicle_number}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Category</label>
                <select name="category" required className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all cursor-pointer">
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Detail / Note</label>
                <input name="detail" required placeholder="e.g. Fuel for Mumbai trip" className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Amount (₹)</label>
                <input name="amount" type="number" required placeholder="0" className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-12 bg-page text-text-secondary rounded-2xl font-black text-xs uppercase tracking-widest border border-border hover:bg-slate-100 transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isPending} className="flex-1 h-12 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center">
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
