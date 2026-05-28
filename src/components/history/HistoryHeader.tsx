"use client";

import { Calendar, Download } from "lucide-react";

export function HistoryHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <h1 className="text-5xl font-black text-zinc-900 tracking-tight">
          Data Historique
        </h1>
        <p className="mt-4 text-sm font-medium text-zinc-500 max-w-2xl leading-relaxed">
          An editorial review of the Lyon Velo&apos;v ecosystem. Cross-referencing usage patterns with urban developments and meteorological impacts to predict future network elasticity.
        </p>
      </div>

      <div className="flex gap-4">
        <button className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-6 py-3 shadow-sm hover:bg-zinc-50 transition-colors">
          <Calendar size={18} className="text-[#A61D24]" />
          <div className="text-left">
            <span className="block text-[9px] font-black uppercase tracking-widest text-zinc-400 leading-none">Last 12</span>
            <span className="block text-xs font-black text-zinc-800 uppercase tracking-widest mt-1">Months</span>
          </div>
        </button>

        <button className="flex items-center gap-4 rounded-xl bg-[#A61D24] px-8 py-3 text-white shadow-lg shadow-red-900/20 hover:scale-105 active:scale-95 transition-all">
          <Download size={24} />
          <span className="text-xs font-black uppercase tracking-widest">Export</span>
        </button>
      </div>
    </div>
  );
}
