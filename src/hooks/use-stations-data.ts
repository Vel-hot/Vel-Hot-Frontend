import { useEffect, useMemo, useState } from "react";
import { fetchStationsSnapshotFromApi } from "@/lib/stations-api";
import { buildSimulatedStations } from "@/lib/station-simulation";
import type { ApiStatus, RealtimeStation, StationState } from "@/types/stations";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Convertit une minute-du-jour (0..1439, heure locale du navigateur) en
 * instant absolu ISO 8601 pour aujourd'hui. Le backend compare cet instant
 * aux timestamps UTC du silver.
 */
function minuteToTodayIso(minuteOfDay: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setMinutes(minuteOfDay);
  return d.toISOString();
}

export function useStationsData(minuteOfDay: number) {
  const [apiStations, setApiStations] = useState<StationState[] | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus>("idle");
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const { token, isAuthenticated } = useAuth();

  const atIso = useMemo(() => minuteToTodayIso(minuteOfDay), [minuteOfDay]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setApiStatus("idle");
      return;
    }

    let cancelled = false;
    const abortController = new AbortController();

    const loadStations = async () => {
      try {
        const realtimeStations = await fetchStationsSnapshotFromApi(
          token,
          atIso,
          abortController.signal
        );

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

    // Léger debounce : lisse le scrubbing et le playback (5 min / tick).
    const debounce = window.setTimeout(loadStations, 200);
    // Rafraîchissement live pour capter les nouveaux relevés (~5 min).
    const refresh = window.setInterval(loadStations, 60_000);

    return () => {
      cancelled = true;
      abortController.abort();
      window.clearTimeout(debounce);
      window.clearInterval(refresh);
    };
  }, [token, isAuthenticated, atIso]);

  const simulatedStations = useMemo(() => buildSimulatedStations(minuteOfDay), [minuteOfDay]);
  // Non authentifié : simulation. Authentifié : données réelles (même si le
  // snapshot est vide pour l'instant sélectionné — on n'invente rien).
  const stationStates = apiStations ?? simulatedStations;

  const apiTimestamp = useMemo(() => {
    if (!apiStations || apiStations.length === 0) return null;
    return apiStations[0].timestamp ?? null;
  }, [apiStations]);

  return {
    stationStates,
    apiStatus,
    lastSync,
    apiTimestamp,
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
    timestamp: station.timestamp,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
