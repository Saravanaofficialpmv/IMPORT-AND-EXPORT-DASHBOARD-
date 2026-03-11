"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Route, Plus, Play, Square, Flag, MapPin, Truck, Search, Package } from "lucide-react";

interface Trip {
    id: string;
    origin: string;
    destination: string;
    cargo: string;
    permitId: string;
    allowedTrips: number;
    status: string;
    startTime: string | null;
    endTime: string | null;
    createdAt: string;
    vehicle?: { vehicleNumber: string };
    driver?: { name: string };
    _count?: { alerts: number };
}

interface Vehicle {
    id: string;
    vehicleNumber: string;
}

const statusConfig: Record<string, { variant: "success" | "default" | "warning" | "destructive"; icon: typeof Play }> = {
    PENDING: { variant: "warning", icon: MapPin },
    ACTIVE: { variant: "default", icon: Play },
    COMPLETED: { variant: "success", icon: Square },
    FLAGGED: { variant: "destructive", icon: Flag },
};

export default function TripsPage() {
    const { data: session } = useSession();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [form, setForm] = useState({
        origin: "",
        destination: "",
        cargo: "",
        permitId: "",
        allowedTrips: 1,
        vehicleId: "",
        driverId: "",
    });

    useEffect(() => {
        fetchTrips();
        fetchVehicles();
    }, []);

    async function fetchTrips() {
        const res = await fetch("/api/trips");
        if (res.ok) setTrips(await res.json());
        setLoading(false);
    }

    async function fetchVehicles() {
        const res = await fetch("/api/vehicles");
        if (res.ok) setVehicles(await res.json());
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/trips", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, managerId: session?.user?.id }),
        });
        if (res.ok) {
            await fetchTrips();
            setDialogOpen(false);
            setForm({ origin: "", destination: "", cargo: "", permitId: "", allowedTrips: 1, vehicleId: "", driverId: "" });
        }
    }

    async function updateStatus(tripId: string, status: string) {
        const res = await fetch(`/api/trips/${tripId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        if (res.ok) await fetchTrips();
    }

    const filteredTrips = trips.filter((t) => {
        const matchesSearch =
            t.origin.toLowerCase().includes(search.toLowerCase()) ||
            t.destination.toLowerCase().includes(search.toLowerCase()) ||
            t.cargo.toLowerCase().includes(search.toLowerCase()) ||
            t.vehicle?.vehicleNumber.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-title">Trip Management</h1>
                    <p className="page-description">Create and manage transport trips</p>
                </div>
                {(session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER") && (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button><Plus className="w-4 h-4 mr-2" /> Create Trip</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Trip</DialogTitle>
                                <DialogDescription>Fill in the trip details below to create a new transport trip.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Origin</Label>
                                        <Input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="e.g. Chennai Port" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Destination</Label>
                                        <Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="e.g. Bangalore Warehouse" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Cargo Details</Label>
                                    <Input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} placeholder="e.g. Electronic Components - 500 units" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Permit ID</Label>
                                        <Input value={form.permitId} onChange={(e) => setForm({ ...form, permitId: e.target.value })} placeholder="PRM-2026-XXX" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Allowed Trips</Label>
                                        <Input type="number" min={1} value={form.allowedTrips} onChange={(e) => setForm({ ...form, allowedTrips: parseInt(e.target.value) })} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Assign Vehicle</Label>
                                    <select
                                        className="flex h-10 w-full rounded-lg border border-slate-600 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={form.vehicleId}
                                        onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select a vehicle</option>
                                        {vehicles.map((v) => (
                                            <option key={v.id} value={v.id}>{v.vehicleNumber}</option>
                                        ))}
                                    </select>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Create Trip</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input className="pl-10" placeholder="Search trips..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="flex gap-2">
                    {["ALL", "PENDING", "ACTIVE", "COMPLETED", "FLAGGED"].map((status) => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter(status)}
                        >
                            {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Trip Cards */}
            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTrips.map((trip, i) => {
                        const config = statusConfig[trip.status] || statusConfig.PENDING;
                        return (
                            <Card key={trip.id} className="hover:border-slate-600/50 transition-all animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Badge variant={config.variant} className="text-xs">
                                                    {trip.status}
                                                </Badge>
                                                <span className="text-xs text-slate-500 font-mono">{trip.permitId}</span>
                                                {trip._count && trip._count.alerts > 0 && (
                                                    <Badge variant="destructive" className="text-[10px]">
                                                        {trip._count.alerts} alert{trip._count.alerts > 1 ? "s" : ""}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm mb-2">
                                                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                                <span className="text-slate-200">{trip.origin}</span>
                                                <span className="text-slate-600">→</span>
                                                <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                                                <span className="text-slate-200">{trip.destination}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Package className="w-3.5 h-3.5" /> {trip.cargo}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Truck className="w-3.5 h-3.5" /> {trip.vehicle?.vehicleNumber || "Unassigned"}
                                                </span>
                                                <span>Allowed: {trip.allowedTrips} trips</span>
                                                {trip.startTime && (
                                                    <span>Started: {new Date(trip.startTime).toLocaleString()}</span>
                                                )}
                                                {trip.endTime && (
                                                    <span>Ended: {new Date(trip.endTime).toLocaleString()}</span>
                                                )}
                                            </div>
                                        </div>
                                        {(session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER" || session?.user?.role === "DRIVER") && (
                                            <div className="flex gap-2 ml-4">
                                                {trip.status === "PENDING" && (
                                                    <Button size="sm" onClick={() => updateStatus(trip.id, "ACTIVE")}>
                                                        <Play className="w-3.5 h-3.5 mr-1" /> Start
                                                    </Button>
                                                )}
                                                {trip.status === "ACTIVE" && (
                                                    <>
                                                        <Button size="sm" variant="secondary" onClick={() => updateStatus(trip.id, "COMPLETED")}>
                                                            <Square className="w-3.5 h-3.5 mr-1" /> End
                                                        </Button>
                                                        <Button size="sm" variant="destructive" onClick={() => updateStatus(trip.id, "FLAGGED")}>
                                                            <Flag className="w-3.5 h-3.5 mr-1" /> Flag
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                    {filteredTrips.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <Route className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No trips found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
