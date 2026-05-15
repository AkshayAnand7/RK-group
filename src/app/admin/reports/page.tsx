"use client";
import { useState } from "react";
import { FileText, Download, Calendar, Store, Bus, Filter } from "lucide-react";

const reportTypes = [
  { id: "daily", label: "Daily Report", desc: "Today's complete business summary", icon: Calendar, formats: ["PDF", "Excel"] },
  { id: "monthly", label: "Monthly Report", desc: "Month-wise aggregated data", icon: Calendar, formats: ["PDF", "Excel"] },
  { id: "shop", label: "Shop Report", desc: "Individual shop performance", icon: Store, formats: ["PDF", "Excel"] },
  { id: "vehicle", label: "Vehicle Report", desc: "Vehicle-wise expense breakdown", icon: Bus, formats: ["PDF"] },
  { id: "financial", label: "Financial Statement", desc: "Complete P&L statement", icon: FileText, formats: ["Excel"] },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("month");
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = async (id: string, format: string) => {
    setGenerating(`${id}-${format}`);
    await new Promise(r => setTimeout(r, 1500));
    setGenerating(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-text-secondary mt-1">Generate and export business reports</p>
      </div>

      {/* Date Range */}
      <div className="bg-surface rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Filter className="w-4 h-4" /> Date Range:
        </div>
        <div className="flex flex-wrap gap-1 p-1 bg-page rounded-lg">
          {[{ v: "today", l: "Today" }, { v: "week", l: "This Week" }, { v: "month", l: "This Month" }, { v: "custom", l: "Custom" }].map(p => (
            <button key={p.v} onClick={() => setDateRange(p.v)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${dateRange === p.v ? "bg-surface text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"}`}>
              {p.l}
            </button>
          ))}
        </div>
        {dateRange === "custom" && (
          <div className="flex gap-2 animate-fade-in">
            <input type="date" className="h-9 px-3 bg-page border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
            <span className="text-text-muted self-center">to</span>
            <input type="date" className="h-9 px-3 bg-page border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
        )}
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reportTypes.map(report => (
          <div key={report.id} className="bg-surface rounded-xl border border-border p-5 hover:shadow-md transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-primary-subtle flex items-center justify-center mb-4">
              <report.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">{report.label}</h3>
            <p className="text-xs text-text-secondary mb-4">{report.desc}</p>
            <div className="flex gap-2">
              {report.formats.map(fmt => (
                <button key={fmt} onClick={() => handleGenerate(report.id, fmt)} disabled={generating === `${report.id}-${fmt}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-page border border-border rounded-lg text-xs font-medium hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer disabled:opacity-60">
                  <Download className="w-3 h-3" />
                  {generating === `${report.id}-${fmt}` ? "Generating..." : fmt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
