import Link from "next/link";
import StaffLayout from "@/components/StaffLayout";
import { PlusCircle, FileText, Wallet, Calendar } from "lucide-react";

export default function StaffTravelDashboard() {
  const menuItems = [
    {
      title: "New Booking",
      desc: "Schedule a future trip",
      icon: Calendar,
      href: "/staff/travel/booking",
      color: "bg-blue-500"
    },
    {
      title: "New Trip",
      desc: "Start a current trip log",
      icon: PlusCircle,
      href: "/staff/travel/trips",
      color: "bg-green-500"
    },
    {
      title: "Add Expense",
      desc: "Fuel & maintenance",
      icon: Wallet,
      href: "/staff/travel/expenses",
      color: "bg-orange-500"
    }
  ];

  return (
    <StaffLayout module="travel" shopName="Travel Desk">
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-black mb-6">Travel Management</h1>
        
        <div className="grid gap-4">
          {menuItems.map((item, i) => (
            <Link 
              key={i}
              href={item.href}
              className="group glass p-6 rounded-3xl flex items-center gap-6 hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/20 shadow-xl"
            >
              <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-lg`}>
                <item.icon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-text-primary">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </StaffLayout>
  );
}
