"use client";
import { useState } from "react";
import { 
  Bus, Search, Download, Lock, Unlock, 
  MapPin, ArrowRight, Filter, Edit3, Trash2, 
  FileText, Table as TableIcon, CheckCircle, Clock
} from "lucide-react";

const demoTrips = [
  { id: 1, date: "13 May 2026", driver: "Rajesh Patil", vehicle: "MH-12-AB-1234", from: "Mumbai", to: "Pune", type: "Round Trip", amount: 8500, received: 8500, locked: true },
  { id: 2, date: "13 May 2026", driver: "Sunil More", vehicle: "MH-14-CD-5678", from: "Pune", to: "Nashik", type: "One Side", amount: 4200, received: 4200, locked: true },
  { id: 3, date: "12 May 2026", driver: "Rajesh Patil", vehicle: "MH-12-AB-1234", from: "Pune", to: "Nagpur", type: "Round Trip", amount: 15000, received: 10000, locked: true },
  { id: 4, date: "12 May 2026", driver: "Kiran Shinde", vehicle: "MH-12-EF-9012", from: "Mumbai", to: "Goa", type: "One Side", amount: 12000, received: 12000, locked: false },
];

export default function TravelTripsPage() {
  const [trips, setTrips] = useState(demoTrips);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("today");

  const toggleLock = (id: number) => {
    setTrips(trips.map(t => t.id === id ? { ...t, locked: !t.locked } : t));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Trip Details Management</h1>
          <p className="text-sm text-text-secondary font-medium">Full control over travel logs and fleet movements</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-primary py-2.5 flex items-center gap-2 text-xs">
            <FileText className="w-4 h-4" /> PDF Export
          </button>
          <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 hover:bg-emerald-700 transition-all cursor-pointer">
            <TableIcon className="w-4 h-4" /> Excel Export
          </button>
        </div>
      </div>

      <div className="glass p-4 rounded-3xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by driver, vehicle, or route..." 
            className="w-full h-12 pl-11 pr-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" 
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-page border border-border rounded-xl">
          {["today", "weekly", "monthly", "custom"].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                period === p ? "bg-travel text-white shadow-lg shadow-travel/20" : "text-text-muted hover:text-text-primary"
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-4xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-page/50 border-b border-border">
                {["Date", "Driver & Vehicle", "Route Details", "Amount Status", "Status", "Actions"].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-page/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-text-primary">{trip.date}</p>
                    <p className="text-[10px] font-black text-text-muted">TRIP-ID: {trip.id.toString().padStart(4, '0')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-text-primary">{trip.driver}</p>
                    <p className="text-[10px] font-black text-travel uppercase tracking-widest">{trip.vehicle}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-secondary">{trip.from}</span>
                      <ArrowRight className="w-3 h-3 text-text-muted" />
                      <span className="text-xs font-bold text-text-secondary">{trip.to}</span>
                    </div>
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{trip.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <p className="font-black text-emerald-600 font-mono-nums">₹{trip.received.toLocaleString("en-IN")}</p>
                      {trip.amount > trip.received && (
                        <p className="text-[10px] font-black text-warning flex items-center gap-1 uppercase tracking-widest">
                          <Clock className="w-3 h-3" /> ₹{(trip.amount - trip.received).toLocaleString("en-IN")} Pending
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {trip.locked ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase">
                        <Lock className="w-3 h-3" /> Locked
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-warning-subtle text-warning rounded-full text-[10px] font-black uppercase">
                        <Unlock className="w-3 h-3" /> Editable
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleLock(trip.id)}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${trip.locked ? "bg-page text-text-muted hover:text-travel" : "bg-travel text-white"}`}
                        title={trip.locked ? "Unlock Trip" : "Lock Trip"}
                      >
                        {trip.locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>
                      <button className="p-2 bg-page text-text-muted hover:text-travel hover:bg-travel-subtle rounded-xl transition-all cursor-pointer">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-page text-text-muted hover:text-danger hover:bg-danger-subtle rounded-xl transition-all cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
