export type RealtimeStation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  bikes: number;
  docks: number;
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
};

export type ApiStatus = "idle" | "ok" | "error" | "disabled";
