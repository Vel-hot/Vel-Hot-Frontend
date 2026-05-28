"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

export function SummaryStatCards() {
  const stats = [
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
