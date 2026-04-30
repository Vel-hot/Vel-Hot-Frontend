import type { StationState } from "@/types/stations";

type SimStation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  bias: number;
};

const BASE_STATIONS: SimStation[] = [
  { id: "s1", name: "Bellecour", lat: 45.7577, lng: 4.832, capacity: 28, bias: 0.3 },
  { id: "s2", name: "Hôtel de Ville", lat: 45.7673, lng: 4.8343, capacity: 24, bias: 0.25 },
  { id: "s3", name: "Part-Dieu", lat: 45.7608, lng: 4.8599, capacity: 35, bias: 0.4 },
  { id: "s4", name: "Guillotière", lat: 45.7547, lng: 4.8426, capacity: 22, bias: 0.15 },
  { id: "s5", name: "Saxe", lat: 45.7528, lng: 4.8486, capacity: 20, bias: 0.2 },
  { id: "s6", name: "Confluence", lat: 45.7424, lng: 4.8159, capacity: 30, bias: 0.35 },
  { id: "s7", name: "Croix-Rousse", lat: 45.7744, lng: 4.832, capacity: 18, bias: 0.12 },
  { id: "s8", name: "Perrache", lat: 45.7481, lng: 4.8254, capacity: 26, bias: 0.28 },
  { id: "s9", name: "Foch", lat: 45.7703, lng: 4.8445, capacity: 16, bias: 0.1 },
  { id: "s10", name: "Sans-Souci", lat: 45.7484, lng: 4.8651, capacity: 19, bias: 0.14 },
  { id: "s11", name: "Garibaldi", lat: 45.7572, lng: 4.8512, capacity: 24, bias: 0.23 },
  { id: "s12", name: "Jean Macé", lat: 45.7469, lng: 4.8426, capacity: 21, bias: 0.16 },
];

export function buildSimulatedStations(minuteOfDay: number): StationState[] {
  return BASE_STATIONS.map((station, index) => {
    const rushWave = Math.sin((2 * Math.PI * minuteOfDay) / 1440 + station.bias * 2.4);
    const localNoise = Math.sin((2 * Math.PI * minuteOfDay) / 480 + index * 0.8) * 0.18;
    const normalized = clamp((rushWave + 1) / 2 + localNoise, 0.06, 0.96);
    const bikes = Math.round(station.capacity * normalized);
    const docks = station.capacity - bikes;
    const bikesPct = Math.round((bikes / station.capacity) * 100);

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
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
