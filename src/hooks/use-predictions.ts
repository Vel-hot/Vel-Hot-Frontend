import { useEffect, useMemo, useState } from "react";
import { fetchPredictionsFromApi } from "@/lib/predictions-api";
import type { ApiStatus } from "@/types/stations";
import type { PredictionApiResponse, PredictionMap } from "@/types/predictions";
import { useAuth } from "@/components/auth/AuthProvider";

export function usePredictions() {
  const [data, setData] = useState<PredictionApiResponse | null>(null);
  const [status, setStatus] = useState<ApiStatus>("idle");
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("idle");
      return;
    }

    let cancelled = false;
    const abortController = new AbortController();

    const loadPredictions = async () => {
      try {
        const payload = await fetchPredictionsFromApi(token, abortController.signal);
        if (cancelled) {
          return;
        }
        if (payload === null) {
          setStatus("disabled");
          return;
        }
        setData(payload);
        setStatus("ok");
      } catch {
        if (!cancelled) {
          setStatus("error");
        }
      }
    };

    loadPredictions();
    // Les prédictions gold sont recalculées toutes les 15 min ; on rafraîchit
    // à la même cadence que les stations (60 s) pour rester simple.
    const refresh = window.setInterval(loadPredictions, 60_000);

    return () => {
      cancelled = true;
      abortController.abort();
      window.clearInterval(refresh);
    };
  }, [token, isAuthenticated]);

  const byStation: PredictionMap = useMemo(() => {
    const map: PredictionMap = new Map();
    for (const prediction of data?.predictions ?? []) {
      map.set(prediction.stationId, prediction);
    }
    return map;
  }, [data]);

  return { data, byStation, status };
}
