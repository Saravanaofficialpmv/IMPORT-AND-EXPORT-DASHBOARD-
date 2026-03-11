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
    { href: "/dashboard", label: "Home", icon: LayoutDashboard, roles: ["ADMIN", "MANAGER", "DRIVER"] },
    { href: "/dashboard/vehicles", label: "Vehicles", icon: Truck, roles: ["ADMIN", "MANAGER"] },
    { href: "/dashboard/tracking", label: "Map", icon: MapPin, roles: ["ADMIN", "MANAGER"] },
    { href: "/dashboard/alerts", label: "Alerts", icon: AlertTriangle, roles: ["ADMIN", "MANAGER"] },
    { href: "/dashboard/settings", label: "Menu", icon: Settings, roles: ["ADMIN", "MANAGER", "DRIVER"] },
];

export default function MobileNav() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const userRole = session?.user?.role || "DRIVER";

    const filteredNav = navItems.filter((item) => item.roles.includes(userRole)).slice(0, 5); // Mobile nav usually supports up to 5 icons

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
