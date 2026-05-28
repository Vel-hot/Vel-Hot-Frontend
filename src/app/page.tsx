"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { BottomTimeBar } from "@/components/BottomTimeBar";
import { InfoCard } from "@/components/InfoCard";
import { MapControls } from "@/components/MapControls";
import { Sidebar } from "@/components/Sidebar";
import { useStationsData } from "@/hooks/use-stations-data";

const MapContainer = dynamic(
  () => import("react-leaflet").then((module) => module.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(() => import("react-leaflet").then((module) => module.TileLayer), {
  ssr: false,
});
const CircleMarker = dynamic(
  () => import("react-leaflet").then((module) => module.CircleMarker),
  { ssr: false }
);
const Tooltip = dynamic(() => import("react-leaflet").then((module) => module.Tooltip), {
  ssr: false,
});

const LYON_CENTER: [number, number] = [45.764, 4.8357];

export default function Home() {
  const mapRef = useRef<LeafletMap | null>(null);
  const [minuteOfDay, setMinuteOfDay] = useState(17 * 60 + 34);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.5);
  const [showHeatLayer, setShowHeatLayer] = useState(true);
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  const timeBarBottom = 24;
  const timeBarHeight = 96;
  const timeBarGap = 16;
  const infoCardBottomOffset = timeBarBottom + timeBarHeight + timeBarGap;

  const { stationStates, apiStatus, lastSync } = useStationsData(minuteOfDay);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const tickMs = Math.max(180, 1000 / playbackSpeed);
    const interval = window.setInterval(() => {
      setMinuteOfDay((prev) => (prev + 5) % 1440);
    }, tickMs);

    return () => window.clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const liveTimeLabel = formatMinute(minuteOfDay);

  const dataSourceLabel =
    apiStatus === "ok"
      ? "API"
      : apiStatus === "error"
        ? "ERREUR API (fallback simulation)"
        : apiStatus === "disabled"
          ? "SIMULATION"
          : "CHARGEMENT";

  const handleLocate = () => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const target: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserPosition(target);
        mapRef.current?.setView(target, 14, { animate: true });
      },
      () => {
        mapRef.current?.setView(LYON_CENTER, 13, { animate: true });
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#d8dae0]">
      <main className="relative flex h-full w-full overflow-hidden bg-[#dfe1e6]">
        <Sidebar />

        <section className="relative flex-1 overflow-hidden bg-[#d8dae0]">
          <MapContainer
            center={LYON_CENTER}
            zoom={13}
            zoomControl={false}
            attributionControl={false}
            className="absolute inset-0 z-0"
            whenReady={(event: { target: LeafletMap }) => {
              mapRef.current = event.target;
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {showHeatLayer &&
              stationStates.map((station) => (
                <CircleMarker
                  key={station.id}
                  center={[station.lat, station.lng]}
                  radius={Math.max(9, station.bikesPct / 4)}
                  pathOptions={{
                    color: stationColor(station.bikesPct),
                    fillColor: stationColor(station.bikesPct),
                    fillOpacity: 0.72,
                    weight: 1,
                  }}
                >
                  <Tooltip direction="top" opacity={0.95}>
                    <div className="text-xs">
                      <p className="font-bold">{station.name}</p>
                      <p>
                        {station.bikes} vélos / {station.capacity}
                      </p>
                    </div>
                  </Tooltip>
                </CircleMarker>
              ))}

            {userPosition && (
              <CircleMarker
                center={userPosition}
                radius={9}
                pathOptions={{ color: "#0ea5e9", fillColor: "#0ea5e9", fillOpacity: 0.9, weight: 2 }}
              >
                <Tooltip direction="top">Vous êtes ici</Tooltip>
              </CircleMarker>
            )}
          </MapContainer>

          <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_18%_24%,rgba(255,255,255,0.45),transparent_45%),radial-gradient(circle_at_74%_70%,rgba(255,255,255,0.3),transparent_40%)]" />

          <MapControls
            onZoomIn={() => mapRef.current?.zoomIn()}
            onZoomOut={() => mapRef.current?.zoomOut()}
            onLocate={handleLocate}
            onToggleLayer={() => setShowHeatLayer((visible) => !visible)}
            heatLayerVisible={showHeatLayer}
            onToggleInfo={() => setShowInfoCard((visible) => !visible)}
            infoActive={showInfoCard}
          />

          {showInfoCard && (
            <InfoCard
              dataSourceLabel={dataSourceLabel}
              lastSync={lastSync}
              stationCount={stationStates.length}
              bottomOffsetPx={infoCardBottomOffset}
            />
          )}

          <BottomTimeBar
            minuteOfDay={minuteOfDay}
            liveTimeLabel={liveTimeLabel}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            onTogglePlay={() => setIsPlaying((value) => !value)}
            onMinuteChange={(value) => setMinuteOfDay(value)}
            onToggleSpeed={() => setPlaybackSpeed((prev) => (prev === 1.5 ? 3 : 1.5))}
          />
        </section>
      </main>
    </div>
  );
}

function stationColor(availabilityPct: number) {
  if (availabilityPct < 35) {
    return "#2ea44f";
  }
  if (availabilityPct < 70) {
    return "#f59e0b";
  }
  return "#ef4444";
}

function formatMinute(minute: number) {
  const h = Math.floor(minute / 60)
    .toString()
    .padStart(2, "0");
  const m = Math.floor(minute % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}`;
}
