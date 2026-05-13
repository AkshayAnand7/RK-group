"use client";
import { useState } from "react";
import { Plus, Search, X, Loader2, CheckCircle, Fuel, Wrench, Users, AlertTriangle } from "lucide-react";

const categories = [
  { value: "fuel", label: "Fuel Expense", icon: Fuel, color: "text-warning", bg: "bg-warning-subtle" },
  { value: "salary", label: "Driver Salary", icon: Users, color: "text-info", bg: "bg-info-subtle" },
  { value: "maintenance", label: "Vehicle Maintenance", icon: Wrench, color: "text-danger", bg: "bg-danger-subtle" },
];
const fuelTypes = ["Diesel", "Petrol"];
const maintenanceTypes = ["Washing", "Service", "Cleaning", "Tire Change", "Oil Change"];
const vehicles = ["MH-12-AB-1234", "MH-14-CD-5678", "MH-12-EF-9012", "MH-20-GH-3456"];

const demoExpenses = [
  { id: 1, date: "13 May 2026", vehicle: "MH-12-AB-1234", category: "fuel", detail: "Diesel", amount: 3200, by: "Rajesh Patil" },
  { id: 2, date: "13 May 2026", vehicle: "MH-14-CD-5678", category: "maintenance", detail: "Service", amount: 7500, by: "Sunil More" },
  { id: 3, date: "12 May 2026", vehicle: "MH-12-AB-1234", category: "salary", detail: "Rajesh Patil", amount: 15000, by: "Admin" },
  { id: 4, date: "12 May 2026", vehicle: "MH-12-EF-9012", category: "fuel", detail: "Petrol", amount: 2800, by: "Kiran Shinde" },
  { id: 5, date: "11 May 2026", vehicle: "MH-14-CD-5678", category: "maintenance", detail: "Tire Change", amount: 4500, by: "Sunil More" },
  { id: 6, date: "11 May 2026", vehicle: "MH-12-AB-1234", category: "fuel", detail: "Diesel", amount: 3500, by: "Rajesh Patil" },
];

export default function ExpensesPage() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ date: "", vehicle: "", category: "", detail: "", amount: "" });
  const [catFilter, setCatFilter] = useState("all");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setShowForm(false); setForm({ date: "", vehicle: "", category: "", detail: "", amount: "" }); }, 1500);
  };

  const getCatInfo = (cat: string) => categories.find(c => c.value === cat);
  const filtered = demoExpenses.filter(e => catFilter === "all" || e.category === catFilter);
  const total = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Vehicle Expenses</h1>
          <p className="text-sm text-text-secondary mt-1">Track fuel, salary, and maintenance costs</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-all cursor-pointer active:scale-[0.98]">
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      {/* Alert Banner */}
      <div className="flex items-center gap-3 px-4 py-3 bg-warning-subtle border border-warning/20 rounded-xl text-sm">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
        <div>
          <p className="font-medium text-warning">Fuel Alert: MH-12-AB-1234</p>
          <p className="text-xs text-text-secondary mt-0.5">Daily fuel expense has exceeded ₹3,000 limit for 3 consecutive days</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setCatFilter("all")} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${catFilter === "all" ? "bg-primary text-white" : "bg-surface border border-border text-text-secondary hover:bg-page"}`}>
          All ({demoExpenses.length})
        </button>
        {categories.map(c => (
          <button key={c.value} onClick={() => setCatFilter(c.value)} className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${catFilter === c.value ? "bg-primary text-white" : "bg-surface border border-border text-text-secondary hover:bg-page"}`}>
            <c.icon className="w-3 h-3" /> {c.label} ({demoExpenses.filter(e => e.category === c.value).length})
          </button>
        ))}
      </div>

      {/* Total */}
      <div className="bg-surface rounded-xl border border-border p-4 flex items-center justify-between">
        <span className="text-sm text-text-secondary">Total Expenses ({catFilter === "all" ? "All" : getCatInfo(catFilter)?.label})</span>
        <span className="font-mono-nums text-xl font-bold text-danger">₹{total.toLocaleString("en-IN")}</span>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-page/50 border-b border-border">
                {["Date", "Vehicle", "Category", "Details", "Amount", "Added By"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(exp => {
                const cat = getCatInfo(exp.category);
                return (
                  <tr key={exp.id} className="border-t border-border hover:bg-page/30 transition-colors">
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{exp.date}</td>
                    <td className="px-4 py-3 font-mono-nums text-xs whitespace-nowrap">{exp.vehicle}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cat?.bg} ${cat?.color}`}>
                        {cat && <cat.icon className="w-3 h-3" />} {cat?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{exp.detail}</td>
                    <td className="px-4 py-3 font-mono-nums font-semibold text-danger whitespace-nowrap">₹{exp.amount.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{exp.by}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-xl p-6 animate-fade-in">
            {success ? (
              <div className="py-12 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-success-subtle flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-success" /></div>
                <h3 className="text-lg font-semibold">Expense Recorded!</h3>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Add Vehicle Expense</h2>
                  <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-page transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Date <span className="text-danger">*</span></label>
                      <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full h-11 px-3 bg-page border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Vehicle <span className="text-danger">*</span></label>
                      <select required value={form.vehicle} onChange={e => setForm({ ...form, vehicle: e.target.value })} className="w-full h-11 px-3 bg-page border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer">
                        <option value="">Select...</option>
                        {vehicles.map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Category <span className="text-danger">*</span></label>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map(c => (
                        <button key={c.value} type="button" onClick={() => setForm({ ...form, category: c.value, detail: "" })}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${form.category === c.value ? "border-primary bg-primary-subtle text-primary" : "border-border bg-page text-text-secondary hover:border-primary/30"}`}>
                          <c.icon className="w-5 h-5" />
                          {c.label.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Dynamic Detail Field */}
                  {form.category && (
                    <div className="animate-fade-in">
                      <label className="block text-sm font-medium mb-1.5">
                        {form.category === "fuel" ? "Fuel Type" : form.category === "salary" ? "Driver Name" : "Maintenance Type"} <span className="text-danger">*</span>
                      </label>
                      {form.category === "salary" ? (
                        <input required placeholder="Enter driver name" value={form.detail} onChange={e => setForm({ ...form, detail: e.target.value })} className="w-full h-11 px-3 bg-page border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                      ) : (
                        <select required value={form.detail} onChange={e => setForm({ ...form, detail: e.target.value })} className="w-full h-11 px-3 bg-page border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer">
                          <option value="">Select...</option>
                          {(form.category === "fuel" ? fuelTypes : maintenanceTypes).map(t => <option key={t}>{t}</option>)}
                        </select>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Amount (₹) <span className="text-danger">*</span></label>
                    <input type="number" required min="1" placeholder="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full h-11 px-3 bg-page border border-border rounded-lg text-sm font-mono-nums focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-11 border border-border rounded-lg text-sm font-medium hover:bg-page transition-all cursor-pointer">Cancel</button>
                    <button type="submit" disabled={loading} className="flex-1 h-11 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Submit Expense"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
