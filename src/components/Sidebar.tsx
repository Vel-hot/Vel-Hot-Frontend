"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  LogOut,
  Map,
  Settings,
  TrendingUp,
} from "lucide-react";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex shrink-0 flex-col bg-[#f5f6f8] transition-all duration-300 ${
        collapsed ? "w-[86px]" : "w-[250px]"
      }`}
    >
      <div
        className={`border-b border-zinc-200 py-5 transition-all duration-300 ${
          collapsed ? "flex flex-col items-center gap-3 px-3" : "flex items-center justify-between px-6"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#A61D24] text-xs font-bold uppercase tracking-wide text-white">
            VH
          </div>
          <h1
            className={`text-[34px] font-black tracking-tight text-[#A61D24] transition-all duration-300 ${
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            {"V\u00e9l'Hot"}
          </h1>
        </div>

        <button
          aria-label={collapsed ? "Deplier le menu" : "Replier le menu"}
          onClick={() => setCollapsed((value) => !value)}
          className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div
        className={`transition-all duration-300 ${
          collapsed ? "h-0 overflow-hidden px-0 py-0 opacity-0" : "px-6 py-5 opacity-100"
        }`}
      >
        <p className="text-xs font-bold tracking-[0.18em] text-[#A61D24]">LYON NETWORK</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-zinc-500">Predictive Cartesian</p>
      </div>

      <nav className="space-y-1 px-3">
        <SidebarNavButton icon={Map} label="LIVE MAP" active collapsed={collapsed} />
        <SidebarNavButton icon={TrendingUp} label="PREDICTIONS" collapsed={collapsed} />
        <SidebarNavButton icon={Settings} label="SETTINGS" collapsed={collapsed} />
      </nav>

      <div className="mt-auto space-y-2 px-6 pb-6 text-xs font-semibold text-zinc-500">
        <SidebarFooterButton icon={CircleHelp} label="HELP" collapsed={collapsed} />
        <SidebarFooterButton icon={LogOut} label="LOGOUT" collapsed={collapsed} />
      </div>
    </aside>
  );
}

type SidebarNavButtonProps = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  collapsed: boolean;
};

function SidebarNavButton({ icon: Icon, label, active, collapsed }: SidebarNavButtonProps) {
  const base =
    "flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold transition";
  const activeStyles = "border-l-[3px] border-[#A61D24] bg-white text-[#A61D24]";
  const inactiveStyles = "text-zinc-600 hover:bg-zinc-100";
  const collapsedStyles = "justify-center px-0";

  return (
    <button
      aria-label={label}
      className={`${base} ${active ? activeStyles : inactiveStyles} ${
        collapsed ? collapsedStyles : "gap-3"
      }`}
    >
      <Icon size={16} />
      <span className={collapsed ? "sr-only" : "whitespace-nowrap"}>{label}</span>
    </button>
  );
}

type SidebarFooterButtonProps = {
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
};

function SidebarFooterButton({ icon: Icon, label, collapsed }: SidebarFooterButtonProps) {
  return (
    <button
      aria-label={label}
      className={`flex items-center gap-2 transition hover:text-zinc-700 ${
        collapsed ? "justify-center" : ""
      }`}
    >
      <Icon size={14} />
      <span className={collapsed ? "sr-only" : ""}>{label}</span>
    </button>
  );
}
