"use client";

import { useSession, signOut } from "next-auth/react";
import { Bell, User, Navigation } from "lucide-react";

export default function Topbar() {
    const { data: session } = useSession();

    return (
        <header className="sticky top-0 z-30 h-16 pt-3 pb-2 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
            <div className="flex items-center justify-between h-full px-4">
                {/* Left: Logo & Title */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-[10px] bg-gradient-to-br from-blue-600 to-blue-500 shadow-soft">
                        <Navigation className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight text-white leading-none">Smart GPS</span>
                        <span className="text-[9px] text-blue-400 font-medium uppercase tracking-widest mt-0.5">Mobile</span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    <button className="relative p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-300">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border-2 border-slate-950" />
                    </button>

                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold shadow-soft overflow-hidden"
                    >
                        {session?.user?.name?.charAt(0) || <User className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </header>
    );
}
