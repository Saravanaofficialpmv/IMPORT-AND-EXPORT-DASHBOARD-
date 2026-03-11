"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, Navigation, Gauge, Clock } from "lucide-react";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/map-view"), { ssr: false });

interface TrackingVehicle {
    id: string;
    vehicleNumber: string;
    status: string;
    lat: number;
    lng: number;
    speed: number;
    heading: number;
    lastUpdate: string;
    driverName: string;
    activeTrip?: {
        origin: string;
        destination: string;
        cargo: string;
        routeTaken: string;
    } | null;
}

export default function TrackingPage() {
    const [vehicles, setVehicles] = useState<TrackingVehicle[]>([]);
    const [selected, setSelected] = useState<TrackingVehicle | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTracking();
        const interval = setInterval(fetchTracking, 5000);
        return () => clearInterval(interval);
    }, []);

    async function fetchTracking() {
        try {
            const res = await fetch("/api/tracking");
            if (res.ok) {
                const data = await res.json();
                setVehicles(data);
                if (data.length > 0 && !selected) {
                    setSelected(data[0]);
                }
            }
        } catch (err) {
            console.error("Tracking fetch error:", err);
        } finally {
            setLoading(false);
        }
    }

    const mapVehicles = vehicles.map((v) => ({
        id: v.id,
        vehicleNumber: v.vehicleNumber,
        status: v.status,
        lat: v.lat,
        lng: v.lng,
        speed: v.speed,
    }));

    const route = selected?.activeTrip?.routeTaken
        ? JSON.parse(selected.activeTrip.routeTaken)
        : [];

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div>
                <h1 className="page-title">Live Vehicle Tracking</h1>
                <p className="page-description">Real-time GPS tracking of all active vehicles</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Map */}
                <div className="lg:col-span-3">
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="h-[calc(100vh-220px)]">
                                {loading ? (
                                    <div className="h-full flex items-center justify-center bg-slate-800/50">
                                        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <MapView
                                        vehicles={mapVehicles}
                                        route={route}
                                        center={selected ? [selected.lat, selected.lng] : undefined}
                                        zoom={selected ? 10 : 6}
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Vehicle List */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Navigation className="w-4 h-4 text-blue-400" />
                                Tracked Vehicles ({vehicles.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-[calc(100vh-340px)] overflow-y-auto pr-1">
                                {vehicles.map((vehicle) => (
                                    <button
                                        key={vehicle.id}
                                        onClick={() => setSelected(vehicle)}
                                        className={`w-full text-left p-3 rounded-xl transition-all ${selected?.id === vehicle.id
                                                ? "bg-blue-500/10 border border-blue-500/30"
                                                : "bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-slate-200">{vehicle.vehicleNumber}</span>
                                            <Badge variant={vehicle.status === "IN_TRANSIT" ? "default" : "success"} className="text-[10px]">
                                                {vehicle.status}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-slate-400 space-y-0.5">
                                            <p className="flex items-center gap-1">
                                                <Truck className="w-3 h-3" /> {vehicle.driverName}
                                            </p>
                                            <p className="flex items-center gap-1">
                                                <Gauge className="w-3 h-3" /> {vehicle.speed} km/h
                                            </p>
                                        </div>
                                    </button>
                                ))}
                                {vehicles.length === 0 && (
                                    <p className="text-center text-slate-500 text-sm py-8">No tracked vehicles</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Selected Vehicle Details */}
                    {selected && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Vehicle Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Vehicle</span>
                                    <span className="text-slate-200 font-medium">{selected.vehicleNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Driver</span>
                                    <span className="text-slate-200">{selected.driverName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Speed</span>
                                    <span className="text-slate-200">{selected.speed} km/h</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Position</span>
                                    <span className="text-slate-200 font-mono">{selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Updated</span>
                                    <span className="text-slate-200">{new Date(selected.lastUpdate).toLocaleTimeString()}</span>
                                </div>
                                {selected.activeTrip && (
                                    <>
                                        <div className="pt-2 mt-2 border-t border-slate-700/50">
                                            <p className="text-slate-400 mb-1">Active Trip</p>
                                            <div className="flex items-center gap-1 text-slate-200">
                                                <MapPin className="w-3 h-3 text-emerald-400" />
                                                {selected.activeTrip.origin}
                                                <span className="text-slate-600 mx-1">→</span>
                                                <MapPin className="w-3 h-3 text-red-400" />
                                                {selected.activeTrip.destination}
                                            </div>
                                            <p className="text-slate-400 mt-1">{selected.activeTrip.cargo}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
