"use client";

import { RefreshCw } from "lucide-react";

interface HistoryHeaderProps {
  onRefresh?: () => void;
  loading?: boolean;
}

export function HistoryHeader({ onRefresh, loading }: HistoryHeaderProps) {
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
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-3 rounded-xl border border-[#A61D24]/10 bg-white px-6 py-3 shadow-sm hover:bg-zinc-50 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <RefreshCw size={16} className={`text-[#A61D24] ${loading ? "animate-spin" : ""}`} />
            <div className="text-left">
              <span className="block text-[9px] font-black uppercase tracking-widest text-[#A61D24]/60 leading-none">Données S3</span>
              <span className="block text-xs font-black text-zinc-800 uppercase tracking-widest mt-1">Rafraîchir</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

