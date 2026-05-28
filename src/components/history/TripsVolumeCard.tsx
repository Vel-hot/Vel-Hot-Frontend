"use client";

import { TrendingUp } from "lucide-react";

export function TripsVolumeCard() {
  const months = ["OCT '23", "JAN '24", "APR '24", "JUL '24", "SEP '24"];
  const bars = [40, 45, 35, 30, 50, 60, 55, 65, 75, 80, 55, 50, 58];

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
            VOLUME DE TRAJETS
          </p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-4xl font-black text-zinc-800">8,429,102</h2>
            <div className="flex items-center gap-1 text-[#2ea44f] font-bold text-sm">
              <TrendingUp size={14} />
              <span>+12.4%</span>
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
              height: `${height}%`,
              backgroundColor: i > 8 ? '#A61D24' : undefined,
              opacity: i > 8 ? 1 : undefined
            }}
          />
        ))}
      </div>
      
      <div className="flex justify-between mt-4 text-[9px] font-bold text-zinc-400 tracking-tighter">
        {months.map(month => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  );
}
