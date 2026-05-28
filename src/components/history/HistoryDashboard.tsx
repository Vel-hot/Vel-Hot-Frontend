"use client";

import { HistoryHeader } from "./HistoryHeader";
import { TripsVolumeCard } from "./TripsVolumeCard";
import { NeighborhoodPerformanceCard } from "./NeighborhoodPerformanceCard";
import { WeatherImpactCard } from "./WeatherImpactCard";
import { SummaryStatCards } from "./SummaryStatCards";

export function HistoryDashboard() {
  return (
    <div className="h-full overflow-y-auto bg-white p-12 text-zinc-600">
      <div className="mx-auto max-w-7xl">
        <HistoryHeader />

        <div className="mb-8">
          <TripsVolumeCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <NeighborhoodPerformanceCard />
          <WeatherImpactCard />
        </div>

        <SummaryStatCards />
      </div>
    </div>
  );
}
