"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BarChart3,
    Truck,
    AlertTriangle,
    TrendingUp,
    Calendar,
    Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
} from "recharts";

const dailyTripData = [
    { date: "Mar 1", trips: 14, completed: 12 },
    { date: "Mar 2", trips: 18, completed: 16 },
    { date: "Mar 3", trips: 22, completed: 20 },
    { date: "Mar 4", trips: 16, completed: 15 },
    { date: "Mar 5", trips: 20, completed: 18 },
    { date: "Mar 6", trips: 25, completed: 23 },
    { date: "Mar 7", trips: 19, completed: 17 },
    { date: "Mar 8", trips: 28, completed: 26 },
    { date: "Mar 9", trips: 23, completed: 21 },
    { date: "Mar 10", trips: 30, completed: 27 },
];

const vehicleUsageData = [
    { name: "TN-01-AB-1234", trips: 45, hours: 320 },
    { name: "TN-02-CD-5678", trips: 38, hours: 280 },
    { name: "KA-03-EF-9012", trips: 32, hours: 240 },
    { name: "MH-04-GH-3456", trips: 28, hours: 210 },
    { name: "DL-05-IJ-7890", trips: 15, hours: 120 },
];

const violationTypes = [
    { name: "Route Deviation", value: 35, color: "#f59e0b" },
    { name: "Permit Misuse", value: 25, color: "#ef4444" },
    { name: "Unauthorized", value: 20, color: "#8b5cf6" },
    { name: "Trip Limit", value: 20, color: "#3b82f6" },
];

const violationTrend = [
    { week: "W1", violations: 8 },
    { week: "W2", violations: 12 },
    { week: "W3", violations: 6 },
    { week: "W4", violations: 15 },
    { week: "W5", violations: 9 },
    { week: "W6", violations: 11 },
    { week: "W7", violations: 7 },
    { week: "W8", violations: 5 },
];

const tooltipStyle = {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "0.75rem",
    color: "#e2e8f0",
};

export default function ReportsPage() {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-title">Reports</h1>
                    <p className="page-description">Analyze trip data, vehicle usage, and violations</p>
                </div>
                <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1.5" /> Export Reports
                </Button>
            </div>

            <Tabs defaultValue="daily" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="daily" className="gap-1.5">
                        <Calendar className="w-4 h-4" /> Daily Trips
                    </TabsTrigger>
                    <TabsTrigger value="vehicle" className="gap-1.5">
                        <Truck className="w-4 h-4" /> Vehicle Usage
                    </TabsTrigger>
                    <TabsTrigger value="violations" className="gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> Violations
                    </TabsTrigger>
                </TabsList>

                {/* Daily Trip Report */}
                <TabsContent value="daily" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="stat-card stat-card-blue">
                            <p className="text-sm text-slate-400">Total Trips</p>
                            <p className="text-2xl font-bold text-white mt-1">215</p>
                            <p className="text-xs text-emerald-400 mt-1">+12% vs last period</p>
                        </div>
                        <div className="stat-card stat-card-green">
                            <p className="text-sm text-slate-400">Completion Rate</p>
                            <p className="text-2xl font-bold text-white mt-1">91.2%</p>
                            <p className="text-xs text-emerald-400 mt-1">+3.5% improvement</p>
                        </div>
                        <div className="stat-card stat-card-amber">
                            <p className="text-sm text-slate-400">Avg Duration</p>
                            <p className="text-2xl font-bold text-white mt-1">4.2h</p>
                            <p className="text-xs text-slate-400 mt-1">Per trip average</p>
                        </div>
                        <div className="stat-card stat-card-red">
                            <p className="text-sm text-slate-400">Delayed Trips</p>
                            <p className="text-2xl font-bold text-white mt-1">7</p>
                            <p className="text-xs text-red-400 mt-1">3.2% of total</p>
                        </div>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-blue-400" /> Daily Trip Volume
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={dailyTripData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                                    <YAxis stroke="#64748b" fontSize={12} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Bar dataKey="trips" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Trips" />
                                    <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Vehicle Usage Report */}
                <TabsContent value="vehicle" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="w-5 h-5 text-cyan-400" /> Vehicle Trip Count
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={vehicleUsageData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis type="number" stroke="#64748b" fontSize={12} />
                                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={120} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Bar dataKey="trips" fill="#06b6d4" radius={[0, 4, 4, 0]} name="Trips" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-0">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-700/50">
                                        <th className="text-left text-xs font-medium text-slate-400 uppercase p-4">Vehicle</th>
                                        <th className="text-left text-xs font-medium text-slate-400 uppercase p-4">Trips</th>
                                        <th className="text-left text-xs font-medium text-slate-400 uppercase p-4">Hours Active</th>
                                        <th className="text-left text-xs font-medium text-slate-400 uppercase p-4">Utilization</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicleUsageData.map((v) => (
                                        <tr key={v.name} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4 text-sm text-slate-200 font-medium">{v.name}</td>
                                            <td className="p-4 text-sm text-slate-300">{v.trips}</td>
                                            <td className="p-4 text-sm text-slate-300">{v.hours}h</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                                                            style={{ width: `${(v.hours / 400) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-slate-400">{Math.round((v.hours / 400) * 100)}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Violations Report */}
                <TabsContent value="violations" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-400" /> Violation Types
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={violationTypes} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                                            {violationTypes.map((entry, i) => (
                                                <Cell key={`cell-${i}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={tooltipStyle} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    {violationTypes.map((v) => (
                                        <div key={v.name} className="flex items-center gap-2 text-xs">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: v.color }} />
                                            <span className="text-slate-400">{v.name}</span>
                                            <span className="ml-auto text-slate-300 font-semibold">{v.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-purple-400" /> Violation Trend
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={violationTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                                        <YAxis stroke="#64748b" fontSize={12} />
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Line type="monotone" dataKey="violations" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: "#8b5cf6", strokeWidth: 0 }} name="Violations" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
