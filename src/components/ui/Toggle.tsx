"use client";

import React from "react";

interface ToggleProps {
  active: boolean;
  onToggle?: () => void;
}

export function Toggle({ active, onToggle }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        active ? "bg-[#A61D24]" : "bg-zinc-300"
      }`}
    >
      <div
        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
          active ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}
