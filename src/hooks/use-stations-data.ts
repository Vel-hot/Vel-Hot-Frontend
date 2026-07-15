import { useEffect, useMemo, useState } from "react";
import { fetchDayTimelineFromApi } from "@/lib/stations-api";
import type { DayTimeline } from "@/lib/stations-api";
import { buildSimulatedStations } from "@/lib/station-simulation";
import type { ApiStatus, StationState } from "@/types/stations";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Instant absolu (ms epoch UTC) correspondant à la minute-du-jour sélectionnée
 * (heure locale du navigateur, aujourd'hui). Les timestamps de la timeline sont
 * en UTC : on compare des instants absolus.
 */
function minuteToTodayMs(minuteOfDay: number): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setMinutes(minuteOfDay);
  return d.getTime();
}

/** Index du dernier `t[i] <= target` (recherche binaire), -1 si aucun. */
function lastIndexAtOrBefore(sortedT: number[], target: number): number {
  let lo = 0;
  let hi = sortedT.length - 1;
  let res = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (sortedT[mid] <= target) {
      res = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return res;
}

export function useStationsData(minuteOfDay: number) {
  const [timeline, setTimeline] = useState<DayTimeline | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus>("idle");
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const { token, isAuthenticated } = useAuth();

  // Un SEUL fetch (puis refresh 60 s pour capter les nouveaux relevés). Le
  // scrubbing/playback ne déclenche AUCUN appel réseau : tout est calculé en
  // local à partir de la timeline -> fin de la rafale d'appels annulés.
  useEffect(() => {
    if (!isAuthenticated || !token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setApiStatus("idle");
      return;
    }

    let cancelled = false;
    const abortController = new AbortController();

    const loadTimeline = async () => {
      try {
        const data = await fetchDayTimelineFromApi(token, abortController.signal);
        if (cancelled) return;
        if (data === null) {
          setApiStatus("disabled");
          return;
        }
        setTimeline(data);
        setApiStatus("ok");
        setLastSync(new Date());
      } catch {
        if (!cancelled) setApiStatus("error");
      }
    };

    loadTimeline();
    const refresh = window.setInterval(loadTimeline, 60_000);

    return () => {
      cancelled = true;
      abortController.abort();
      window.clearInterval(refresh);
    };
  }, [token, isAuthenticated]);

  // État des stations à la minute sélectionnée : calcul local (binaire).
  const apiStations = useMemo<StationState[] | null>(() => {
    if (!timeline) return null;
    const target = minuteToTodayMs(minuteOfDay);
    const out: StationState[] = [];
    for (const s of timeline.stations) {
      const i = lastIndexAtOrBefore(s.t, target);
      if (i < 0) continue; // instant antérieur au 1er relevé -> station masquée
      const bikes = clamp(Math.round(s.bikes[i] ?? 0), 0, s.capacity);
      const bikesPct = Math.round((bikes / Math.max(1, s.capacity)) * 100);
      out.push({
        id: s.stationId,
        name: s.name,
        lat: s.lat,
        lng: s.lng,
        capacity: s.capacity,
        bikes,
        docks: Math.max(0, s.capacity - bikes),
        bikesPct,
        timestamp: new Date(s.t[i]).toISOString(),
      });
    }
    return out;
  }, [timeline, minuteOfDay]);

  const simulatedStations = useMemo(() => buildSimulatedStations(minuteOfDay), [minuteOfDay]);
  // Non authentifié : simulation. Authentifié : données réelles.
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
