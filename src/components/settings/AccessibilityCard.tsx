"use client";

import React from "react";
import { Eye } from "lucide-react";
import { Toggle } from "@/components/ui/Toggle";

interface AccessibilityCardProps {
  active: boolean;
  onToggle: () => void;
}

export function AccessibilityCard({ active, onToggle }: AccessibilityCardProps) {
  return (
    <div className="rounded-3xl bg-[#dfe1e6] p-8 text-zinc-900 shadow-lg border border-zinc-200">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye size={18} className="text-[#A61D24]" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Accessibilité</h3>
        </div>
        <Toggle active={active} onToggle={onToggle} />
      </div>

      <p className="text-xs leading-relaxed text-zinc-600 mb-6">
        Mode Daltonien : Optimisation des contrastes pour protanopes et deutéranopes.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-white/40 shadow-inner">
        <div className="relative h-40 w-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-20">
            {Array.from({ length: 72 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-white" />
            ))}
          </div>
          <div className="absolute bottom-4 left-4 text-[10px] font-black uppercase tracking-widest text-white drop-shadow-md">
            Preview: High Contrast Grid
          </div>
        </div>
      </div>
    </div>
  );
}
