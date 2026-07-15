const BASE_URL = (process.env.NEXT_PUBLIC_VELOV_API_BASE_URL ?? "http://localhost:8000") + "/api";

export type PeakHour = {
  hour: number;
  avg_fill_rate: number;
};

export type HeatmapPoint = {
  station_id: string;
  name: string;
  lat: number;
  lon: number;
  avg_fill_rate: number;
};

export async function fetchPeakHoursFromApi(
  token: string,
  signal?: AbortSignal
): Promise<PeakHour[]> {
  const response = await fetch(`${BASE_URL}/dashboard/peak-hours`, {
    method: "GET",
    signal,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Dashboard API peak-hours error: ${response.status}`);
  }

  return (await response.json()) as PeakHour[];
}

export async function fetchHeatmapFromApi(
  token: string,
  signal?: AbortSignal
): Promise<HeatmapPoint[]> {
  const response = await fetch(`${BASE_URL}/dashboard/heatmap`, {
    method: "GET",
    signal,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Dashboard API heatmap error: ${response.status}`);
  }

  return (await response.json()) as HeatmapPoint[];
}

