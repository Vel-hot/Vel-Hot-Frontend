"use client";

import { BarChart3 } from "lucide-react";

export function NeighborhoodPerformanceCard() {
  const neighborhoods = [
    { name: "Part-Dieu", value: 2.1, color: "#A61D24" },
    { name: "Bellecour", value: 1.8, color: "#A61D24", opacity: 0.8 },
    { name: "Villeurbanne", value: 1.5, color: "#A61D24", opacity: 0.6 },
    { name: "Hôtel de Ville", value: 1.2, color: "#A61D24", opacity: 0.4 },
    { name: "Vieux Lyon", value: 0.9, color: "#A61D24", opacity: 0.2 },
  ];

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          PERFORMANCE PAR QUARTIER
        </h3>
        <BarChart3 size={16} className="text-zinc-400" />
      </div>

      <div className="space-y-6">
        {neighborhoods.map((n) => (
          <div key={n.name} className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-zinc-800">{n.name}</span>
              <span className="text-zinc-500">{n.value}M rentals</span>
            </div>
            <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${(n.value / 2.5) * 100}%`,
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
