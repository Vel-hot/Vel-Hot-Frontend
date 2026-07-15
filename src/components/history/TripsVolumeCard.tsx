"use client";

import { TrendingUp } from "lucide-react";
import type { PeakHour } from "@/lib/dashboard-api";

interface TripsVolumeCardProps {
  peakHours?: PeakHour[] | null;
}

export function TripsVolumeCard({ peakHours }: TripsVolumeCardProps) {
  const isRealData = Boolean(peakHours && peakHours.length > 0);

  // Pour 24 heures ou fallbacks
  const bars = isRealData
    ? peakHours!.map((ph) => ph.avg_fill_rate * 100)
    : [40, 45, 35, 30, 50, 60, 55, 65, 75, 80, 55, 50, 58];

  const labels = isRealData
    ? ["00h00", "04h00", "08h00", "12h00", "16h00", "20h00", "23h00"]
    : ["OCT '23", "JAN '24", "APR '24", "JUL '24", "SEP '24"];

  const averageOccupancy = isRealData
    ? peakHours!.reduce((sum, ph) => sum + ph.avg_fill_rate, 0) / peakHours!.length
    : 0.542; // default simulated

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
            {isRealData ? "TAUX D'OCCUPATION DU RÉSEAU PAR HEURE (7j)" : "VOLUME DE TRAJETS"}
          </p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl font-black text-zinc-800">
              {isRealData ? `${(averageOccupancy * 100).toFixed(1)}%` : "8,429,102"}
            </h2>
            <div className="flex items-center gap-1 text-[#2ea44f] font-bold text-sm">
              <TrendingUp size={14} />
              <span>{isRealData ? "Taux moyen" : "+12.4%"}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-[#A61D24]" />
          <div className="h-3 w-3 rounded-full bg-[#1a4a5e]" />
        </div>
      </div>

      <div className="relative h-64 flex items-end gap-2">
        {bars.map((height, i) => (
          <div
            key={i}
            className="flex-1 bg-[#A61D24] rounded-t-sm opacity-20 hover:opacity-100 transition-opacity cursor-pointer"
            style={{ 
              height: `${Math.max(4, height)}%`,
              backgroundColor: isRealData 
                ? (height > 50 ? "#A61D24" : "#1a4a5e")
                : (i > 8 ? '#A61D24' : undefined),
              opacity: isRealData 
                ? (height > 50 ? 0.8 : 0.6)
                : (i > 8 ? 1 : undefined)
            }}
            title={isRealData && peakHours ? `Heure: ${peakHours[i]?.hour}h - Taux: ${(height).toFixed(1)}%` : undefined}
          />
        ))}
      </div>
      
      <div className="flex justify-between mt-4 text-[9px] font-bold text-zinc-400 tracking-tighter">
        {labels.map(lbl => (
          <span key={lbl}>{lbl}</span>
        ))}
      </div>
    </div>
  );
}

