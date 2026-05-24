"use client";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Search, FileText, Table as TableIcon, Trash2, Edit3,
  MapPin, Bus, User, Phone, Calendar, ArrowRight, Loader2, CheckCircle, XCircle
} from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";
import { updateBookingStatus, deleteBooking, updateBooking } from "./actions";

export default function BookingsClient({ initialBookings }: { initialBookings: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingBooking, setEditingBooking] = useState<any>(null);

  const currentSearch = searchParams.get('search') || "";

  const handleSearch = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set('search', val);
    else params.delete('search');
    router.push(`?${params.toString()}`);
  };

  const handleExportPDF = () => {
    const headers = [["Date", "Customer", "Phone", "Route", "Vehicle", "Amount", "Status"]];
    const data = initialBookings.map(b => [
      new Date(b.date).toLocaleDateString(), 
      b.customer_name, 
      b.customer_number, 
      `${b.from_location} to ${b.to_location}`, 
      b.vehicle, 
      b.total_amount, 
      b.status
    ]);
    exportToPDF("RK Travel Bookings", headers, data, "travel_bookings");
  };

  const handleExportExcel = () => {
    const data = initialBookings.map(b => ({
      Date: new Date(b.date).toLocaleDateString(),
      Customer: b.customer_name,
      Phone: b.customer_number,
      From: b.from_location,
      To: b.to_location,
      Type: b.trip_type,
      Vehicle: b.vehicle,
      TotalAmount: b.total_amount,
      ReceivedAmount: b.received_amount,
      Status: b.status,
      Staff: b.staff_name
    }));
    exportToExcel(data, "travel_bookings");
  };

  async function handleStatusUpdate(id: number, status: string) {
    if (status === 'accepted' && !confirm("Accepting this booking will automatically create an active Trip record. Proceed?")) return;
    
    startTransition(async () => {
      const result = await updateBookingStatus(id, status);
      if (!result.success) alert(result.error);
    });
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      const result = await updateBooking(editingBooking.id, formData);
      if (result.success) {
        setEditingBooking(null);
      } else {
        alert(result.error);
      }
    });
  };

  async function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this booking?")) {
      setDeletingId(id);
      const result = await deleteBooking(id);
      if (!result.success) alert(result.error);
      setDeletingId(null);
    }
  }

  return (
    <div className={`space-y-6 animate-fade-in ${isPending ? 'opacity-50' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 scroll-reveal">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary uppercase tracking-tight">Travel Bookings</h1>
          <p className="text-sm text-text-secondary font-medium">Manage and review customer trip requests</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleExportPDF} className="btn-primary py-2.5 flex items-center gap-2 text-[10px] sm:text-xs">
            <FileText className="w-4 h-4" /> <span className="hidden sm:inline">Export</span> PDF
          </button>
          <button onClick={handleExportExcel} className="px-3 sm:px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-[10px] sm:text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 hover:bg-emerald-700 transition-all cursor-pointer">
            <TableIcon className="w-4 h-4" /> <span className="hidden sm:inline">Export</span> Excel
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="glass p-3 sm:p-4 rounded-2xl sm:rounded-3xl flex items-center scroll-reveal">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            defaultValue={currentSearch}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.currentTarget.value)}
            placeholder="Search customer, phone or staff..." 
            className="w-full h-12 pl-11 pr-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" 
          />
        </div>
      </div>

      {/* Grid of Bookings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 scroll-stagger">
        {initialBookings.map((booking) => (
          <div key={booking.id} className="glass p-5 sm:p-8 rounded-3xl sm:rounded-4xl border border-border group hover:bg-white hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col">
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl -mr-16 -mt-16 transition-all ${
              booking.status === 'accepted' ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' : 
              booking.status === 'rejected' ? 'bg-red-500/10 group-hover:bg-red-500/20' : 
              'bg-travel/10 group-hover:bg-travel/20'
            }`} />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                  booking.status === 'accepted' ? 'bg-emerald-500 shadow-emerald-500/30' : 
                  booking.status === 'rejected' ? 'bg-red-500 shadow-red-500/30' : 
                  'bg-travel shadow-travel/30'
                }`}>
                  <Bus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className={`text-[10px] font-black uppercase tracking-widest ${
                    booking.status === 'accepted' ? 'text-emerald-600' : 
                    booking.status === 'rejected' ? 'text-red-500' : 
                    'text-travel'
                  }`}>
                    {booking.status}
                  </div>
                  <div className="text-xs font-bold text-text-muted flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" /> {new Date(booking.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Trip Type</p>
                <span className="px-2 py-1 bg-slate-100 text-text-secondary rounded-md text-[10px] font-bold uppercase">{booking.trip_type === 'round' ? 'Round Trip' : 'One Side'}</span>
              </div>
            </div>

            <div className="mb-6 space-y-4 relative z-10 flex-grow">
              <div>
                <h3 className="text-lg font-black text-text-primary tracking-tight uppercase flex items-center gap-2">
                  <User className="w-4 h-4 text-text-muted" /> {booking.customer_name}
                </h3>
                <p className="text-sm font-bold text-text-muted flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-text-muted" /> {booking.customer_number}
                </p>
              </div>

              <div className="p-4 bg-page/50 rounded-2xl border border-border/50">
                <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                  <MapPin className="w-4 h-4 text-travel" />
                  <span className="truncate">{booking.from_location}</span>
                </div>
                <div className="pl-2 py-1 border-l-2 border-dashed border-border ml-2 my-1">
                  <ArrowRight className="w-3 h-3 text-text-muted" />
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="truncate">{booking.to_location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Vehicle</p>
                  <p className="text-sm font-bold text-text-primary uppercase">{booking.vehicle}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Est. Amount</p>
                  <p className="text-lg font-black text-travel font-mono-nums">₹{booking.total_amount?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-6 border-t border-border/50 relative z-10 mt-auto">
              {booking.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleStatusUpdate(booking.id, 'accepted')}
                    className="flex-1 h-11 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" /> Accept
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                    className="flex-1 h-11 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </>
              )}
              {booking.status !== 'pending' && (
                <div className="flex-1 h-11 bg-page text-text-muted rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border border-border">
                  {booking.status === 'accepted' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {booking.status}
                </div>
              )}
              <button 
                onClick={() => setEditingBooking(booking)}
                className="w-11 h-11 bg-white border border-border hover:bg-slate-50 text-text-muted hover:text-primary rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(booking.id)}
                disabled={deletingId === booking.id}
                className="w-11 h-11 bg-white border border-border hover:bg-red-50 text-text-muted hover:text-red-500 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
              >
                {deletingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="mt-4 text-center">
                <p className="text-[9px] font-bold text-text-muted italic">Booked by {booking.staff_name}</p>
            </div>
          </div>
        ))}

        {initialBookings.length === 0 && (
          <div className="col-span-full py-20 text-center text-text-muted italic glass rounded-4xl border border-border">
            No bookings found.
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingBooking(null)} />
          <div className="relative w-full max-w-lg glass p-5 sm:p-8 rounded-3xl sm:rounded-4xl border-white shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">Edit Booking</h2>
                <p className="text-[10px] font-black text-travel uppercase tracking-widest">{editingBooking.customer_name} • {editingBooking.vehicle}</p>
              </div>
              <button onClick={() => setEditingBooking(null)} className="p-2 hover:bg-page bg-white border border-border rounded-xl transition-colors cursor-pointer">
                <XCircle className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Customer Name</label>
                  <input name="customerName" required defaultValue={editingBooking.customer_name} className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Phone Number</label>
                  <input name="customerNumber" required defaultValue={editingBooking.customer_number} className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">From</label>
                  <input name="from" required defaultValue={editingBooking.from_location} className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">To</label>
                  <input name="to" required defaultValue={editingBooking.to_location} className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Vehicle</label>
                  <input name="vehicle" required defaultValue={editingBooking.vehicle} className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Date</label>
                  <input name="date" type="date" required defaultValue={editingBooking.date} className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Total Amount (₹)</label>
                  <input name="total" type="number" required defaultValue={editingBooking.total_amount} className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Received (₹)</label>
                  <input name="received" type="number" required defaultValue={editingBooking.received_amount} className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Remarks</label>
                  <input name="remark" type="text" defaultValue={editingBooking.remark} className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Amount / Discount (₹)</label>
                  <input name="amount" type="number" defaultValue={editingBooking.amount} className="w-full h-12 px-4 bg-page border border-border rounded-2xl text-sm font-bold focus:outline-none focus:border-travel transition-all" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setEditingBooking(null)} className="flex-1 h-12 bg-white text-text-secondary rounded-2xl font-black text-xs uppercase tracking-widest border border-border hover:bg-slate-50 transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={isPending} className="flex-1 h-12 bg-travel text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-travel/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center">
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
