"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Store, ClipboardList, Bus, Fuel, FileBarChart,
  Bell, Users, Settings, LogOut, Menu, X, ChevronDown,
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
      { name: "Trips", href: "/admin/trips", icon: Bus },
      { name: "Expenses", href: "/admin/expenses", icon: Fuel },
      { name: "Analytics", href: "/admin/analytics", icon: FileBarChart },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Reports", href: "/admin/reports", icon: FileBarChart },
      { name: "Notifications", href: "/admin/notifications", icon: Bell, badge: 3 },
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // If we are on the login page, don't show the sidebar and header
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">RK</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">RK Group</p>
            <p className="text-white/40 text-xs">Admin Panel</p>
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
                  {item.badge && (
                    <span className="min-w-[20px] h-5 px-1.5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
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
                  <span className="text-primary text-xs font-bold">SA</span>
                </div>
                <span className="hidden md:block text-sm font-medium">Super Admin</span>
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
