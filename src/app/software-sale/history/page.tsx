"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Monitor, ArrowLeft, History, 
  Search, Download, ExternalLink, Calendar
} from "lucide-react";
import { getSoftwareSalesHistory } from "../actions";

export default function SoftwareSaleHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getSoftwareSalesHistory();
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-page flex flex-col items-center py-6 sm:py-12 px-4 sm:px-6">
      <div className="fixed inset-0 -z-10 bg-mesh opacity-20" />

      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="flex items-center gap-6">
            <Link href="/software-sale" className="p-3 bg-white shadow-lg rounded-2xl hover:scale-110 transition-transform">
              <ArrowLeft className="w-5 h-5 text-text-muted" />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <History className="w-5 h-5 text-slate-800" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Reporting Portal</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-text-primary uppercase tracking-tight">Sale <span className="text-slate-800">History</span></h1>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="glass p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white shadow-xl">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Total Entries</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-800">{history.length}</p>
          </div>
          <div className="glass p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white shadow-xl">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Total Revenue</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-800">₹ {history.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}</p>
          </div>
          <div className="glass p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white shadow-xl">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Pending Balance</p>
            <p className="text-2xl sm:text-3xl font-black text-danger">₹ {history.reduce((acc, curr) => acc + curr.balance, 0).toLocaleString()}</p>
          </div>
        </div>

        {/* History Table */}
        <div className="glass rounded-3xl sm:rounded-4xl border border-white shadow-2xl overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-5 whitespace-nowrap">Period</th>
                  <th className="px-6 py-5 whitespace-nowrap">Shop</th>
                  <th className="px-6 py-5 whitespace-nowrap">Agent</th>
                  <th className="px-6 py-5 whitespace-nowrap text-right">SW Sale 1</th>
                  <th className="px-6 py-5 whitespace-nowrap text-right">WhatsApp</th>
                  <th className="px-6 py-5 whitespace-nowrap text-right">Total</th>
                  <th className="px-6 py-5 whitespace-nowrap text-right">Win</th>
                  <th className="px-6 py-5 whitespace-nowrap text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-slate-800 border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Loading history...</p>
                      </div>
                    </td>
                  </tr>
                ) : history.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center">
                      <p className="text-sm font-bold text-text-muted uppercase tracking-widest">No sales records found</p>
                    </td>
                  </tr>
                ) : (
                  history.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-text-primary whitespace-nowrap">{new Date(sale.date_from).toLocaleDateString()}</span>
                          <span className="text-[10px] font-medium text-text-muted whitespace-nowrap">to {new Date(sale.date_to).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-black text-slate-800 uppercase tracking-tight whitespace-nowrap">{sale.shop_name}</span>
                      </td>
                      <td className="px-6 py-5 text-sm text-text-secondary whitespace-nowrap">{sale.agent_name || '-'}</td>
                      <td className="px-6 py-5 font-mono-nums text-sm text-right">₹{sale.software_sale_1 || sale.rapido_sale || 0}</td>
                      <td className="px-6 py-5 font-mono-nums text-sm text-right">₹{sale.whatsapp_total || sale.whatsapp_sale || 0}</td>
                      <td className="px-6 py-5 font-mono-nums text-sm font-black text-slate-800 text-right">₹{sale.total}</td>
                      <td className="px-6 py-5 font-mono-nums text-sm text-success text-right">₹{sale.win_amount}</td>
                      <td className="px-6 py-5 font-mono-nums text-sm font-black text-danger text-right">₹{sale.balance}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
