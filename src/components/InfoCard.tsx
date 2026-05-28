"use client";

import { TrendingUp } from "lucide-react";

type InfoCardProps = {
  dataSourceLabel: string;
  lastSync: Date | null;
  stationCount: number;
  bottomOffsetPx?: number;
};

export function InfoCard({
  dataSourceLabel,
  lastSync,
  stationCount,
  bottomOffsetPx = 136,
}: InfoCardProps) {
  return (
    <article
      className="absolute right-6 z-20 w-[345px] rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_18px_35px_-25px_rgba(0,0,0,0.65)]"
      style={{ bottom: bottomOffsetPx }}
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-zinc-600" />
        <h2 className="text-sm font-bold tracking-wide text-zinc-800">INTENSITÉ DU FLUX</h2>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-[10px] font-semibold text-zinc-600">
          Source: {dataSourceLabel}
          {lastSync && (
            <span className="ml-2 text-zinc-500">• Sync {lastSync.toLocaleTimeString("fr-FR")}</span>
          )}
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-[10px] font-semibold text-zinc-600">
          Stations actives: {stationCount}
        </div>

        <div className="border-t border-zinc-200 pt-4">
          <p className="text-[10px] font-bold tracking-[0.14em] text-zinc-400">
            LÉGENDE THERMIQUE
          </p>
          <div className="mt-3 h-2 rounded-full bg-gradient-to-r from-[#2ea44f] via-[#f59e0b] to-[#ef4444]" />
          <div className="mt-2 flex items-center justify-between text-[9px] font-bold tracking-wide text-zinc-500">
            <span>BASSE</span>
            <span>MOYENNE</span>
            <span>SATURÉ</span>
          </div>
        </div>
      </div>
    </article>
  );
}
