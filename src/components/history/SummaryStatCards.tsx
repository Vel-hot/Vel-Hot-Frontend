"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { HeatmapPoint, PeakHour } from "@/lib/dashboard-api";

interface SummaryStatCardsProps {
  heatmap?: HeatmapPoint[] | null;
  peakHours?: PeakHour[] | null;
}

export function SummaryStatCards({ heatmap, peakHours }: SummaryStatCardsProps) {
  const isRealData = Boolean(heatmap && heatmap.length > 0);

  let stats = [];

  if (isRealData && heatmap) {
    // 1. Occupation moyenne
    const totalFillRate = heatmap.reduce((sum, p) => sum + p.avg_fill_rate, 0);
    const avgOccupancy = (totalFillRate / heatmap.length) * 100;

    // 2. Stations en alerte (docks ou vélos saturés: avg_fill_rate > 0.85 ou < 0.15)
    const alertCount = heatmap.filter(p => p.avg_fill_rate > 0.85 || p.avg_fill_rate < 0.15).length;

    // 3. Heure de pointe sur 7j
    const sortedPeak = peakHours ? [...peakHours].sort((a, b) => b.avg_fill_rate - a.avg_fill_rate) : [];
    const peakHour = sortedPeak[0]?.hour ?? 0;
    const peakRate = (sortedPeak[0]?.avg_fill_rate ?? 0) * 100;

    stats = [
      {
        label: "Occupation moyenne du réseau",
        value: `${avgOccupancy.toFixed(1)}%`,
        trend: "Statut Global",
        trendType: "neutral",
      },
      {
        label: "Stations sous surveillance",
        value: `${heatmap.length} stations`,
        trend: "Fichiers Parquet Silver",
        trendType: "up",
      },
      {
        label: "Stations saturées / vides",
        value: `${alertCount} stations`,
        trend: `${((alertCount / heatmap.length) * 100).toFixed(0)}% du réseau`,
        trendType: alertCount > (heatmap.length * 0.2) ? "down" : "up",
      },
      {
        label: "Heure de pointe constatée",
        value: peakHours ? `${peakHour}h00` : "--",
        trend: peakHours ? `${peakRate.toFixed(0)}% d'occup. max` : "Donnée indisponible",
        trendType: "up",
      },
    ];
  } else {
    stats = [
      {
        label: "Temps moyen trajet",
        value: "18.4 min",
        trend: "+2% vs LY",
        trendType: "up",
      },
      {
        label: "Vitesse moyenne",
        value: "14.2 km/h",
        trend: "No Change",
        trendType: "neutral",
      },
      {
        label: "CO2 Économisé",
        value: "4.2k tons",
        trend: "+18% Goal",
        trendType: "up",
      },
      {
        label: "Points de recharge",
        value: "458 units",
        trend: "++12 new",
        trendType: "up",
      },
    ];
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl bg-white p-6 shadow-lg border border-zinc-100">
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">
            {stat.label}
          </p>
          <p className="text-2xl font-black text-zinc-800 mb-2">{stat.value}</p>
          <div className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest ${
            stat.trendType === 'up' ? 'text-[#2ea44f]' : 
            stat.trendType === 'down' ? 'text-[#A61D24]' : 'text-zinc-400'
          }`}>
            {stat.trendType === 'up' && <TrendingUp size={10} />}
            {stat.trendType === 'down' && <TrendingDown size={10} />}
            <span>{stat.trend}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

