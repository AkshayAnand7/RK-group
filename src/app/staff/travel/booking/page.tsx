"use client";
import { useState } from "react";
import Link from "next/link";
import StaffLayout from "@/components/StaffLayout";
import { 
  Calendar, User, Phone, Car, MapPin, 
  ArrowRightLeft, CheckCircle, Loader2, AlertCircle, ChevronLeft
} from "lucide-react";
import { submitBooking } from "./actions";

export default function TravelBookingPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    staffName: "",
    customerName: "",
    customerNumber: "",
    vehicle: "",
    fromLocation: "",
    toLocation: "",
    tripType: "one-side"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await submitBooking(formData);
    setLoading(false);
    if (result.success) setSuccess(true);
    else alert(result.error);
  };

  if (success) {
    return (
      <StaffLayout module="travel" shopName="Travel Desk">
        <div className="p-6 text-center animate-fade-in pt-12">
          <div className="w-20 h-20 rounded-full bg-success-subtle flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Booking Confirmed!</h2>
          <p className="text-text-secondary mt-2">The trip has been scheduled and admin has been notified.</p>
          <div className="mt-10 space-y-3">
            <button onClick={() => window.location.reload()} className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 cursor-pointer">
              New Booking
            </button>
            <Link href="/staff/travel" className="block w-full py-4 bg-page text-text-secondary border border-border rounded-2xl font-bold text-center">
              Back to Travel Home
            </Link>
          </div>
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout module="travel" shopName="Travel Desk">
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/staff/travel" className="p-2 bg-surface border border-border rounded-xl">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black">New Booking</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pb-20">
          {/* Date & Staff */}
          <div className="grid grid-cols-2 gap-4">
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
                <input type="text" required placeholder="Name" value={formData.staffName} onChange={e => setFormData({...formData, staffName: e.target.value})} className="w-full h-12 pl-11 pr-4 bg-surface border border-border rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all" />
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-4 p-4 bg-primary/5 rounded-3xl border border-primary/10">
             <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Customer Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="text" required placeholder="Full Name" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full h-12 pl-11 pr-4 bg-surface border border-border rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Customer Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="tel" required placeholder="Phone Number" value={formData.customerNumber} onChange={e => setFormData({...formData, customerNumber: e.target.value})} className="w-full h-12 pl-11 pr-4 bg-surface border border-border rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all" />
              </div>
            </div>
          </div>

          {/* Vehicle & Trip Type */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Vehicle</label>
              <div className="relative">
                <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input type="text" required placeholder="Vehicle Name" value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})} className="w-full h-12 pl-11 pr-4 bg-surface border border-border rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all" />
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

          {/* Locations */}
          <div className="space-y-4 p-4 bg-page rounded-3xl border border-border">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">From Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-success" />
                <input type="text" required placeholder="Pickup Location" value={formData.fromLocation} onChange={e => setFormData({...formData, fromLocation: e.target.value})} className="w-full h-12 pl-11 pr-4 bg-surface border border-border rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">To Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-danger" />
                <input type="text" required placeholder="Destination" value={formData.toLocation} onChange={e => setFormData({...formData, toLocation: e.target.value})} className="w-full h-12 pl-11 pr-4 bg-surface border border-border rounded-2xl text-sm font-bold focus:border-primary outline-none transition-all" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirm Booking"}
          </button>
        </form>
      </div>
    </StaffLayout>
  );
}
