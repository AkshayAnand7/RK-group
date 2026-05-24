'use client'

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, FileText, Table as TableIcon, 
  ArrowRight, Lock, Unlock, Edit3, Trash2, Clock, Loader2, XCircle
} from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";
import { toggleTripLock, updateTrip, deleteTrip } from "./actions";

export default function TripsClient({ initialTrips }: { initialTrips: any[] }) {
  const router = useRouter();
  const [trips, setTrips] = useState(initialTrips);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("today");
  const [editingTrip, setEditingTrip] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const filteredTrips = trips.filter(trip => 
    trip.from_location.toLowerCase().includes(search.toLowerCase()) || 
    trip.to_location.toLowerCase().includes(search.toLowerCase()) ||
    (trip.driver?.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (trip.vehicle?.vehicle_number || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleExportPDF = () => {
    const headers = [["ID", "Date", "Driver", "Vehicle", "Route", "Amount", "Status"]];
    const data = filteredTrips.map(t => [t.id, t.date, t.driver_name || t.driver?.full_name || 'N/A', t.vehicle?.vehicle_number || t.vehicle || 'N/A', `${t.from_location} - ${t.to_location}`, t.total_amount, t.is_locked ? "Locked" : "Open"]);
    exportToPDF("RK Travel Trips Report", headers, data, "travel_trips");
  };

  const handleExportExcel = () => {
    const data = filteredTrips.map(t => ({
      ID: t.id, Date: t.date, Driver: t.driver_name || t.driver?.full_name || 'N/A', Vehicle: t.vehicle?.vehicle_number || t.vehicle || 'N/A', From: t.from_location, To: t.to_location, Type: t.trip_type, Total: t.total_amount, Received: t.received_amount, Status: t.is_locked ? "Locked" : "Open"
    }));
    exportToExcel(data, "travel_trips");
  };

  async function handleToggleLock(id: number, currentLock: boolean) {
    startTransition(async () => {
      const result = await toggleTripLock(id, !currentLock);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error);
      }
    });
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      const result = await updateTrip(editingTrip.id, formData);
      if (result.success) {
        setEditingTrip(null);
        router.refresh();
      } else {
        alert(result.error);
      }
    });
  };

  async function handleDelete(id: number) {
    if (confirm("Delete this trip record?")) {
      const result = await deleteTrip(id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error);
      }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 scroll-reveal">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary uppercase tracking-tight">Trip Details Management</h1>
          <p className="text-xs sm:text-sm text-text-secondary font-medium">Full control over travel logs and fleet movements</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleExportPDF} className="btn-primary py-2.5 flex items-center gap-2 text-[10px] sm:text-xs">
            <FileText className="w-4 h-4" /> <span className="hidden sm:inline">PDF</span> Export
          </button>
          <button onClick={handleExportExcel} className="px-3 sm:px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-[10px] sm:text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 hover:bg-emerald-700 transition-all cursor-pointer">
            <TableIcon className="w-4 h-4" /> <span className="hidden sm:inline">Excel</span> Export
          </button>
        </div>
      </div>

      <div className="glass p-3 sm:p-4 rounded-2xl sm:rounded-3xl flex flex-col md:flex-row gap-3 sm:gap-4 items-center scroll-reveal">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by driver, vehicle, or route..." 
            className="w-full h-12 pl-11 pr-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" 
          />
        </div>
        <div className="flex items-center gap-1 sm:gap-2 p-1 bg-page border border-border rounded-xl overflow-x-auto scrollbar-none w-full sm:w-auto">
          {["today", "weekly", "monthly", "custom"].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 sm:px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${
                period === p ? "bg-travel text-white shadow-lg shadow-travel/20" : "text-text-muted hover:text-text-primary"
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-3xl sm:rounded-4xl border border-border overflow-hidden scroll-reveal">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-sm text-left min-w-[700px]">
            <thead>
              <tr className="bg-page/50 border-b border-border">
                {["Date", "Driver & Staff", "Customer & Route", "Vehicle", "Amount Status", "Status", "Actions"].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className={`hover:bg-page/30 transition-colors ${isPending ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-text-primary">{new Date(trip.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    <p className="text-[10px] font-black text-text-muted">TRIP-ID: {trip.id.toString().padStart(4, '0')}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-text-primary">{trip.driver_name || trip.driver?.full_name || 'N/A'} <span className="text-[9px] font-normal text-text-muted lowercase">driver</span></p>
                    <p className="text-[10px] font-black text-travel uppercase tracking-widest mt-0.5">{trip.staff_name || 'N/A'} <span className="text-[8px] font-normal text-text-muted lowercase">staff</span></p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-xs font-black text-text-primary mb-1 truncate max-w-[150px]">{trip.customer_name || 'N/A'} <span className="text-[8px] font-normal text-text-muted lowercase">customer</span></p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-secondary">{trip.from_location}</span>
                      <ArrowRight className="w-3 h-3 text-text-muted" />
                      <span className="text-xs font-bold text-text-secondary">{trip.to_location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-[11px] font-black text-text-primary uppercase tracking-widest">{trip.vehicle?.vehicle_number || trip.vehicle || 'N/A'}</p>
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{trip.trip_type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-0.5">
                      <p className="font-black text-emerald-600 font-mono-nums">₹{Number(trip.received_amount).toLocaleString("en-IN")}</p>
                      {trip.total_amount > trip.received_amount && (
                        <p className="text-[10px] font-black text-red-500 flex items-center gap-1 uppercase tracking-widest">
                          <Clock className="w-3 h-3" /> ₹{(trip.total_amount - trip.received_amount).toLocaleString("en-IN")} Pending
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleToggleLock(trip.id, trip.is_locked)}
                        disabled={isPending}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${trip.is_locked ? "bg-page text-text-muted hover:text-travel" : "bg-travel text-white"}`}
                      >
                        {trip.is_locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => setEditingTrip(trip)}
                        className="p-2 bg-page text-text-muted hover:text-travel hover:bg-travel-subtle rounded-xl transition-all cursor-pointer"
                      >
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

      {/* Edit Modal */}
      {editingTrip && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-transparent" onClick={() => setEditingTrip(null)} />
          <div className="relative w-full max-w-md glass p-5 sm:p-8 rounded-3xl sm:rounded-4xl border-white shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">Edit Trip Log</h2>
                <p className="text-[10px] font-black text-travel uppercase tracking-widest">{editingTrip.driver?.full_name} • {editingTrip.vehicle?.vehicle_number}</p>
              </div>
              <button onClick={() => setEditingTrip(null)} className="p-2 hover:bg-page rounded-xl transition-colors cursor-pointer">
                <XCircle className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">From</label>
                  <input name="from" required defaultValue={editingTrip.from_location} className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">To</label>
                  <input name="to" required defaultValue={editingTrip.to_location} className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Total Amount (₹)</label>
                  <input name="total" type="number" required defaultValue={editingTrip.total_amount} className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Received (₹)</label>
                  <input name="received" type="number" required defaultValue={editingTrip.received_amount} className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setEditingTrip(null)} className="flex-1 h-12 bg-page text-text-secondary rounded-2xl font-black text-xs uppercase tracking-widest border border-border hover:bg-slate-100 transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isPending} className="flex-1 h-12 bg-travel text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-travel/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center">
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Trip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
