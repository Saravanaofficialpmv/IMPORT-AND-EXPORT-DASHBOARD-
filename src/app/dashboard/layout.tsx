"use client";

import Topbar from "@/components/topbar";
import MobileNav from "@/components/mobile-nav";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen w-full bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm font-medium tracking-wide">Initializing App...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex bg-slate-950 min-h-screen">
            {/* Desktop Sidebar (hidden on mobile) */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 relative z-20">
                <MobileNav isDesktop={true} />
            </div>

            {/* Main content wrapper */}
            <div className="flex flex-col w-full md:pl-64">
                <Topbar />
                <main className="flex-1 overflow-y-auto w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-[80px] md:pb-0 relative scroll-smooth no-scrollbar">
                    {children}
                </main>
                {/* Mobile Bottom Nav */}
                <div className="md:hidden">
                    <MobileNav isDesktop={false} />
                </div>
            </div>
        </div>
    );
}
