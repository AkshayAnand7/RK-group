"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard, Store, ClipboardList, Bus, Fuel, FileBarChart,
  Bell, Users, Settings, LogOut, Menu, X, ChevronDown,
  Car, UserCheck, Briefcase,
} from "lucide-react";

const navSections = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "RK Lottery",
    items: [
      { name: "Shops", href: "/admin/shops", icon: Store },
      { name: "Collections", href: "/admin/collections", icon: ClipboardList },
    ],
  },
  {
    label: "RK Travel",
    items: [
      { name: "Bookings", href: "/admin/bookings", icon: ClipboardList },
      { name: "Trips", href: "/admin/trips", icon: Bus },
      { name: "Vehicles", href: "/admin/vehicles", icon: Car },
      { name: "Expenses", href: "/admin/expenses", icon: Fuel },
      { name: "Analytics", href: "/admin/analytics", icon: FileBarChart },
    ],
  },
  {
    label: "Management",
    items: [
      { name: "Staff", href: "/admin/staff", icon: UserCheck },
      { name: "Agents", href: "/admin/agents", icon: Briefcase },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Reports", href: "/admin/reports", icon: FileBarChart },
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10">
            <img src="/logo.png?v=2" alt="RK Group" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-white font-black text-sm tracking-tight uppercase">RK Group</p>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
        {navSections.map(section => (
          <div key={section.label}>
            <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-white/30">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive(item.href)
                      ? "bg-primary/15 text-white border-l-3 border-primary"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  <span className="flex-1">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all duration-150 cursor-pointer"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-page">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-[260px] bg-sidebar fixed h-screen z-40 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-[280px] bg-sidebar flex flex-col h-full animate-slide-right">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-surface border-b border-border flex items-center px-4 lg:px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-page transition-colors cursor-pointer">
            <Menu className="w-5 h-5 text-text-secondary" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-9 px-4 bg-page border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-150"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-page transition-colors cursor-pointer">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-page transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-xs font-bold">{(session?.user?.name || 'SA')[0]}</span>
                </div>
                <span className="hidden md:block text-sm font-medium">{session?.user?.name || 'Admin'}</span>
                <ChevronDown className="w-4 h-4 text-text-muted" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-surface border border-border rounded-xl shadow-lg p-1.5 z-50 animate-fade-in">
                  <Link href="/admin/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-page rounded-lg transition-colors">
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger-subtle rounded-lg transition-colors cursor-pointer">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
