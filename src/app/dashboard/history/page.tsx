"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, MapPin, Truck, Package, Search, Calendar } from "lucide-react";

interface Trip {
    id: string;
    origin: string;
    destination: string;
    cargo: string;
    permitId: string;
    status: string;
    startTime: string | null;
    endTime: string | null;
    createdAt: string;
    vehicle?: { vehicleNumber: string };
    driver?: { name: string };
}

const statusVariant: Record<string, "success" | "default" | "warning" | "destructive"> = {
    COMPLETED: "success",
    ACTIVE: "default",
    PENDING: "warning",
    FLAGGED: "destructive",
};

export default function HistoryPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchTrips() {
            const res = await fetch("/api/trips");
            if (res.ok) setTrips(await res.json());
            setLoading(false);
        }
        fetchTrips();
    }, []);

    const filteredTrips = trips.filter(
        (t) =>
            t.origin.toLowerCase().includes(search.toLowerCase()) ||
            t.destination.toLowerCase().includes(search.toLowerCase()) ||
            t.vehicle?.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
            t.cargo.toLowerCase().includes(search.toLowerCase())
    );

    function getDuration(start: string | null, end: string | null) {
        if (!start) return "—";
        const s = new Date(start);
        const e = end ? new Date(end) : new Date();
        const diff = Math.abs(e.getTime() - s.getTime());
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${mins}m`;
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div>
                <h1 className="page-title">Trip History</h1>
                <p className="page-description">Complete record of all transport trips</p>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input className="pl-10" placeholder="Search history..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-700/50">
                                        <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider p-4">Route</th>
                                        <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider p-4">Vehicle</th>
                                        <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider p-4">Cargo</th>
                                        <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider p-4">Status</th>
                                        <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider p-4">Duration</th>
                                        <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider p-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTrips.map((trip) => (
                                        <tr key={trip.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-1.5 text-sm">
                                                    <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                                    <span className="text-slate-200">{trip.origin}</span>
                                                    <span className="text-slate-600 mx-1">→</span>
                                                    <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                                                    <span className="text-slate-200">{trip.destination}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="flex items-center gap-1.5 text-sm text-slate-300">
                                                    <Truck className="w-3.5 h-3.5 text-slate-500" />
                                                    {trip.vehicle?.vehicleNumber || "—"}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="flex items-center gap-1.5 text-sm text-slate-400">
                                                    <Package className="w-3.5 h-3.5" />
                                                    {trip.cargo}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant={statusVariant[trip.status] || "default"}>{trip.status}</Badge>
                                            </td>
                                            <td className="p-4">
                                                <span className="flex items-center gap-1.5 text-sm text-slate-400">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {getDuration(trip.startTime, trip.endTime)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(trip.createdAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredTrips.length === 0 && (
                                <div className="text-center py-12 text-slate-500">
                                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No trip history found</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
