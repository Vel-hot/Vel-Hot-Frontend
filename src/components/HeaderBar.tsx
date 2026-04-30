"use client";

import type { ReactNode } from "react";
import { Bell, Settings } from "lucide-react";

export function HeaderBar() {
  return (
    <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-end px-8 py-6">
      <div className="flex items-center gap-3 text-zinc-600">
        <HeaderIconButton ariaLabel="Notifications">
          <Bell size={16} />
        </HeaderIconButton>
        <HeaderIconButton ariaLabel="Settings">
          <Settings size={16} />
        </HeaderIconButton>
        <button
          aria-label="Profil utilisateur"
          className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/90 bg-white text-xs font-bold text-zinc-700 shadow-sm"
        >
          FH
        </button>
      </div>
    </header>
  );
}

type HeaderIconButtonProps = {
  children: ReactNode;
  ariaLabel: string;
};

function HeaderIconButton({ children, ariaLabel }: HeaderIconButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      className="grid h-9 w-9 place-items-center rounded-full border border-white/80 bg-white/80 shadow-sm backdrop-blur"
    >
      {children}
    </button>
  );
}
