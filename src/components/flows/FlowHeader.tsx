"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function FlowHeader() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Flow Analysis</h1>
        <div className="flex gap-2">
          <button className="grid h-8 w-8 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:bg-zinc-50">
            <ChevronLeft size={16} />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:bg-zinc-50">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <p className="text-sm font-medium text-zinc-500 max-w-2xl leading-relaxed">
        High-precision predictive trip mapping between Lyon&apos;s key transit hubs. Real-time directional metrics and network demand forecasting.
      </p>
    </div>
  );
}
