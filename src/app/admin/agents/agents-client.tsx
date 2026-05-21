'use client'

import { useState } from "react";
import { Plus, Search, Edit3, Trash2, X, Loader2, Briefcase, Hash, Phone, Building2, Percent } from "lucide-react";
import { addAgent, updateAgent, deleteAgent } from "./actions";

const statColors: Record<string, string> = {
  active: "text-emerald-600 bg-emerald-50 border-emerald-200",
  inactive: "text-red-500 bg-red-50 border-red-200",
};

export default function AgentsClient({ initialAgents }: { initialAgents: any[] }) {
  const [list, setList] = useState(initialAgents);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = list.filter(a =>
    a.full_name.toLowerCase().includes(search.toLowerCase()) ||
    a.agent_id.toLowerCase().includes(search.toLowerCase()) ||
    (a.company || '').toLowerCase().includes(search.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const result = editing ? await updateAgent(editing.id, fd) : await addAgent(fd);
    if (result.success) { setShowForm(false); setEditing(null); window.location.reload(); }
    else alert(result.error);
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (confirm("Delete this agent?")) {
      const r = await deleteAgent(id);
      if (r.success) window.location.reload(); else alert(r.error);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 scroll-reveal">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary uppercase tracking-tight">Agent Network</h1>
          <p className="text-xs sm:text-sm text-text-secondary font-medium">Create and manage booking agents & partners</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="w-5 h-5" /> Add Agent</button>
      </div>

      <div className="glass p-3 sm:p-4 rounded-2xl sm:rounded-3xl flex items-center gap-4 scroll-reveal">
        <Search className="w-5 h-5 text-text-muted ml-2" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, ID or company..." className="flex-1 bg-transparent border-none outline-none font-bold text-text-primary placeholder:text-text-muted" />
      </div>

      <div className="grid grid-cols-3 gap-3 scroll-reveal">
        {[
          { label: "Total", value: list.length, c: "text-primary" },
          { label: "Active", value: list.filter(a => a.status === 'active').length, c: "text-emerald-600" },
          { label: "Inactive", value: list.filter(a => a.status !== 'active').length, c: "text-red-500" },
        ].map(s => (
          <div key={s.label} className="glass p-4 rounded-2xl text-center">
            <p className="text-2xl font-black font-mono-nums">{s.value}</p>
            <p className={`text-[10px] font-black uppercase tracking-widest ${s.c}`}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 scroll-stagger">
        {filtered.map(a => (
          <div key={a.id} className="glass p-5 sm:p-8 rounded-3xl sm:rounded-4xl border border-border group hover:bg-white hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-all" />
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/30 group-hover:rotate-6 transition-transform">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border ${statColors[a.status] || statColors.active}`}>{a.status || 'active'}</span>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-black text-text-primary tracking-tight mb-2">{a.full_name}</h3>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-text-secondary"><Hash className="w-3.5 h-3.5 text-text-muted" /> {a.agent_id}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-6 border-t border-border/50">
              <button onClick={() => { setEditing(a); setShowForm(true); }} className="flex-1 h-11 bg-page hover:bg-primary-subtle text-text-muted hover:text-primary rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
              <button onClick={() => handleDelete(a.id)} className="w-11 h-11 bg-page hover:bg-danger-subtle text-text-muted hover:text-red-500 rounded-xl flex items-center justify-center transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass p-12 rounded-3xl text-center">
          <Briefcase className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-lg font-black text-text-primary uppercase">No Agents Found</p>
          <p className="text-sm text-text-secondary font-medium mt-1">Add your first agent</p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-transparent" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-md glass p-5 sm:p-8 rounded-3xl sm:rounded-4xl border-white shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">{editing ? 'Edit Agent' : 'Add New Agent'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-page rounded-xl transition-colors cursor-pointer"><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {!editing && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Agent ID</label>
                  <input name="agent_id" required placeholder="e.g. AGT-01" className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-amber-500 transition-all uppercase" />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Full Name</label>
                <input name="full_name" defaultValue={editing?.full_name} required placeholder="e.g. Suresh Travels" className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-amber-500 transition-all" />
              </div>

              {editing && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Status</label>
                  <select name="status" defaultValue={editing?.status || 'active'} className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-amber-500 transition-all cursor-pointer">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              )}
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-12 bg-page text-text-secondary rounded-2xl font-black text-xs uppercase tracking-widest border border-border hover:bg-slate-100 transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 h-12 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editing ? "Update" : "Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
