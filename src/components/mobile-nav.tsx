"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Truck,
    MapPin,
    AlertTriangle,
    Clock,
    Settings,
} from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard, roles: ["ADMIN", "MANAGER", "DRIVER", "admin", "manager", "driver"] },
    { href: "/dashboard/vehicles", label: "Vehicles", icon: Truck, roles: ["ADMIN", "MANAGER", "admin", "manager"] },
    { href: "/dashboard/tracking", label: "Map", icon: MapPin, roles: ["ADMIN", "MANAGER", "admin", "manager"] },
    { href: "/dashboard/alerts", label: "Alerts", icon: AlertTriangle, roles: ["ADMIN", "MANAGER", "admin", "manager"] },
    { href: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["ADMIN", "MANAGER", "DRIVER", "admin", "manager", "driver"] },
];

export default function MobileNav({ isDesktop = false }: { isDesktop?: boolean }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const userRole = session?.user?.role || "DRIVER";

    const filteredNav = navItems.filter((item) => item.roles.includes(userRole)).slice(0, 5); // Mobile nav usually supports up to 5 icons

    if (isDesktop) {
        return (
            <nav className="flex flex-col h-full bg-slate-900 border-r border-slate-800 p-4">
               {/* Sidebar Branding Header */}
               <div className="py-6 mb-4 px-2">
                   <h2 className="text-xl font-bold tracking-tight text-white leading-none">Smart GPS</h2>
                   <span className="text-xs text-blue-400 font-medium uppercase tracking-widest mt-0.5">Fleet Panel</span>
               </div>
               <div className="flex flex-col gap-2">
                 {filteredNav.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full",
                                isActive ? "bg-blue-600/10 text-blue-500 font-semibold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-5 h-5",
                                    isActive ? "filter drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" : ""
                                )}
                            />
                            <span>{item.label}</span>
                        </Link>
                    );
                 })}
               </div>
            </nav>
        );
    }

    return (
        <nav className="absolute bottom-0 left-0 right-0 z-50 h-[80px] bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 px-4 pb-safe pt-2">
            <div className="flex items-center justify-between h-full max-w-md mx-auto">
                {filteredNav.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full gap-1 transition-all duration-300",
                                isActive ? "text-blue-500 scale-110" : "text-slate-400 hover:text-slate-200"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-6 h-6",
                                    isActive ? "filter drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" : ""
                                )}
                            />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
