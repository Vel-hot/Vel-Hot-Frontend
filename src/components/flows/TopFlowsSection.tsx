"use client";

const FLOWS = [
  {
    from: "Station Bellecour",
    to: "Part-Dieu",
    count: 850,
    tag: "Core Business Axis",
    image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=400&h=300",
  },
  {
    from: "Hôtel de Ville",
    to: "Croix-Rousse",
    count: 612,
    tag: "Uphill Gradient Flow",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400&h=300",
  },
  {
    from: "Perrache",
    to: "Confluence",
    count: 488,
    tag: "Urban Renewal Corridor",
    image: "https://images.unsplash.com/photo-1513346940221-6f673d962e97?auto=format&fit=crop&q=80&w=400&h=300",
  },
];

export function TopFlowsSection() {
  return (
    <div className="mb-12">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">LIVE INTELLIGENCE</p>
      <h2 className="text-2xl font-black text-zinc-900 mb-8">Top Today&apos;s Flows</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FLOWS.map((flow, i) => (
          <div key={i} className="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-xl transition-all hover:scale-[1.02]">
            <div className="relative h-48 overflow-hidden">
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={flow.image} 
                alt={`${flow.from} to ${flow.to}`}
                className="h-full w-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-[#A61D24]" />
                   <div className="h-[1px] w-8 bg-white/50" />
                   <div className="h-2 w-2 rounded-full bg-[#1a4a5e]" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-black text-zinc-800">
                  {flow.from} → {flow.to}
                </h3>
                <span className="text-2xl font-black text-[#A61D24]">{flow.count}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-zinc-400">{flow.tag}</span>
                <span className="text-zinc-500">Trips Today</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
