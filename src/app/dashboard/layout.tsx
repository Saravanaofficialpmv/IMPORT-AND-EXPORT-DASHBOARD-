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
            <div className="flex items-center justify-center h-[100dvh] w-full bg-slate-950 sm:max-w-[400px] sm:h-[850px] sm:mx-auto sm:my-8 sm:rounded-[3rem] sm:border-[8px] sm:border-slate-800 sm:shadow-2xl ring-1 ring-slate-900 overflow-hidden relative">
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
        <div className="flex items-center justify-center min-h-screen bg-slate-900/50 sm:p-4 perspective-[1000px]">
            {/* The "Phone" Container */}
            <div className="flex flex-col w-full h-[100dvh] bg-slate-950 sm:max-w-[400px] sm:h-[852px] sm:mx-auto sm:rounded-[3rem] sm:border-[8px] sm:border-slate-800 sm:shadow-2xl ring-1 ring-slate-900 overflow-hidden relative transform-gpu sm:transition-transform hover:sm:scale-[1.01]">

                {/* Optional Status bar mock if viewed on desktop */}
                <div className="hidden sm:flex justify-between items-center px-6 py-2 pb-0 opacity-80 z-50 absolute top-0 w-full pointer-events-none text-white text-[10px] font-medium tracking-wider">
                    <span>9:41</span>
                    <div className="flex gap-1">
                        <div className="w-4 h-2.5 bg-white/20 border border-white/50 rounded-[4px] relative">
                            <div className="absolute left-0 top-0 bottom-0 bg-white w-[70%] rounded-[2px] m-[1px]" />
                        </div>
                    </div>
                </div>

                {/* Topbar inside the phone frame */}
                <Topbar />

                {/* Main scrollable content area */}
                <main className="flex-1 overflow-y-auto w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-[100px] relative scroll-smooth no-scrollbar">
                    {children}
                </main>

                {/* Bottom Navigation */}
                <MobileNav />
            </div>
        </div>
    );
}
