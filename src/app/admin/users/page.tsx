"use client";
import { useState } from "react";
import { 
  Users, UserPlus, Search, Edit3, Trash2, Shield, 
  Mail, Store, X, CheckCircle, Loader2, Key,
  UserX, UserCheck, Settings, ShieldCheck, Bus, Ticket
} from "lucide-react";

const demoUsers = [
  { id: 1, name: "Admin Akshay", email: "admin@rkgroup.com", role: "Super Admin", status: "Active", lastLogin: "2 hours ago" },
  { id: 2, name: "Rajesh Patil", email: "rajesh@rktravel.com", role: "Travel Staff", status: "Active", lastLogin: "1 day ago" },
  { id: 3, name: "Rahul Sharma", email: "rahul@rkshop1.com", role: "Lottery Shop Staff", shop: "VAKAD", status: "Active", lastLogin: "5 hours ago" },
  { id: 4, name: "Sunil More", email: "sunil@rktravel.com", role: "Travel Staff", status: "Disabled", lastLogin: "3 days ago" },
];

const roles = ["Super Admin", "Travel Staff", "Lottery Shop Staff"];

export default function UserManagementPage() {
  const [users, setUsers] = useState(demoUsers);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleUserStatus = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Disabled" : "Active" } : u));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">User Management</h1>
          <p className="text-sm text-text-secondary font-medium">Control system access, roles, and security permissions</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" /> Add New User
        </button>
      </div>

      {/* Grid of User Cards (Premium Card View) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {users.map((user, i) => (
          <div key={user.id} className="glass p-6 rounded-4xl border border-border card-hover relative overflow-hidden group">
            {/* Status Badge */}
            <div className="absolute top-6 right-6">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                user.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
              }`}>
                {user.status}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-black shadow-inner shadow-primary/5">
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <h3 className="text-lg font-black text-text-primary leading-tight">{user.name}</h3>
                <p className="text-xs text-text-muted font-bold flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {user.email}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between p-3 bg-page rounded-2xl border border-border/50">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">System Role</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase ${
                  user.role === "Super Admin" ? "text-indigo-600" : user.role === "Travel Staff" ? "text-blue-600" : "text-emerald-600"
                }`}>
                  {user.role === "Super Admin" ? <ShieldCheck className="w-3.5 h-3.5" /> : 
                   user.role === "Travel Staff" ? <Bus className="w-3.5 h-3.5" /> : <Ticket className="w-3.5 h-3.5" />}
                  {user.role}
                </span>
              </div>
              {user.shop && (
                <div className="flex items-center justify-between p-3 bg-page rounded-2xl border border-border/50">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Assigned Shop</span>
                  <span className="text-xs font-bold text-text-primary uppercase tracking-tight">{user.shop}</span>
                </div>
              )}
              <div className="flex items-center justify-between px-3">
                <span className="text-[10px] font-bold text-text-muted">Last Activity</span>
                <span className="text-[10px] font-bold text-text-muted italic">{user.lastLogin}</span>
              </div>
            </div>

            {/* Admin Controls */}
            <div className="flex items-center gap-2 pt-4 border-t border-border/50">
              <button 
                onClick={() => toggleUserStatus(user.id)}
                className={`flex-1 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  user.status === "Active" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                }`}
              >
                {user.status === "Active" ? <><UserX className="w-3.5 h-3.5" /> Disable</> : <><UserCheck className="w-3.5 h-3.5" /> Enable</>}
              </button>
              <button className="w-10 h-10 bg-page hover:bg-primary-subtle text-text-muted hover:text-primary rounded-xl flex items-center justify-center transition-all cursor-pointer" title="Reset Password">
                <Key className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 bg-page hover:bg-primary-subtle text-text-muted hover:text-primary rounded-xl flex items-center justify-center transition-all cursor-pointer" title="Edit Permissions">
                <Settings className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 bg-page hover:bg-red-subtle text-text-muted hover:text-red-500 rounded-xl flex items-center justify-center transition-all cursor-pointer" title="Delete User">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-md glass p-8 rounded-4xl border-white shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">Create User</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-page rounded-xl transition-colors cursor-pointer">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <form className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Full Name</label>
                <input required placeholder="e.g. John Doe" className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Email Address</label>
                <input type="email" required placeholder="name@rkgroup.com" className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">System Role</label>
                <select className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-primary transition-all cursor-pointer">
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-12 bg-page text-text-secondary rounded-2xl font-black text-xs uppercase tracking-widest border border-border hover:bg-slate-100 transition-all cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 h-12 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
