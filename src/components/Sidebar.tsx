"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
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

import { useAuth } from "@/components/auth/AuthProvider";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    router.push("/login");
  };

  return (
    <aside
      className={`flex shrink-0 flex-col bg-[#f5f6f8] transition-all duration-300 ${
        collapsed ? "w-20" : "w-70"
      }`}
    >
      <div
        className={`border-b border-zinc-200 py-6 transition-all duration-300 ${
          collapsed ? "flex flex-col items-center gap-6 px-2" : "flex items-center justify-between px-6"
        }`}
      >
        <div className={collapsed ? "flex items-center" : "flex items-center gap-3"}>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#A61D24] text-xs font-bold uppercase tracking-wide text-white">
            VH
          </div>
          <h1
            className={`text-[28px] font-black tracking-tight text-[#A61D24] transition-all duration-300 ${
              collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
            }`}
          >
            {"V\u00e9l'Hot"}
          </h1>
        </div>

        <button
          aria-label={collapsed ? "Deplier le menu" : "Replier le menu"}
          onClick={() => setCollapsed((value) => !value)}
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-transform ${
            collapsed ? "" : "hover:scale-105"
          }`}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div
        className={`transition-all duration-300 ${
          collapsed ? "h-0 overflow-hidden px-0 py-0 opacity-0" : "px-8 py-6 opacity-100"
        }`}
      >
        <p className="text-xs font-bold tracking-[0.18em] text-[#A61D24]">LYON NETWORK</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-zinc-500">Predictive Cartesian</p>
      </div>

      <nav className={`space-y-2 transition-all duration-300 ${collapsed ? "px-2 pt-4" : "px-4"}`}>
        <SidebarNavLink href="/" icon={Map} label="LIVE MAP" active={pathname === "/"} collapsed={collapsed} />
        <SidebarNavLink href="/history" icon={TrendingUp} label="DATA HISTORIQUE" active={pathname === "/history"} collapsed={collapsed} />
        <SidebarNavLink href="/settings" icon={Settings} label="SETTINGS" active={pathname === "/settings"} collapsed={collapsed} />
      </nav>


      <div
        className={`mt-auto space-y-4 pb-8 text-xs font-semibold text-zinc-500 transition-all duration-300 ${
          collapsed ? "flex flex-col items-center px-2" : "px-8"
        }`}
      >
        {isAuthenticated && user ? (
          <div className={collapsed ? "flex flex-col items-center gap-3" : "space-y-3"}>
            <div className={`rounded-2xl border border-zinc-200 bg-white px-4 py-3 ${collapsed ? "text-center" : ""}`}>
              <p className="text-[10px] font-bold tracking-[0.16em] text-[#A61D24]">CONNECTÉ</p>
              <p className={`mt-1 text-sm font-semibold text-zinc-800 ${collapsed ? "sr-only" : ""}`}>
                {user.prenom} {user.nom}
              </p>
              <p className={`text-[11px] text-zinc-500 ${collapsed ? "sr-only" : ""}`}>{user.email}</p>
            </div>
            <SidebarFooterButton icon={LogOut} label="LOGOUT" collapsed={collapsed} onClick={handleLogout} />
          </div>
        ) : (
          <div className={collapsed ? "flex flex-col items-center gap-2" : "space-y-2"}>
            <Link
              href="/login"
              className={`flex items-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-700 transition hover:bg-zinc-50 ${
                collapsed ? "justify-center px-0" : "gap-2"
              }`}
              aria-label="Connexion"
            >
              <LogOut size={14} />
              <span className={collapsed ? "sr-only" : ""}>Connexion</span>
            </Link>
            <Link
              href="/register"
              className={`flex items-center rounded-xl bg-[#A61D24] px-4 py-3 text-white transition hover:opacity-95 ${
                collapsed ? "justify-center px-0" : "gap-2"
              }`}
              aria-label="Inscription"
            >
              <span className={collapsed ? "sr-only" : ""}>Inscription</span>
            </Link>
          </div>
        )}

        <SidebarFooterButton icon={CircleHelp} label="HELP" collapsed={collapsed} />
      </div>
    </aside>
  );
}

type SidebarNavLinkProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
  collapsed: boolean;
};

function SidebarNavLink({ href, icon: Icon, label, active, collapsed }: SidebarNavLinkProps) {
  const base =
    "flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold transition";
  const activeStyles = "border-l-[3px] border-[#A61D24] bg-white text-[#A61D24]";
  const inactiveStyles = "text-zinc-600 hover:bg-zinc-100";
  const collapsedStyles = "justify-center px-0";

  return (
    <Link
      href={href}
      aria-label={label}
      className={`${base} ${active ? activeStyles : inactiveStyles} ${
        collapsed ? collapsedStyles : "gap-3"
      }`}
    >
      <Icon size={16} />
      <span className={collapsed ? "sr-only" : "whitespace-nowrap"}>{label}</span>
    </Link>
  );
}

function SidebarFooterButton({ icon: Icon, label, collapsed, onClick }: SidebarFooterButtonProps) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`flex items-center gap-2 transition hover:text-zinc-700 ${
        collapsed ? "justify-center" : ""
      }`}
    >
      <Icon size={14} />
      <span className={collapsed ? "sr-only" : ""}>{label}</span>
    </button>
  );
}

type SidebarFooterButtonProps = {
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
};
