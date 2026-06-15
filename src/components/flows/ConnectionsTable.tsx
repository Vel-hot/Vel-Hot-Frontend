"use client";

const CONNECTIONS = [
  {
    id: "01",
    route: "Bellecour to Part-Dieu",
    desc: "Major Commuter Path",
    duration: "14.2 min",
    electric: 65,
    peak: "08:15 AM",
    trend: "+12.4%",
    trendType: "up",
  },
  {
    id: "02",
    route: "Guillotière to Jean Macé",
    desc: "Student Transit",
    duration: "9.5 min",
    electric: 42,
    peak: "05:30 PM",
    trend: "+8.1%",
    trendType: "up",
  },
  {
    id: "03",
    route: "Vieux Lyon to Bellecour",
    desc: "Leisure & Shopping",
    duration: "6.8 min",
    electric: 30,
    peak: "02:00 PM",
    trend: "-2.5%",
    trendType: "down",
  },
  {
    id: "04",
    route: "Charpennes to Part-Dieu",
    desc: "Intermodal Hub Connection",
    duration: "11.4 min",
    electric: 78,
    peak: "07:45 AM",
    trend: "+21.0%",
    trendType: "up",
  },
];

export function ConnectionsTable() {
  return (
    <div>
      <h2 className="text-2xl font-black text-zinc-900 mb-2">Top 10 Connections</h2>
      <p className="text-sm font-medium text-zinc-500 mb-8">Extended metric analysis for high-volume network pairs.</p>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 border-b border-zinc-100">
              <th className="pb-4 font-black">Route Segment</th>
              <th className="pb-4 font-black">Avg. Duration</th>
              <th className="pb-4 font-black">Electric Usage</th>
              <th className="pb-4 font-black">Peak Surge</th>
              <th className="pb-4 font-black text-right">Trend Index</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {CONNECTIONS.map((conn) => (
              <tr key={conn.id} className="group hover:bg-zinc-50/50 transition-colors">
                <td className="py-6">
                  <div className="flex items-center gap-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#A61D24]/5 text-[10px] font-black text-[#A61D24]">
                      {conn.id}
                    </span>
                    <div>
                      <p className="text-sm font-black text-zinc-800">{conn.route}</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{conn.desc}</p>
                    </div>
                  </div>
                </td>
                <td className="py-6 text-sm font-bold text-zinc-600">{conn.duration}</td>
                <td className="py-6">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-24 bg-zinc-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#1a4a5e] rounded-full" 
                        style={{ width: `${conn.electric}%` }} 
                      />
                    </div>
                    <span className="text-[10px] font-black text-zinc-800">{conn.electric}%</span>
                  </div>
                </td>
                <td className="py-6 text-sm font-bold text-zinc-600">{conn.peak}</td>
                <td className="py-6 text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                    conn.trendType === 'up' ? 'bg-[#2ea44f]/10 text-[#2ea44f]' : 'bg-[#A61D24]/10 text-[#A61D24]'
                  }`}>
                    {conn.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
