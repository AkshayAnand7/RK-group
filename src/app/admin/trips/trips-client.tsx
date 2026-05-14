'use client'

import { useState, useTransition } from "react";
import { 
  Search, FileText, Table as TableIcon, 
  ArrowRight, Lock, Unlock, Edit3, Trash2, Clock, Loader2
} from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";
import { toggleTripLock, deleteTrip } from "./actions";

export default function TripsClient({ initialTrips }: { initialTrips: any[] }) {
  const [trips, setTrips] = useState(initialTrips);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("today");
  const [isPending, startTransition] = useTransition();

  const filteredTrips = trips.filter(trip => 
    trip.from_location.toLowerCase().includes(search.toLowerCase()) || 
    trip.to_location.toLowerCase().includes(search.toLowerCase()) ||
    (trip.driver?.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (trip.vehicle?.vehicle_number || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleExportPDF = () => {
    const headers = [["ID", "Date", "Driver", "Vehicle", "Route", "Amount", "Status"]];
    const data = filteredTrips.map(t => [t.id, t.date, t.driver?.full_name || 'N/A', t.vehicle?.vehicle_number || 'N/A', `${t.from_location} - ${t.to_location}`, t.received_amount, t.is_locked ? "Locked" : "Open"]);
    exportToPDF("RK Travel Trips Report", headers, data, "travel_trips");
  };

  const handleExportExcel = () => {
    const data = filteredTrips.map(t => ({
      ID: t.id, Date: t.date, Driver: t.driver?.full_name || 'N/A', Vehicle: t.vehicle?.vehicle_number || 'N/A', From: t.from_location, To: t.to_location, Type: t.trip_type, Total: t.total_amount, Received: t.received_amount, Status: t.is_locked ? "Locked" : "Open"
    }));
    exportToExcel(data, "travel_trips");
  };

  async function handleToggleLock(id: number, currentLock: boolean) {
    startTransition(async () => {
      const result = await toggleTripLock(id, !currentLock);
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error);
      }
    });
  }

  async function handleDelete(id: number) {
    if (confirm("Delete this trip record?")) {
      const result = await deleteTrip(id);
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error);
      }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Trip Details Management</h1>
          <p className="text-sm text-text-secondary font-medium">Full control over travel logs and fleet movements</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportPDF} className="btn-primary py-2.5 flex items-center gap-2 text-xs">
            <FileText className="w-4 h-4" /> PDF Export
          </button>
          <button onClick={handleExportExcel} className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 hover:bg-emerald-700 transition-all cursor-pointer">
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
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className={`hover:bg-page/30 transition-colors ${isPending ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4">
                    <p className="font-bold text-text-primary">{new Date(trip.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    <p className="text-[10px] font-black text-text-muted">TRIP-ID: {trip.id.toString().padStart(4, '0')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-text-primary">{trip.driver?.full_name || 'N/A'}</p>
                    <p className="text-[10px] font-black text-travel uppercase tracking-widest">{trip.vehicle?.vehicle_number || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-secondary">{trip.from_location}</span>
                      <ArrowRight className="w-3 h-3 text-text-muted" />
                      <span className="text-xs font-bold text-text-secondary">{trip.to_location}</span>
                    </div>
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{trip.trip_type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <p className="font-black text-emerald-600 font-mono-nums">₹{Number(trip.received_amount).toLocaleString("en-IN")}</p>
                      {trip.total_amount > trip.received_amount && (
                        <p className="text-[10px] font-black text-red-500 flex items-center gap-1 uppercase tracking-widest">
                          <Clock className="w-3 h-3" /> ₹{(trip.total_amount - trip.received_amount).toLocaleString("en-IN")} Pending
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {trip.is_locked ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase">
                        <Lock className="w-3 h-3" /> Locked
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-travel rounded-full text-[10px] font-black uppercase">
                        <Unlock className="w-3 h-3" /> Editable
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleToggleLock(trip.id, trip.is_locked)}
                        disabled={isPending}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${trip.is_locked ? "bg-page text-text-muted hover:text-travel" : "bg-travel text-white"}`}
                      >
                        {trip.is_locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>
                      <button className="p-2 bg-page text-text-muted hover:text-travel hover:bg-travel-subtle rounded-xl transition-all cursor-pointer">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(trip.id)}
                        className="p-2 bg-page text-text-muted hover:text-danger hover:bg-danger-subtle rounded-xl transition-all cursor-pointer"
                      >
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
