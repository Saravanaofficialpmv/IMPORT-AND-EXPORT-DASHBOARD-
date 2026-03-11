"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Truck,
    Route,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    Clock,
    MapPin,
    ArrowUpRight,
} from "lucide-react";
import dynamic from "next/dynamic";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Area,
    AreaChart,
} from "recharts";

const MapView = dynamic(() => import("@/components/map-view"), { ssr: false });

interface DashboardData {
    totalVehicles: number;
    activeTrips: number;
    completedTrips: number;
    violations: number;
    alerts: Array<{
        id: string;
        type: string;
        message: string;
        severity: string;
        resolved: boolean;
        createdAt: string;
        vehicle?: { vehicleNumber: string } | null;
    }>;
    vehicles: Array<{
        id: string;
        vehicleNumber: string;
        status: string;
        locations: Array<{ lat: number; lng: number; speed: number }>;
    }>;
}

const tripChartData = [
    { name: "Mon", trips: 12, completed: 10 },
    { name: "Tue", trips: 19, completed: 17 },
    { name: "Wed", trips: 15, completed: 14 },
    { name: "Thu", trips: 22, completed: 20 },
    { name: "Fri", trips: 18, completed: 16 },
    { name: "Sat", trips: 8, completed: 8 },
    { name: "Sun", trips: 5, completed: 5 },
];

const statusDistribution = [
    { name: "Active", value: 35, color: "#3b82f6" },
    { name: "Completed", value: 45, color: "#10b981" },
    { name: "Pending", value: 12, color: "#f59e0b" },
    { name: "Flagged", value: 8, color: "#ef4444" },
];

const activityData = [
    { time: "00:00", vehicles: 12 },
    { time: "04:00", vehicles: 8 },
    { time: "08:00", vehicles: 28 },
    { time: "12:00", vehicles: 35 },
    { time: "16:00", vehicles: 42 },
    { time: "20:00", vehicles: 25 },
    { time: "23:59", vehicles: 15 },
];

export default function DashboardPage() {
    const { data: session } = useSession();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/dashboard");
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    const stats = [
        {
            label: "Total Vehicles",
            value: data?.totalVehicles || 0,
            icon: Truck,
            color: "blue",
            change: "+12%",
            cardClass: "stat-card-blue",
        },
        {
            label: "Active Trips",
            value: data?.activeTrips || 0,
            icon: Route,
            color: "green",
            change: "+5%",
            cardClass: "stat-card-green",
        },
        {
            label: "Completed Trips",
            value: data?.completedTrips || 0,
            icon: CheckCircle2,
            color: "amber",
            change: "+18%",
            cardClass: "stat-card-amber",
        },
        {
            label: "Violations",
            value: data?.violations || 0,
            icon: AlertTriangle,
            color: "red",
            change: "-3%",
            cardClass: "stat-card-red",
        },
    ];

    const iconColors: Record<string, string> = {
        blue: "text-blue-400 bg-blue-500/10",
        green: "text-emerald-400 bg-emerald-500/10",
        amber: "text-amber-400 bg-amber-500/10",
        red: "text-red-400 bg-red-500/10",
    };

    const alertSeverityMap: Record<string, "destructive" | "warning" | "default"> = {
        CRITICAL: "destructive",
        WARNING: "warning",
        INFO: "default",
    };

    return (
        <div className="space-y-4 animate-fade-in-up px-4 pt-4">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-bold text-white tracking-tight">Overview</h1>
                <p className="text-xs text-slate-400">
                    Hello {session?.user?.name}, here is your fleet status.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, i) => (
                    <div
                        key={stat.label}
                        className={`stat-card ${stat.cardClass} p-3 animate-fade-in-up`}
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className={`p-1.5 rounded-lg ${iconColors[stat.color]}`}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                                <TrendingUp className="w-2.5 h-2.5" />
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold white-text tracking-tight">{stat.value}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase tracking-wider">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts + Map Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trip Activity Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            Weekly Trip Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={tripChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1e293b",
                                        border: "1px solid #334155",
                                        borderRadius: "0.75rem",
                                        color: "#e2e8f0",
                                    }}
                                />
                                <Bar dataKey="trips" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Trips" />
                                <Bar dataKey="completed" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Completed" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Trip Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Route className="w-5 h-5 text-cyan-400" />
                            Trip Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {statusDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1e293b",
                                        border: "1px solid #334155",
                                        borderRadius: "0.75rem",
                                        color: "#e2e8f0",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {statusDistribution.map((item) => (
                                <div key={item.name} className="flex items-center gap-2 text-xs">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-slate-400">{item.name}</span>
                                    <span className="ml-auto text-slate-300 font-medium">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Map + Alerts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Map */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-emerald-400" />
                            Live Vehicle Locations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] rounded-xl overflow-hidden">
                            <MapView
                                vehicles={
                                    data?.vehicles
                                        ?.filter((v) => v.locations.length > 0)
                                        .map((v) => ({
                                            id: v.id,
                                            vehicleNumber: v.vehicleNumber,
                                            status: v.status,
                                            lat: v.locations[0].lat,
                                            lng: v.locations[0].lng,
                                            speed: v.locations[0].speed,
                                        })) || []
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-400" />
                                Recent Alerts
                            </span>
                            <Badge variant="destructive" className="text-xs">
                                {data?.alerts?.filter((a) => !a.resolved).length || 0} Active
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                            {data?.alerts?.slice(0, 6).map((alert) => (
                                <div
                                    key={alert.id}
                                    className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/30 hover:border-slate-600/50 transition-all"
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <Badge variant={alertSeverityMap[alert.severity] || "default"} className="text-[10px]">
                                            {alert.type.replace("_", " ")}
                                        </Badge>
                                        <span className="text-[10px] text-slate-500">
                                            {new Date(alert.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
                                    {alert.vehicle && (
                                        <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                                            <Truck className="w-3 h-3" />
                                            {alert.vehicle.vehicleNumber}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Fleet Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowUpRight className="w-5 h-5 text-purple-400" />
                        Fleet Activity Today
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={activityData}>
                            <defs>
                                <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                            <YAxis stroke="#64748b" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "1px solid #334155",
                                    borderRadius: "0.75rem",
                                    color: "#e2e8f0",
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="vehicles"
                                stroke="#3b82f6"
                                fillOpacity={1}
                                fill="url(#colorVehicles)"
                                name="Active Vehicles"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
