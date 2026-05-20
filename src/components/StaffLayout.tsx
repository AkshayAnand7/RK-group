"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ClipboardList, History, LogOut, LayoutDashboard, 
  Bus, Fuel, Bell, User, Calendar
} from "lucide-react";
import { signOut } from "next-auth/react";

interface StaffLayoutProps {
  children: React.ReactNode;
  module: "lottery" | "travel";
  shopName?: string;
}

export default function StaffLayout({ children, module, shopName }: StaffLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = module === "lottery" ? [
    { name: "Entry", href: `/lottery/entry`, icon: ClipboardList },
    { name: "History", href: `/lottery/history`, icon: History },
  ] : [
    { name: "Trips", href: `/travel/trips`, icon: Bus },
    { name: "Booking", href: `/travel/booking`, icon: Calendar },
    { name: "Expenses", href: `/travel/expenses`, icon: Fuel },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-page flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 h-14 bg-surface border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-border shadow-sm">
            <img src="/logo.jpg" alt="RK Group" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-text-primary leading-none">
              {module === "lottery" ? "RK Lottery" : "RK Travel"}
            </h1>
            {shopName && <p className="text-[10px] text-text-muted mt-0.5">{shopName}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-page transition-colors cursor-pointer">
            <Bell className="w-5 h-5 text-text-secondary" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-danger rounded-full" />
          </button>
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })} 
            className="p-2 text-text-muted hover:text-danger cursor-pointer transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-surface border-t border-border flex items-center justify-around px-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {navItems.map(item => (
          <Link 
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-4 py-2 transition-all duration-150 ${
              isActive(item.href) ? "text-primary" : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive(item.href) ? "animate-slide-up" : ""}`} />
            <span className="text-[10px] font-bold tracking-tight uppercase">{item.name}</span>
            {isActive(item.href) && <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
          </Link>
        ))}
      </nav>
    </div>
  );
}
