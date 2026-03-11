"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    AlertTriangle,
    ShieldAlert,
    Route,
    FileWarning,
    Ban,
    CheckCircle2,
    Filter,
} from "lucide-react";

interface Alert {
    id: string;
    type: string;
    message: string;
    severity: string;
    resolved: boolean;
    createdAt: string;
    vehicle?: { vehicleNumber: string } | null;
    trip?: { origin: string; destination: string } | null;
}

const typeIcons: Record<string, typeof AlertTriangle> = {
    UNAUTHORIZED: Ban,
    DEVIATION: Route,
    PERMIT_MISUSE: FileWarning,
    TRIP_LIMIT: ShieldAlert,
};

const severityMap: Record<string, { variant: "destructive" | "warning" | "default"; color: string }> = {
    CRITICAL: { variant: "destructive", color: "border-l-red-500 bg-red-500/5" },
    WARNING: { variant: "warning", color: "border-l-amber-500 bg-amber-500/5" },
    INFO: { variant: "default", color: "border-l-blue-500 bg-blue-500/5" },
};

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [showResolved, setShowResolved] = useState(false);

    useEffect(() => {
        fetchAlerts();
    }, []);

    async function fetchAlerts() {
        const res = await fetch("/api/alerts");
        if (res.ok) setAlerts(await res.json());
        setLoading(false);
    }

    async function resolveAlert(id: string) {
        const res = await fetch("/api/alerts", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, resolved: true }),
        });
        if (res.ok) fetchAlerts();
    }

    const filteredAlerts = alerts.filter((a) => {
        if (!showResolved && a.resolved) return false;
        if (filter !== "ALL" && a.type !== filter) return false;
        return true;
    });

    const unresolvedCount = alerts.filter((a) => !a.resolved).length;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-title">Alerts & Violations</h1>
                    <p className="page-description">
                        {unresolvedCount} unresolved alert{unresolvedCount !== 1 ? "s" : ""} detected
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant={showResolved ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowResolved(!showResolved)}
                    >
                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                        {showResolved ? "Showing All" : "Show Resolved"}
                    </Button>
                </div>
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-2">
                <Button variant={filter === "ALL" ? "default" : "outline"} size="sm" onClick={() => setFilter("ALL")}>
                    <Filter className="w-3.5 h-3.5 mr-1.5" /> All Types
                </Button>
                {["UNAUTHORIZED", "DEVIATION", "PERMIT_MISUSE", "TRIP_LIMIT"].map((type) => {
                    const Icon = typeIcons[type];
                    const count = alerts.filter((a) => a.type === type && !a.resolved).length;
                    return (
                        <Button key={type} variant={filter === type ? "default" : "outline"} size="sm" onClick={() => setFilter(type)}>
                            <Icon className="w-3.5 h-3.5 mr-1.5" />
                            {type.replace("_", " ")}
                            {count > 0 && (
                                <span className="ml-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 text-[10px]">
                                    {count}
                                </span>
                            )}
                        </Button>
                    );
                })}
            </div>

            {/* Alert List */}
            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredAlerts.map((alert, i) => {
                        const Icon = typeIcons[alert.type] || AlertTriangle;
                        const severity = severityMap[alert.severity] || severityMap.INFO;
                        return (
                            <Card
                                key={alert.id}
                                className={`border-l-4 ${severity.color} ${alert.resolved ? "opacity-60" : ""} animate-fade-in-up`}
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2.5 rounded-xl ${alert.severity === "CRITICAL" ? "bg-red-500/10 text-red-400" :
                                                alert.severity === "WARNING" ? "bg-amber-500/10 text-amber-400" :
                                                    "bg-blue-500/10 text-blue-400"
                                            }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <Badge variant={severity.variant} className="text-[10px]">
                                                    {alert.severity}
                                                </Badge>
                                                <Badge variant="outline" className="text-[10px]">
                                                    {alert.type.replace("_", " ")}
                                                </Badge>
                                                {alert.resolved && (
                                                    <Badge variant="success" className="text-[10px]">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Resolved
                                                    </Badge>
                                                )}
                                                <span className="text-[11px] text-slate-500 ml-auto">
                                                    {new Date(alert.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-200 mb-2">{alert.message}</p>
                                            <div className="flex items-center gap-4 text-xs text-slate-400">
                                                {alert.vehicle && <span>Vehicle: {alert.vehicle.vehicleNumber}</span>}
                                                {alert.trip && <span>Route: {alert.trip.origin} → {alert.trip.destination}</span>}
                                            </div>
                                        </div>
                                        {!alert.resolved && (
                                            <Button size="sm" variant="outline" onClick={() => resolveAlert(alert.id)}>
                                                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Resolve
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                    {filteredAlerts.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No alerts found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
