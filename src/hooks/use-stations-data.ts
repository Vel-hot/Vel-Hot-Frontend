import { useEffect, useMemo, useState } from "react";
import { fetchStationsFromApi } from "@/lib/stations-api";
import { buildSimulatedStations } from "@/lib/station-simulation";
import type { ApiStatus, RealtimeStation, StationState } from "@/types/stations";

export function useStationsData(minuteOfDay: number) {
  const [apiStations, setApiStations] = useState<StationState[] | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus>("idle");
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    const abortController = new AbortController();

    const loadStations = async () => {
      try {
        const realtimeStations = await fetchStationsFromApi(abortController.signal);

        if (cancelled) {
          return;
        }

        if (realtimeStations === null) {
          setApiStatus("disabled");
          return;
        }

        const normalized = realtimeStations.map(toStationState);
        setApiStations(normalized);
        setApiStatus("ok");
        setLastSync(new Date());
      } catch {
        if (!cancelled) {
          setApiStatus("error");
        }
      }
    };

    loadStations();
    const refresh = window.setInterval(loadStations, 60_000);

    return () => {
      cancelled = true;
      abortController.abort();
      window.clearInterval(refresh);
    };
  }, []);

  const simulatedStations = useMemo(() => buildSimulatedStations(minuteOfDay), [minuteOfDay]);
  const stationStates = apiStations ?? simulatedStations;

  return {
    stationStates,
    apiStatus,
    lastSync,
  };
}

function toStationState(station: RealtimeStation): StationState {
  const bikes = clamp(Math.round(station.bikes), 0, station.capacity);
  const docks = clamp(Math.round(station.docks), 0, station.capacity);
  const bikesPct = Math.round((bikes / Math.max(1, station.capacity)) * 100);

  return {
    id: station.id,
    name: station.name,
    lat: station.lat,
    lng: station.lng,
    capacity: station.capacity,
    bikes,
    docks,
    bikesPct,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
