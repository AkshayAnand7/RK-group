"use client";
import { useState, useTransition } from "react";
import { 
  Users, UserPlus, Search, Edit3, Trash2, Shield, 
  Mail, Store, X, CheckCircle, Loader2, Key,
  UserX, UserCheck, Settings, ShieldCheck, Bus, Ticket
} from "lucide-react";
import { updateUserRole, deleteUser, createUser } from "./actions";

const roles = ["admin", "agent", "staff"];

export default function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [showRoleModal, setShowRoleModal] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ full_name: "", email: "", password: "", role: "staff" });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(newUser).forEach(([key, val]) => formData.append(key, val));
      const result = await createUser(formData);
      if (result.success) {
        setShowAddModal(false);
        setNewUser({ full_name: "", email: "", password: "", role: "staff" });
        window.location.reload();
      } else {
        alert(result.error);
      }
    });
  };

  const handleRoleUpdate = async (id: string, newRole: string) => {
    startTransition(async () => {
      const result = await updateUserRole(id, newRole);
      if (result.success) {
        setShowRoleModal(null);
        window.location.reload();
      } else {
        alert(result.error);
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this user profile? This won't remove their login credentials but will block access to these modules.")) {
      startTransition(async () => {
        const result = await deleteUser(id);
        if (result.success) {
          window.location.reload();
        } else {
          alert(result.error);
        }
      });
    }
  };

  const filtered = initialUsers.filter(u => 
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`space-y-6 animate-fade-in ${isPending ? 'opacity-50' : ''}`}>
      <div className="flex flex-col gap-4 scroll-reveal">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary uppercase tracking-tight">System Users</h1>
          <p className="text-xs sm:text-sm text-text-secondary font-medium">Manage access levels for staff and administrators</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="h-11 px-6 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Add New User
          </button>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users..." 
              className="w-full h-11 pl-11 pr-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all" 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 scroll-stagger">
        {filtered.map((user) => (
          <div key={user.id} className="glass p-4 sm:p-6 rounded-3xl sm:rounded-4xl border border-border card-hover relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-black shadow-inner shadow-primary/5">
                {(user.full_name || 'U')[0]}
              </div>
              <div>
                <h3 className="text-lg font-black text-text-primary leading-tight">{user.full_name || 'Unnamed User'}</h3>
                <p className="text-xs text-text-muted font-bold flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {user.email || 'No Email'}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between p-3 bg-page rounded-2xl border border-border/50">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">System Role</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase ${
                  user.role === "admin" ? "text-indigo-600" : user.role === "agent" ? "text-blue-600" : "text-emerald-600"
                }`}>
                  {user.role === "admin" ? <ShieldCheck className="w-3.5 h-3.5" /> : 
                   user.role === "agent" ? <Bus className="w-3.5 h-3.5" /> : <Ticket className="w-3.5 h-3.5" />}
                  {user.role}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-border/50">
              <button 
                onClick={() => setShowRoleModal(user)}
                className="flex-1 h-10 bg-page hover:bg-primary-subtle text-text-muted hover:text-primary rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <Settings className="w-3.5 h-3.5" /> Change Role
              </button>
              <button 
                onClick={() => handleDelete(user.id)}
                className="w-10 h-10 bg-page hover:bg-red-subtle text-text-muted hover:text-red-500 rounded-xl flex items-center justify-center transition-all cursor-pointer" title="Delete User">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showRoleModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-transparent backdrop-blur-sm" onClick={() => setShowRoleModal(null)} />
          <div className="relative w-full max-w-md glass p-5 sm:p-8 rounded-3xl sm:rounded-4xl border-white shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">Assign Role</h2>
              <button onClick={() => setShowRoleModal(null)} className="p-2 hover:bg-page rounded-xl transition-colors cursor-pointer">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-text-secondary mb-4">Assign a new system access level for <b>{showRoleModal.full_name}</b></p>
              {roles.map(role => (
                <button 
                  key={role}
                  onClick={() => handleRoleUpdate(showRoleModal.id, role)}
                  disabled={isPending}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all group ${
                    showRoleModal.role === role ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-page"
                  }`}
                >
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-text-primary">{role.replace('_', ' ')}</p>
                    <p className="text-[10px] font-bold text-text-muted mt-0.5">
                      {role === 'admin' ? "Full access to all management modules" : 
                       role === 'agent' ? "Access to sales monitoring & analytics" : "General staff access for daily entries"}
                    </p>
                  </div>
                  {showRoleModal.role === role && <CheckCircle className="w-5 h-5 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-transparent backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md glass p-5 sm:p-8 rounded-3xl sm:rounded-4xl border-white shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">Add New User</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-page rounded-xl transition-colors cursor-pointer">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  required
                  placeholder="John Doe"
                  value={newUser.full_name}
                  onChange={e => setNewUser({...newUser, full_name: e.target.value})}
                  className="w-full h-12 px-4 bg-page border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  required
                  type="email"
                  placeholder="john@example.com"
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  className="w-full h-12 px-4 bg-page border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Password</label>
                <input 
                  required
                  type="password"
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  className="w-full h-12 px-4 bg-page border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Initial Role</label>
                <select 
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                  className="w-full h-12 px-4 bg-page border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-primary transition-all"
                >
                  {roles.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                </select>
              </div>
              <button 
                type="submit"
                disabled={isPending}
                className="w-full h-14 mt-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create User Account</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
