import type { RealtimeStation } from "@/types/stations";

type UnknownRecord = Record<string, unknown>;

const BASE_URL = (process.env.NEXT_PUBLIC_VELOV_API_BASE_URL ?? "http://localhost:8000") + "/api";

export async function fetchStationsFromApi(
  token: string,
  signal?: AbortSignal
): Promise<RealtimeStation[] | null> {
  return requestStations(`${BASE_URL}/stations`, token, signal);
}

/**
 * État de toutes les stations à un instant donné (slider temporel).
 * `at` doit être un instant absolu (ISO 8601, ex. Date.toISOString()).
 */
export async function fetchStationsSnapshotFromApi(
  token: string,
  at: string,
  signal?: AbortSignal
): Promise<RealtimeStation[] | null> {
  const url = `${BASE_URL}/stations/snapshot?at=${encodeURIComponent(at)}`;
  return requestStations(url, token, signal);
}

export type TimelineStation = {
  stationId: string;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  /** timestamps UTC en ms epoch, triés croissant */
  t: number[];
  /** vélos disponibles, alignés sur `t` */
  bikes: number[];
};

export type DayTimeline = {
  date: string;
  stations: TimelineStation[];
};

/**
 * Toute la timeline du jour en un seul appel : le slider/playback calcule
 * ensuite l'état des stations en local (aucun appel réseau par position).
 */
export async function fetchDayTimelineFromApi(
  token: string,
  signal?: AbortSignal
): Promise<DayTimeline | null> {
  const response = await fetch(`${BASE_URL}/stations/day-timeline`, {
    method: "GET",
    signal,
    cache: "no-store",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Timeline API error: ${response.status}`);
  }
  const payload = (await response.json()) as unknown;
  if (!isRecord(payload) || !Array.isArray(payload.stations)) {
    return null;
  }
  const stations: TimelineStation[] = [];
  for (const raw of payload.stations) {
    if (!isRecord(raw)) continue;
    const stationId = toStringValue(raw.station_id) ?? toStringValue(raw.stationId);
    const t = Array.isArray(raw.t) ? (raw.t as unknown[]).map(Number) : [];
    const bikes = Array.isArray(raw.bikes) ? (raw.bikes as unknown[]).map(Number) : [];
    const lat = toNumberValue(raw.lat);
    const lng = toNumberValue(raw.lon) ?? toNumberValue(raw.lng);
    const capacity = toNumberValue(raw.capacity) ?? 0;
    if (!stationId || lat === undefined || lng === undefined || t.length === 0) {
      continue;
    }
    stations.push({
      stationId,
      name: toStringValue(raw.name) ?? "Station",
      lat,
      lng,
      capacity,
      t,
      bikes,
    });
  }
  return { date: toStringValue(payload.date) ?? "", stations };
}

async function requestStations(
  url: string,
  token: string,
  signal?: AbortSignal
): Promise<RealtimeStation[] | null> {
  const response = await fetch(url, {
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
