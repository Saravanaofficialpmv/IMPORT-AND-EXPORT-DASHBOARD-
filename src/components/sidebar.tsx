"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Truck,
    Route,
    MapPin,
    AlertTriangle,
    Clock,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    Navigation,
} from "lucide-react";
import { useState } from "react";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "MANAGER", "DRIVER"] },
    { href: "/dashboard/vehicles", label: "Vehicles", icon: Truck, roles: ["ADMIN", "MANAGER"] },
    { href: "/dashboard/trips", label: "Trips", icon: Route, roles: ["ADMIN", "MANAGER", "DRIVER"] },
    { href: "/dashboard/tracking", label: "Live Tracking", icon: MapPin, roles: ["ADMIN", "MANAGER"] },
    { href: "/dashboard/alerts", label: "Alerts", icon: AlertTriangle, roles: ["ADMIN", "MANAGER"] },
    { href: "/dashboard/history", label: "Trip History", icon: Clock, roles: ["ADMIN", "MANAGER", "DRIVER"] },
    { href: "/dashboard/reports", label: "Reports", icon: BarChart3, roles: ["ADMIN", "MANAGER"] },
    { href: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["ADMIN", "MANAGER", "DRIVER"] },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [collapsed, setCollapsed] = useState(false);
    const userRole = session?.user?.role || "DRIVER";

    const filteredNav = navItems.filter((item) => item.roles.includes(userRole));

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen bg-slate-900 border-r border-slate-700 transition-all duration-300 flex flex-col",
                collapsed ? "w-[72px]" : "w-64"
            )}
        >
            {/* Logo Area */}
            <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-700 text-slate-200">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-600 shadow-soft">
                    <Navigation className="w-5 h-5 text-white" />
                </div>
                {!collapsed && (
                    <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight text-slate-200">Smart GPS</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Tracker</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {filteredNav.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-white text-blue-500 border border-slate-700 shadow-soft"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-5 h-5 transition-colors flex-shrink-0",
                                    isActive ? "text-blue-500" : "text-slate-400 group-hover:text-slate-200"
                                )}
                            />
                            {!collapsed && <span>{item.label}</span>}
                            {isActive && !collapsed && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className="px-3 pb-4">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center justify-center w-full h-9 rounded-xl bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all duration-200"
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>
        </aside>
    );
}
