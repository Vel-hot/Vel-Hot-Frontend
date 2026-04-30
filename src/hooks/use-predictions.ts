import { useEffect, useState } from "react";
import type { PredictionApiResponse } from "@/types/predictions";

const PREDICTIONS_URL = process.env.NEXT_PUBLIC_PREDICTIONS_API_URL;

export function usePredictions() {
  const [data, setData] = useState<PredictionApiResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "disabled">(
    PREDICTIONS_URL ? "idle" : "disabled"
  );

  useEffect(() => {
    if (!PREDICTIONS_URL) {
      return;
    }

    let cancelled = false;
    const abortController = new AbortController();

    const fetchPredictions = async () => {
      try {
        const response = await fetch(PREDICTIONS_URL, {
          signal: abortController.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Prediction API error: ${response.status}`);
        }

        const payload = (await response.json()) as PredictionApiResponse;
        if (!cancelled) {
          setData(payload);
          setStatus("ok");
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
        }
      }
    };

    fetchPredictions();
    const interval = window.setInterval(fetchPredictions, 60_000);

    return () => {
      cancelled = true;
      abortController.abort();
      window.clearInterval(interval);
    };
  }, []);

  return { data, status };
}
