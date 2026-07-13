"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { BottomTimeBar } from "@/components/BottomTimeBar";
import { InfoCard } from "@/components/InfoCard";
import { MapControls } from "@/components/MapControls";
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

export function LiveMap() {
  const mapRef = useRef<LeafletMap | null>(null);
  const [minuteOfDay, setMinuteOfDay] = useState(17 * 60 + 34);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.5);
  const [showHeatLayer, setShowHeatLayer] = useState(true);
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState(13);

  const timeBarBottom = 24;
  const timeBarHeight = 96;
  const timeBarGap = 16;
  const infoCardBottomOffset = timeBarBottom + timeBarHeight + timeBarGap;

  const { stationStates, apiStatus, lastSync, apiTimestamp } = useStationsData(minuteOfDay);

  // Synchroniser le slider temporel avec l'heure de l'API
  useEffect(() => {
    if (apiTimestamp) {
      const date = new Date(apiTimestamp);
      const hour = date.getHours();
      const minute = date.getMinutes();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMinuteOfDay(hour * 60 + minute);
    }
  }, [apiTimestamp]);

  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);

  useEffect(() => {
    if (!mapInstance) return;

    const handleZoom = () => {
      setZoom(mapInstance.getZoom());
    };

    mapInstance.on("zoomend", handleZoom);

    return () => {
      mapInstance.off("zoomend", handleZoom);
    };
  }, [mapInstance]);

  const filteredStations = useMemo(() => {
    if (!stationStates) return [];
    
    // Trier les stations par capacité décroissante (les plus grosses stations en premier)
    const sorted = [...stationStates].sort((a, b) => b.capacity - a.capacity);

    if (zoom <= 11) {
      // Très dézoomé : affiche seulement les 25 plus gros hubs
      return sorted.slice(0, 25);
    } else if (zoom === 12) {
      // Dézoomé : affiche les 60 plus grosses stations
      return sorted.slice(0, 60);
    } else if (zoom === 13) {
      // Vue par défaut : affiche les 100 plus grosses stations
      return sorted.slice(0, 100);
    } else if (zoom === 14) {
      // Zoom intermédiaire : affiche les 220 plus grosses stations
      return sorted.slice(0, 220);
    }
    // Zoom rapproché (>= 15) : affiche toutes les stations
    return stationStates;
  }, [stationStates, zoom]);

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
    <>
      <MapContainer
        center={LYON_CENTER}
        zoom={13}
        zoomControl={false}
        attributionControl={false}
        className="absolute inset-0 z-0"
        whenReady={(() => {
          const handler = (event: { target: LeafletMap }) => {
            mapRef.current = event.target;
            setMapInstance(event.target);
          };
          return handler as () => void;
        })()}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {showHeatLayer &&
          filteredStations.map((station) => (
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
        analysisDate={apiTimestamp ?? undefined}
      />
    </>
  );
}

function stationColor(availabilityPct: number) {
  if (availabilityPct < 20) {
    return "#ef4444"; // Rouge (vide ou presque vide : alerte)
  }
  if (availabilityPct < 50) {
    return "#f59e0b"; // Orange (moyen)
  }
  return "#2ea44f"; // Vert (plein ou bien rempli : bonne disponibilité)
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
