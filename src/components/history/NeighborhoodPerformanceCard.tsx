"use client";

import { BarChart3 } from "lucide-react";
import type { HeatmapPoint } from "@/lib/dashboard-api";

interface NeighborhoodPerformanceCardProps {
  heatmap?: HeatmapPoint[] | null;
}

export function NeighborhoodPerformanceCard({ heatmap }: NeighborhoodPerformanceCardProps) {
  const isRealData = Boolean(heatmap && heatmap.length > 0);

  const neighborhoods = isRealData
    ? [...heatmap!]
        .sort((a, b) => b.avg_fill_rate - a.avg_fill_rate)
        .slice(0, 5)
        .map((p, idx) => ({
          name: p.name,
          value: p.avg_fill_rate * 100,
          label: `${Math.round(p.avg_fill_rate * 100)}% d'occupation`,
          color: "#A61D24",
          opacity: 1 - idx * 0.15
        }))
    : [
        { name: "Part-Dieu", value: 84, label: "2.1M rentals", color: "#A61D24" },
        { name: "Bellecour", value: 72, label: "1.8M rentals", color: "#A61D24", opacity: 0.8 },
        { name: "Villeurbanne", value: 60, label: "1.5M rentals", color: "#A61D24", opacity: 0.6 },
        { name: "Hôtel de Ville", value: 48, label: "1.2M rentals", color: "#A61D24", opacity: 0.4 },
        { name: "Vieux Lyon", value: 36, label: "0.9M rentals", color: "#A61D24", opacity: 0.2 },
      ];

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          {isRealData ? "STATIONS LES PLUS SATURÉES (AUJOURD'HUI)" : "PERFORMANCE PAR QUARTIER"}
        </h3>
        <BarChart3 size={16} className="text-zinc-400" />
      </div>

      <div className="space-y-6">
        {neighborhoods.map((n) => (
          <div key={n.name} className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-zinc-800">{n.name}</span>
              <span className="text-zinc-500">{n.label}</span>
            </div>
            <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${n.value}%`,
                  backgroundColor: n.color,
                  opacity: n.opacity || 1
                }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

