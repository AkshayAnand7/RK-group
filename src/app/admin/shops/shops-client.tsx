'use client'

import { useState } from "react";
import { 
  Plus, Search, Edit3, Trash2, 
  MapPin, User, X, Loader2, Ticket
} from "lucide-react";
import { addShop, deleteShop } from "./actions";

export default function ShopsClient({ initialShops }: { initialShops: any[] }) {
  const [shops, setShops] = useState(initialShops);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(search.toLowerCase()) || 
    shop.shop_id.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await addShop(formData);
    
    if (result.success) {
      setShowForm(false);
      // In a real app, revalidatePath would handle this, 
      // but for immediate UI updates in Client Component we can refresh or update state
      window.location.reload(); 
    } else {
      alert(result.error);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this shop?")) {
      const result = await deleteShop(id);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Lottery Shop Management</h1>
          <p className="text-sm text-text-secondary font-medium">Add, Edit and Monitor all shop terminals</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add New Shop
        </button>
      </div>

      {/* Search */}
      <div className="glass p-4 rounded-3xl flex items-center gap-4">
        <Search className="w-5 h-5 text-text-muted ml-2" />
        <input 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or ID..."
          className="flex-1 bg-transparent border-none outline-none font-bold text-text-primary placeholder:text-text-muted"
        />
      </div>

      {/* Grid of Shops */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredShops.map((shop) => (
          <div key={shop.shop_id} className="glass p-8 rounded-4xl border border-border group hover:bg-white hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lottery/5 blur-3xl -mr-16 -mt-16 group-hover:bg-lottery/10 transition-all" />
            
            <div className="flex items-start justify-between mb-8">
              <div className="w-14 h-14 bg-lottery rounded-2xl flex items-center justify-center shadow-xl shadow-lottery/30 group-hover:rotate-6 transition-transform">
                <Ticket className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Shop ID</p>
                <p className="text-xl font-black text-text-primary font-mono-nums">{shop.shop_id}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-black text-text-primary tracking-tight mb-2 uppercase">{shop.name}</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                  <MapPin className="w-3.5 h-3.5 text-text-muted" /> {shop.location}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                  <User className="w-3.5 h-3.5 text-text-muted" /> {shop.staff_id || 'No staff assigned'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-6 border-t border-border/50">
              <button className="flex-1 h-11 bg-page hover:bg-primary-subtle text-text-muted hover:text-primary rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Edit3 className="w-3.5 h-3.5" /> Edit Shop
              </button>
              <button 
                onClick={() => handleDelete(shop.shop_id)}
                className="w-11 h-11 bg-page hover:bg-red-subtle text-text-muted hover:text-red-500 rounded-xl flex items-center justify-center transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Shop Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-md glass p-8 rounded-4xl border-white shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">Add New Shop</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-page rounded-xl transition-colors cursor-pointer">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Shop ID</label>
                  <input name="shop_id" required placeholder="e.g. 007" className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-lottery transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Name</label>
                  <input name="name" required placeholder="e.g. VAKAD" className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-lottery transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Location</label>
                <input name="location" required placeholder="e.g. Main Junction" className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-lottery transition-all" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-12 bg-page text-text-secondary rounded-2xl font-black text-xs uppercase tracking-widest border border-border hover:bg-slate-100 transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 h-12 bg-lottery text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-lottery/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Shop"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
