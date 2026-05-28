"use client";

import { CalendarDays, Pause, Play } from "lucide-react";

type BottomTimeBarProps = {
  minuteOfDay: number;
  liveTimeLabel: string;
  isPlaying: boolean;
  playbackSpeed: number;
  onTogglePlay: () => void;
  onMinuteChange: (value: number) => void;
  onToggleSpeed: () => void;
};

export function BottomTimeBar({
  minuteOfDay,
  liveTimeLabel,
  isPlaying,
  playbackSpeed,
  onTogglePlay,
  onMinuteChange,
  onToggleSpeed,
}: BottomTimeBarProps) {
  return (
    <footer className="absolute bottom-6 left-1/2 z-20 h-[96px] w-[760px] -translate-x-1/2 rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-[0_18px_35px_-25px_rgba(0,0,0,0.65)]">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-left">
          <CalendarDays size={18} className="text-[#A61D24]" />
          <span>
            <span className="block text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">Date analyse</span>
            <span className="block text-sm font-bold text-zinc-700">24 Oct. 2023</span>
          </span>
        </button>

        <button
          className="grid h-11 w-11 place-items-center rounded-full bg-[#A61D24] text-white shadow-sm"
          aria-label="Lecture"
          onClick={onTogglePlay}
        >
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
        </button>

        <div className="relative flex-1">
          <div className="mb-2 flex items-center justify-between text-[10px] font-semibold text-zinc-400">
            <span>00:00</span>
            <span>23:59</span>
          </div>
          <input
            type="range"
            min={0}
            max={1439}
            value={minuteOfDay}
            onChange={(event) => onMinuteChange(Number(event.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-[#A61D24]"
          />
          <div
            className="absolute -top-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#A61D24] px-2 py-0.5 text-[10px] font-bold text-white"
            style={{ left: `${(minuteOfDay / 1439) * 100}%` }}
          >
            EN DIRECT : {liveTimeLabel}
          </div>
        </div>

        <button
          onClick={onToggleSpeed}
          className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-600"
        >
          {playbackSpeed.toFixed(1)}X
        </button>
      </div>
    </footer>
  );
}
