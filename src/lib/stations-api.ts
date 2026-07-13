import type { RealtimeStation } from "@/types/stations";

type UnknownRecord = Record<string, unknown>;

const BASE_URL = (process.env.NEXT_PUBLIC_VELOV_API_BASE_URL ?? "http://localhost:8000") + "/api";

export async function fetchStationsFromApi(
  token: string,
  signal?: AbortSignal
): Promise<RealtimeStation[] | null> {
  const response = await fetch(`${BASE_URL}/stations`, {
    method: "GET",
    signal,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Station API error: ${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  const rawStations = extractArray(payload);

  return rawStations
    .map(normalizeStation)
    .filter((station): station is RealtimeStation => station !== null);
}

function extractArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (isRecord(payload) && Array.isArray(payload.stations)) {
    return payload.stations;
  }

  return [];
}

function normalizeStation(raw: unknown): RealtimeStation | null {
  if (!isRecord(raw)) {
    return null;
  }

  const id = toStringValue(raw.id) ?? toStringValue(raw.station_id) ?? toStringValue(raw.code);
  const name =
    toStringValue(raw.name) ??
    toStringValue(raw.station_name) ??
    toStringValue(raw.nom) ??
    "Station";

  const lat = toNumberValue(raw.lat) ?? toNumberValue(raw.latitude);
  const lng = toNumberValue(raw.lng) ?? toNumberValue(raw.lon) ?? toNumberValue(raw.longitude);

  const bikes =
    toNumberValue(raw.bikes) ??
    toNumberValue(raw.available_bikes) ??
    toNumberValue(raw.num_bikes_available) ??
    0;

  const docks =
    toNumberValue(raw.docks) ??
    toNumberValue(raw.available_docks) ??
    toNumberValue(raw.num_docks_available) ??
    0;

  const capacity =
    toNumberValue(raw.capacity) ??
    toNumberValue(raw.num_docks) ??
    Math.max(0, bikes + docks);

  if (!id || lat === undefined || lng === undefined || capacity <= 0) {
    return null;
  }

  const timestamp = toStringValue(raw.timestamp);

  return {
    id,
    name,
    lat,
    lng,
    capacity,
    bikes: clampInteger(bikes, 0, capacity),
    docks: clampInteger(docks, 0, capacity),
    timestamp,
  };
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

function clampInteger(value: number, min: number, max: number): number {
  return Math.round(Math.min(Math.max(value, min), max));
}
