export type RealtimeStation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  bikes: number;
  docks: number;
  timestamp?: string;
};

export type StationState = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  bikes: number;
  docks: number;
  bikesPct: number;
  timestamp?: string;
};

export type ApiStatus = "idle" | "ok" | "error" | "disabled";
