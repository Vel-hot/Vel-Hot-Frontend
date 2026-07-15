"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { fetchHeatmapFromApi, fetchPeakHoursFromApi, type HeatmapPoint, type PeakHour } from "@/lib/dashboard-api";
import { HistoryHeader } from "./HistoryHeader";
import { TripsVolumeCard } from "./TripsVolumeCard";
import { NeighborhoodPerformanceCard } from "./NeighborhoodPerformanceCard";
import { WeatherImpactCard } from "./WeatherImpactCard";
import { SummaryStatCards } from "./SummaryStatCards";
import { Activity, AlertCircle, Info } from "lucide-react";

export function HistoryDashboard() {
  const { token, isAuthenticated } = useAuth();
  const [peakHours, setPeakHours] = useState<PeakHour[] | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapPoint[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSimulated, setIsSimulated] = useState(false);

  // Fonction de chargement avec support du cache sessionStorage
  const loadData = async (force = false) => {
    if (!token) {
      setLoading(false);
      return;
    }

    if (!force) {
      const cachedPeakHours = sessionStorage.getItem("velhot.history.peakHours");
      const cachedHeatmap = sessionStorage.getItem("velhot.history.heatmap");
      const cachedIsSimulated = sessionStorage.getItem("velhot.history.isSimulated");

      if (cachedPeakHours && cachedHeatmap) {
        setPeakHours(JSON.parse(cachedPeakHours));
        setHeatmap(JSON.parse(cachedHeatmap));
        setIsSimulated(cachedIsSimulated === "true");
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      const [hoursData, heatmapData] = await Promise.all([
        fetchPeakHoursFromApi(token),
        fetchHeatmapFromApi(token),
      ]);

      setPeakHours(hoursData);
      setHeatmap(heatmapData);
      setIsSimulated(false);

      sessionStorage.setItem("velhot.history.peakHours", JSON.stringify(hoursData));
      sessionStorage.setItem("velhot.history.heatmap", JSON.stringify(heatmapData));
      sessionStorage.setItem("velhot.history.isSimulated", "false");
    } catch (err: any) {
      setIsSimulated(true);
      sessionStorage.setItem("velhot.history.isSimulated", "true");
      if (err && err.name !== "AbortError") {
        console.error("Error loading dashboard data:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(false);
  }, [token, isAuthenticated]);

  return (
    <div className="h-full overflow-y-auto bg-white p-12 text-zinc-600">
      <div className="mx-auto max-w-7xl">
        <HistoryHeader onRefresh={() => loadData(true)} loading={loading} />


        {isSimulated && (
          <div className="mb-8 rounded-2xl bg-[#f59e0b]/10 p-4 border border-[#f59e0b]/20 flex items-start gap-3">
            <AlertCircle className="text-[#f59e0b] shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-xs font-bold text-zinc-800 uppercase tracking-wide">
                Mode Simulation actif (Données réelles indisponibles)
              </p>
              <p className="text-[10px] text-zinc-500 mt-1">
                Impossible de récupérer les statistiques en temps réel depuis le serveur (S3/Athena hors ligne ou non configurés). 
                Des données simulées réalistes sont affichées ci-dessous pour illustrer la page.
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative flex items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-[#A61D24]"></div>
              <Activity className="absolute text-[#A61D24] animate-pulse" size={18} />
            </div>
            <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
              Récupération des données réelles...
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <TripsVolumeCard peakHours={peakHours} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <NeighborhoodPerformanceCard heatmap={heatmap} />
              <WeatherImpactCard />
            </div>

            <SummaryStatCards heatmap={heatmap} peakHours={peakHours} />
          </>
        )}
      </div>
    </div>
  );
}

