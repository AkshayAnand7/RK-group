'use client'

import { useState } from "react";
import {
  Plus, Search, Edit3, Trash2,
  X, Loader2, Car, Hash, Tag, Power
} from "lucide-react";
import { addVehicle, updateVehicle, deleteVehicle } from "./actions";

const statusColors: Record<string, string> = {
  active: "text-emerald-600 bg-emerald-50 border-emerald-200",
  inactive: "text-red-500 bg-red-50 border-red-200",
  maintenance: "text-amber-600 bg-amber-50 border-amber-200",
};

export default function VehiclesClient({ initialVehicles }: { initialVehicles: any[] }) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const filteredVehicles = vehicles.filter(v =>
    v.vehicle_number.toLowerCase().includes(search.toLowerCase()) ||
    (v.model || '').toLowerCase().includes(search.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = editingVehicle
      ? await updateVehicle(editingVehicle.id, formData)
      : await addVehicle(formData);

    if (result.success) {
      setShowForm(false);
      setEditingVehicle(null);
      window.location.reload();
    } else {
      alert(result.error);
    }
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      const result = await deleteVehicle(id);
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error);
      }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 scroll-reveal">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary uppercase tracking-tight">Vehicle Fleet</h1>
          <p className="text-xs sm:text-sm text-text-secondary font-medium">Add, edit and manage all registered vehicles</p>
        </div>
        <button
          onClick={() => { setEditingVehicle(null); setShowForm(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Vehicle
        </button>
      </div>

      {/* Search */}
      <div className="glass p-3 sm:p-4 rounded-2xl sm:rounded-3xl flex items-center gap-4 scroll-reveal">
        <Search className="w-5 h-5 text-text-muted ml-2" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by number or model..."
          className="flex-1 bg-transparent border-none outline-none font-bold text-text-primary placeholder:text-text-muted"
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 scroll-reveal">
        {[
          { label: "Total", value: vehicles.length, color: "text-primary" },
          { label: "Active", value: vehicles.filter(v => v.status === 'active').length, color: "text-emerald-600" },
          { label: "Inactive", value: vehicles.filter(v => v.status !== 'active').length, color: "text-red-500" },
        ].map(s => (
          <div key={s.label} className="glass p-4 sm:p-5 rounded-2xl text-center">
            <p className="text-2xl sm:text-3xl font-black font-mono-nums">{s.value}</p>
            <p className={`text-[10px] font-black uppercase tracking-widest ${s.color}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 scroll-stagger">
        {filteredVehicles.map(vehicle => (
          <div key={vehicle.id} className="glass p-5 sm:p-8 rounded-3xl sm:rounded-4xl border border-border group hover:bg-white hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-travel/5 blur-3xl -mr-16 -mt-16 group-hover:bg-travel/10 transition-all" />

            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-travel rounded-2xl flex items-center justify-center shadow-xl shadow-travel/30 group-hover:rotate-6 transition-transform">
                <Car className="w-8 h-8 text-white" />
              </div>
              <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${statusColors[vehicle.status] || statusColors.active}`}>
                {vehicle.status || 'active'}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight mb-2 uppercase">{vehicle.model || 'Unknown'}</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                <Hash className="w-3.5 h-3.5 text-text-muted" /> {vehicle.vehicle_number}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-6 border-t border-border/50">
              <button
                onClick={() => { setEditingVehicle(vehicle); setShowForm(true); }}
                className="flex-1 h-11 bg-page hover:bg-primary-subtle text-text-muted hover:text-primary rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(vehicle.id)}
                className="w-11 h-11 bg-page hover:bg-danger-subtle text-text-muted hover:text-red-500 rounded-xl flex items-center justify-center transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="glass p-12 rounded-3xl text-center">
          <Car className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-lg font-black text-text-primary uppercase">No Vehicles Found</p>
          <p className="text-sm text-text-secondary font-medium mt-1">Add your first vehicle to get started</p>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-transparent" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-md glass p-5 sm:p-8 rounded-3xl sm:rounded-4xl border-white shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-page rounded-xl transition-colors cursor-pointer">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Vehicle Number</label>
                <input name="vehicle_number" defaultValue={editingVehicle?.vehicle_number} required placeholder="e.g. FORTUNER-01" className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all uppercase" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Model Name</label>
                <input name="model" defaultValue={editingVehicle?.model} required placeholder="e.g. Fortuner" className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" />
              </div>
              {editingVehicle && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Status</label>
                  <select name="status" defaultValue={editingVehicle?.status || 'active'} className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all cursor-pointer">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              )}
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-12 bg-page text-text-secondary rounded-2xl font-black text-xs uppercase tracking-widest border border-border hover:bg-slate-100 transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 h-12 bg-travel text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-travel/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingVehicle ? "Update Vehicle" : "Add Vehicle")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
