import type {
  PredictionApiResponse,
  PredictionTriplet,
  StationPrediction,
} from "@/types/predictions";

type UnknownRecord = Record<string, unknown>;

const BASE_URL = (process.env.NEXT_PUBLIC_VELOV_API_BASE_URL ?? "http://localhost:8000") + "/api";

export async function fetchPredictionsFromApi(
  token: string,
  signal?: AbortSignal
): Promise<PredictionApiResponse | null> {
  const response = await fetch(`${BASE_URL}/predict`, {
    method: "GET",
    signal,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Prediction API error: ${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  if (!isRecord(payload)) {
    return null;
  }

  const rawList = Array.isArray(payload.predictions) ? payload.predictions : [];
  const predictions = rawList
    .map(normalizePrediction)
    .filter((p): p is StationPrediction => p !== null);

  return {
    generatedAt: toStringValue(payload.generated_at) ?? null,
    modelKey: toStringValue(payload.model_key) ?? null,
    count: toNumberValue(payload.count) ?? predictions.length,
    predictions,
  };
}

function normalizePrediction(raw: unknown): StationPrediction | null {
  if (!isRecord(raw)) {
    return null;
  }

  const stationId = toStringValue(raw.station_id) ?? toStringValue(raw.stationId);
  if (!stationId) {
    return null;
  }

  const capacity = toNumberValue(raw.capacity) ?? 0;
  const fillRate = toTriplet(raw.fill_rate);
  const bikes = toTriplet(raw.bikes);
  if (!fillRate) {
    return null;
  }

  return {
    stationId,
    name: toStringValue(raw.name) ?? "Station",
    lat: toNumberValue(raw.lat) ?? 0,
    lng: toNumberValue(raw.lon) ?? toNumberValue(raw.lng) ?? 0,
    capacity,
    currentFillRate: toNumberValue(raw.current_fill_rate) ?? 0,
    fillRate,
    // À défaut de bikes fournis, on les dérive du fill_rate prédit.
    bikes: bikes ?? {
      t15: Math.round(fillRate.t15 * capacity),
      t30: Math.round(fillRate.t30 * capacity),
      t60: Math.round(fillRate.t60 * capacity),
    },
    predictionTs: toStringValue(raw.prediction_ts),
  };
}

function toTriplet(value: unknown): PredictionTriplet | null {
  if (!isRecord(value)) {
    return null;
  }
  const t15 = toNumberValue(value.t15);
  const t30 = toNumberValue(value.t30);
  const t60 = toNumberValue(value.t60);
  if (t15 === undefined || t30 === undefined || t60 === undefined) {
    return null;
  }
  return { t15, t30, t60 };
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function toStringValue(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return undefined;
}

function toNumberValue(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}
