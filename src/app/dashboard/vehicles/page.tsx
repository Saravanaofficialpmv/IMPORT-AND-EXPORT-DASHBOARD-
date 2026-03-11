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
import { Truck, Plus, Edit, Trash2, Search } from "lucide-react";

interface Vehicle {
    id: string;
    vehicleNumber: string;
    driverName: string;
    driverPhone: string;
    permitId: string;
    status: string;
    createdAt: string;
    manager?: { name: string };
    _count?: { trips: number };
}

const statusBadge: Record<string, "success" | "default" | "warning"> = {
    ACTIVE: "success",
    IN_TRANSIT: "default",
    INACTIVE: "warning",
};

export default function VehiclesPage() {
    const { data: session } = useSession();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
    const [form, setForm] = useState({
        vehicleNumber: "",
        driverName: "",
        driverPhone: "",
        permitId: "",
        status: "ACTIVE",
    });

    useEffect(() => {
        fetchVehicles();
    }, []);

    async function fetchVehicles() {
        const res = await fetch("/api/vehicles");
        if (res.ok) {
            setVehicles(await res.json());
        }
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const url = editVehicle ? `/api/vehicles/${editVehicle.id}` : "/api/vehicles";
        const method = editVehicle ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, managerId: session?.user?.id }),
        });

        if (res.ok) {
            await fetchVehicles();
            setDialogOpen(false);
            resetForm();
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this vehicle?")) return;
        const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
        if (res.ok) {
            await fetchVehicles();
        }
    }

    function openEdit(vehicle: Vehicle) {
        setEditVehicle(vehicle);
        setForm({
            vehicleNumber: vehicle.vehicleNumber,
            driverName: vehicle.driverName,
            driverPhone: vehicle.driverPhone,
            permitId: vehicle.permitId,
            status: vehicle.status,
        });
        setDialogOpen(true);
    }

    function resetForm() {
        setEditVehicle(null);
        setForm({ vehicleNumber: "", driverName: "", driverPhone: "", permitId: "", status: "ACTIVE" });
    }

    const filteredVehicles = vehicles.filter(
        (v) =>
            v.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
            v.driverName.toLowerCase().includes(search.toLowerCase()) ||
            v.permitId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-title">Vehicle Management</h1>
                    <p className="page-description">Manage your fleet vehicles and driver assignments</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Add Vehicle
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editVehicle ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
                            <DialogDescription>
                                {editVehicle ? "Update vehicle details below." : "Enter the vehicle details to add to your fleet."}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Vehicle Number</Label>
                                <Input value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} placeholder="e.g. TN-01-AB-1234" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Driver Name</Label>
                                <Input value={form.driverName} onChange={(e) => setForm({ ...form, driverName: e.target.value })} placeholder="Driver full name" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Driver Phone</Label>
                                <Input value={form.driverPhone} onChange={(e) => setForm({ ...form, driverPhone: e.target.value })} placeholder="+91 9876543210" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Permit ID</Label>
                                <Input value={form.permitId} onChange={(e) => setForm({ ...form, permitId: e.target.value })} placeholder="e.g. PRM-2026-001" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <select
                                    className="flex h-10 w-full rounded-lg border border-slate-600 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="IN_TRANSIT">In Transit</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                            <DialogFooter>
                                <Button type="submit">{editVehicle ? "Update" : "Add"} Vehicle</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                    className="pl-10"
                    placeholder="Search vehicles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Vehicle Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredVehicles.map((vehicle, i) => (
                        <Card key={vehicle.id} className="hover:border-slate-600/50 transition-all animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <div className="p-2 rounded-lg bg-blue-500/10">
                                            <Truck className="w-4 h-4 text-blue-400" />
                                        </div>
                                        {vehicle.vehicleNumber}
                                    </CardTitle>
                                    <Badge variant={statusBadge[vehicle.status] || "default"}>
                                        {vehicle.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Driver</span>
                                        <span className="text-slate-200">{vehicle.driverName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Phone</span>
                                        <span className="text-slate-200">{vehicle.driverPhone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Permit ID</span>
                                        <span className="text-slate-200 font-mono text-xs">{vehicle.permitId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Trips</span>
                                        <span className="text-slate-200">{vehicle._count?.trips || 0}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4 pt-3 border-t border-slate-700/50">
                                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => openEdit(vehicle)}>
                                        <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex-1 text-red-400 hover:text-red-300" onClick={() => handleDelete(vehicle.id)}>
                                        <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
