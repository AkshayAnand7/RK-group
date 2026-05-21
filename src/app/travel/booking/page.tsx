"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import StaffLayout from "@/components/StaffLayout";
import { 
  Calendar, User, Phone, Car, MapPin, 
  ArrowRightLeft, CheckCircle, Loader2, AlertCircle, ChevronLeft,
  Clock, Check, X as Close, IndianRupee
} from "lucide-react";
import { submitBooking, getBookings, updateBookingStatus } from "./actions";
import { getVehicles } from "../trips/actions";
import { getUsers } from "@/app/admin/users/actions";

export default function TravelBookingPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [upcomingRides, setUpcomingRides] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    staffName: "",
    customerName: "",
    customerNumber: "",
    vehicle: "",
    fromLocation: "",
    toLocation: "",
    tripType: "one-side",
    totalAmount: "",
    receivedAmount: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [ridesData, vehiclesData, staffData] = await Promise.all([
      getBookings(),
      getVehicles(),
      getUsers()
    ]);
    setUpcomingRides(ridesData || []);
    setVehicles(vehiclesData || []);
    setStaff(staffData || []);
  }

  async function handleStatusUpdate(id: number, status: string) {
    const result = await updateBookingStatus(id, status);
    if (result.success) fetchData();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await submitBooking(formData);
    setLoading(true); // Wait for revalidation
    if (result.success) {
      setSuccess(true);
      fetchData();
    } else alert(result.error);
    setLoading(false);
  };

  if (success) {
    return (
      <StaffLayout module="travel" shopName="Travel Desk">
        <div className="p-6 text-center scroll-reveal pt-12">
          <div className="w-20 h-20 rounded-full bg-success-subtle flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Booking Saved!</h2>
          <p className="text-text-secondary mt-2">The trip has been saved as PENDING and admin has been notified via WhatsApp.</p>
          <div className="mt-10 space-y-3">
            <button onClick={() => { setSuccess(false); setFormData({...formData, customerName: "", customerNumber: "", fromLocation: "", toLocation: "", totalAmount: "", receivedAmount: ""}) }} className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 cursor-pointer">
              New Booking
            </button>
            <Link href="/travel/trips" className="block w-full py-4 bg-page text-text-secondary border border-border rounded-2xl font-bold text-center">
              View All Trips
            </Link>
          </div>
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout module="travel" shopName="Travel Desk">
      <div className="p-4 space-y-6 scroll-reveal">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/travel" className="p-2 bg-surface border border-border rounded-xl">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black">Bookings</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date & Staff */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full h-12 pl-11 pr-4 bg-surface border border-border rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Staff Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <select 
                  required 
                  value={formData.staffName} 
                  onChange={e => setFormData({...formData, staffName: e.target.value})} 
                  className="w-full h-12 pl-11 pr-4 bg-surface border border-border rounded-2xl text-sm font-bold appearance-none focus:border-primary outline-none transition-all cursor-pointer"
                >
                  <option value="">Select Staff</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.full_name}>{s.full_name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4 bg-primary/5 rounded-3xl border border-primary/10">
             <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Customer Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="text" required placeholder="Full Name" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full h-12 pl-11 pr-4 bg-surface border border-border rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input type="tel" required placeholder="Number" value={formData.customerNumber} onChange={e => setFormData({...formData, customerNumber: e.target.value})} className="w-full h-12 pl-11 pr-4 bg-surface border border-border rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Total (₹)</label>
                  <input type="number" placeholder="0" value={formData.totalAmount} onChange={e => setFormData({...formData, totalAmount: e.target.value})} className="w-full h-12 px-3 bg-surface border border-border rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Recvd (₹)</label>
                  <input type="number" placeholder="0" value={formData.receivedAmount} onChange={e => setFormData({...formData, receivedAmount: e.target.value})} className="w-full h-12 px-3 bg-surface border border-border rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Vehicle</label>
              <div className="relative">
                <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <select 
                  required 
                  value={formData.vehicle} 
                  onChange={e => setFormData({...formData, vehicle: e.target.value})} 
                  className="w-full h-12 pl-11 pr-4 bg-surface border border-border rounded-2xl text-sm font-bold appearance-none focus:border-primary outline-none transition-all cursor-pointer"
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.vehicle_number}>{v.vehicle_number} ({v.model || 'Winger'})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Trip Type</label>
              <div className="relative">
                <ArrowRightLeft className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <select value={formData.tripType} onChange={e => setFormData({...formData, tripType: e.target.value})} className="w-full h-12 pl-11 pr-4 bg-surface border border-border rounded-2xl text-sm font-bold appearance-none focus:border-primary outline-none transition-all">
                  <option value="one-side">One Side</option>
                  <option value="round">Round Trip</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4 bg-page rounded-3xl border border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">From</label>
                <input type="text" required placeholder="Pickup" value={formData.fromLocation} onChange={e => setFormData({...formData, fromLocation: e.target.value})} className="w-full h-12 px-4 bg-surface border border-border rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">To</label>
                <input type="text" required placeholder="Drop" value={formData.toLocation} onChange={e => setFormData({...formData, toLocation: e.target.value})} className="w-full h-12 px-4 bg-surface border border-border rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Save Booking"}
          </button>
        </form>

        {/* Upcoming Rides Section */}
        <div className="pt-8 pb-10 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Upcoming Rides
            </h2>
            <span className="text-[10px] font-bold text-text-muted">{upcomingRides.length} active</span>
          </div>

          <div className="space-y-4 scroll-stagger">
            {upcomingRides.map((ride) => (
              <div key={ride.id} className="glass p-5 rounded-3xl border border-border shadow-lg relative overflow-hidden group">
                <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-xl text-[8px] font-black uppercase tracking-tighter ${
                  ride.status === 'accepted' ? 'bg-success text-white' : 
                  ride.status === 'rejected' ? 'bg-danger text-white' : 'bg-primary/20 text-primary'
                }`}>
                  {ride.status}
                </div>

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-text-primary">{ride.customer_name}</h3>
                    <p className="text-xs text-text-muted">{ride.customer_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-primary uppercase">{ride.vehicle}</p>
                    <p className="text-[10px] font-bold text-text-muted">{new Date(ride.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm font-bold text-text-secondary bg-page p-3 rounded-2xl mb-4">
                  <span className="truncate">{ride.from_location}</span>
                  <ArrowRightLeft className="w-3 h-3 shrink-0" />
                  <span className="truncate">{ride.to_location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-muted font-black uppercase tracking-widest">Total</span>
                      <span className="text-text-primary font-black">₹{ride.total_amount || 0}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-muted font-black uppercase tracking-widest">Received</span>
                      <span className="text-emerald-600 font-black">₹{ride.received_amount || 0}</span>
                    </div>
                  </div>
                  
                  {ride.status === 'pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStatusUpdate(ride.id, 'rejected')}
                        className="p-2 bg-danger-subtle text-danger rounded-xl hover:bg-danger hover:text-white transition-all"
                      >
                        <Close className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(ride.id, 'accepted')}
                        className="p-2 bg-success-subtle text-success rounded-xl hover:bg-success hover:text-white transition-all"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {upcomingRides.length === 0 && (
              <div className="py-10 text-center text-text-muted text-sm italic">
                No upcoming bookings found
              </div>
            )}
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
