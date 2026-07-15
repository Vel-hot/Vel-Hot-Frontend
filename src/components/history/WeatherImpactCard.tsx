"use client";

import { Info } from "lucide-react";

export function WeatherImpactCard() {
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const data = [
    { usage: 80, rain: 20 },
    { usage: 40, rain: 60 },
    { usage: 70, rain: 30 },
    { usage: 85, rain: 15 },
    { usage: 90, rain: 10 },
    { usage: 60, rain: 40 },
    { usage: 75, rain: 25 },
  ];

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl relative overflow-hidden">
      {/* Overlay Bientôt disponible */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center z-10 transition-all duration-300">
        <div className="text-center p-6 bg-white/90 border border-zinc-200/80 rounded-2xl shadow-xl max-w-[240px]">
          <p className="text-xs font-black tracking-widest text-[#A61D24] uppercase mb-1">
            Bientôt disponible
          </p>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider leading-relaxed">
            Intégration de l'impact météo sur l'usage en cours de développement
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
          IMPACT MÉTÉO VS USAGE
        </h3>
        <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-[#A61D24]" />
            <span className="text-zinc-800">Usage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-[#1a4a5e]" />
            <span className="text-zinc-500">Rain (MM)</span>
          </div>
        </div>
      </div>
      <p className="text-[9px] font-bold text-zinc-400 mb-8 uppercase tracking-widest">
        Correlation: Negative for Precipitation (-0.82)
      </p>

      <div className="flex justify-between items-end h-48 mb-6">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <div className="w-4 flex flex-col items-center justify-end h-full gap-1">
               <div 
                className="w-full bg-[#1a4a5e] opacity-40 rounded-full" 
                style={{ height: `${d.rain}%` }} 
              />
              <div 
                className="w-full bg-[#A61D24] rounded-full" 
                style={{ height: `${d.usage}%` }} 
              />
            </div>
            <span className="text-[9px] font-black text-zinc-400">{days[i]}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#A61D24]/5 p-4 flex gap-3 border border-[#A61D24]/10">
        <Info size={16} className="text-[#A61D24] shrink-0 mt-0.5" />
        <p className="text-[10px] leading-relaxed font-bold text-zinc-800">
          <span className="text-[#A61D24] uppercase">Analyst Note:</span> PROLONGED RAINFALL EXCEEDING 5MM/HR TRIGGERS A 65% DROP IN CASUAL USAGE, WHILE SUBSCRIBER USAGE REMAINS STABLE WITHIN A 15% VARIANCE, SUGGESTING HIGH COMMUTER RESILIENCE.
        </p>
      </div>
    </div>
  );
}
