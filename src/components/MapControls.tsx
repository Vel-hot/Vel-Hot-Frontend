"use client";

import type { ReactNode } from "react";
import { Info, Layers, LocateFixed, ZoomIn, ZoomOut } from "lucide-react";

type MapControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocate: () => void;
  onToggleLayer: () => void;
  heatLayerVisible: boolean;
  onToggleInfo: () => void;
  infoActive: boolean;
};

export function MapControls({
  onZoomIn,
  onZoomOut,
  onLocate,
  onToggleLayer,
  heatLayerVisible,
  onToggleInfo,
  infoActive,
}: MapControlsProps) {
  return (
    <div className="absolute right-8 top-24 z-20 flex flex-col gap-3">
      <MapControlButton ariaLabel="Zoom avant" onClick={onZoomIn}>
        <ZoomIn size={16} />
      </MapControlButton>
      <MapControlButton ariaLabel="Zoom arriere" onClick={onZoomOut}>
        <ZoomOut size={16} />
      </MapControlButton>
      <MapControlButton ariaLabel="Localisation" onClick={onLocate}>
        <LocateFixed size={16} />
      </MapControlButton>
      <MapControlButton ariaLabel="Couches" onClick={onToggleLayer} isActive={heatLayerVisible}>
        <Layers size={16} />
      </MapControlButton>
      <MapControlButton ariaLabel="Légende" onClick={onToggleInfo} isActive={infoActive}>
        <Info size={16} />
      </MapControlButton>
    </div>
  );
}

type MapControlButtonProps = {
  children: ReactNode;
  ariaLabel: string;
  onClick?: () => void;
  isActive?: boolean;
};

function MapControlButton({ children, ariaLabel, onClick, isActive }: MapControlButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className={`grid h-11 w-11 place-items-center rounded-xl border text-zinc-700 shadow-sm transition ${
        isActive
          ? "border-[#A61D24] bg-white text-[#A61D24]"
          : "border-zinc-200 bg-white hover:bg-zinc-50"
      }`}
    >
      {children}
    </button>
  );
}
