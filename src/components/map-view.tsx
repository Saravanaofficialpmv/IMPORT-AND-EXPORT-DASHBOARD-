"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface VehicleMarker {
    id: string;
    vehicleNumber: string;
    status: string;
    lat: number;
    lng: number;
    speed?: number;
}

interface MapViewProps {
    vehicles?: VehicleMarker[];
    route?: { lat: number; lng: number }[];
    center?: [number, number];
    zoom?: number;
}

function createVehicleIcon(status: string) {
    const color = status === "IN_TRANSIT" ? "#3b82f6" : status === "ACTIVE" ? "#10b981" : "#64748b";
    return L.divIcon({
        className: "custom-vehicle-marker",
        html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: ${color};
        border: 3px solid rgba(255,255,255,0.9);
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4), 0 0 20px ${color}40;
        position: relative;
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
          <path d="M15 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 13.52 9H12"/>
          <circle cx="7" cy="18" r="2"/>
          <path d="M15 18H9"/>
          <circle cx="17" cy="18" r="2"/>
        </svg>
      </div>
      <div style="
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 12px;
        height: 12px;
        background: ${color};
        border-radius: 50%;
        opacity: 0.3;
        animation: ping 2s infinite;
      "></div>
    `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -22],
    });
}

export default function MapView({ vehicles = [], route = [], center, zoom = 6 }: MapViewProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const mapCenter = useMemo<[number, number]>(() => {
        if (center) return center;
        if (vehicles.length > 0) {
            const avgLat = vehicles.reduce((sum, v) => sum + v.lat, 0) / vehicles.length;
            const avgLng = vehicles.reduce((sum, v) => sum + v.lng, 0) / vehicles.length;
            return [avgLat, avgLng];
        }
        return [11.5, 78.5]; // India center
    }, [vehicles, center]);

    if (!mounted) {
        return (
            <div className="w-full h-full bg-slate-800/50 rounded-xl flex items-center justify-center">
                <p className="text-slate-500 text-sm">Loading map...</p>
            </div>
        );
    }

    return (
        <MapContainer
            center={mapCenter}
            zoom={zoom}
            className="w-full h-full rounded-xl"
            zoomControl={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {vehicles.map((vehicle) => (
                <Marker
                    key={vehicle.id}
                    position={[vehicle.lat, vehicle.lng]}
                    icon={createVehicleIcon(vehicle.status)}
                >
                    <Popup>
                        <div className="text-sm">
                            <p className="font-bold text-slate-100">{vehicle.vehicleNumber}</p>
                            <p className="text-slate-400">Status: {vehicle.status}</p>
                            {vehicle.speed !== undefined && (
                                <p className="text-slate-400">Speed: {vehicle.speed} km/h</p>
                            )}
                            <p className="text-slate-500 text-xs mt-1">
                                {vehicle.lat.toFixed(4)}, {vehicle.lng.toFixed(4)}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {route.length > 1 && (
                <Polyline
                    positions={route.map((r) => [r.lat, r.lng] as [number, number])}
                    pathOptions={{
                        color: "#3b82f6",
                        weight: 4,
                        opacity: 0.8,
                        dashArray: "10, 5",
                    }}
                />
            )}
        </MapContainer>
    );
}
