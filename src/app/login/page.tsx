"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation, Eye, EyeOff, Truck, Shield, MapPin } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    const demoLogin = async (demoEmail: string) => {
        setEmail(demoEmail);
        setPassword("password123");
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email: demoEmail,
            password: "password123",
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900 to-cyan-900/30" />
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }} />

                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-2xl shadow-blue-500/30">
                            <Navigation className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Smart GPS</h1>
                            <p className="text-sm text-slate-400 tracking-widest uppercase">Vehicle Tracking System</p>
                        </div>
                    </div>

                    <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                        Monitor Your Fleet
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            In Real-Time
                        </span>
                    </h2>

                    <p className="text-lg text-slate-400 mb-10 max-w-lg">
                        Complete visibility into your import & export logistics. Track vehicles,
                        manage trips, verify permits, and ensure compliance — all from one dashboard.
                    </p>

                    <div className="grid grid-cols-3 gap-6 max-w-lg">
                        <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm">
                            <Truck className="w-8 h-8 text-blue-400 mb-2" />
                            <span className="text-2xl font-bold text-white">500+</span>
                            <span className="text-xs text-slate-400">Vehicles</span>
                        </div>
                        <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm">
                            <MapPin className="w-8 h-8 text-cyan-400 mb-2" />
                            <span className="text-2xl font-bold text-white">24/7</span>
                            <span className="text-xs text-slate-400">Tracking</span>
                        </div>
                        <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm">
                            <Shield className="w-8 h-8 text-emerald-400 mb-2" />
                            <span className="text-2xl font-bold text-white">99.9%</span>
                            <span className="text-xs text-slate-400">Uptime</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30">
                            <Navigation className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Smart GPS Tracker</h1>
                            <p className="text-xs text-slate-400 tracking-widest uppercase">Vehicle Monitoring</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white">Welcome back</h2>
                        <p className="text-slate-400 mt-1">Sign in to your account to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-11" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    {/* Demo Accounts */}
                    <div className="mt-8 pt-6 border-t border-slate-800">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 text-center">Quick Demo Access</p>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => demoLogin("admin@gps.com")}
                                className="flex flex-col items-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-800 transition-all text-xs"
                            >
                                <Shield className="w-5 h-5 text-blue-400 mb-1.5" />
                                <span className="text-slate-300 font-medium">Admin</span>
                            </button>
                            <button
                                onClick={() => demoLogin("manager@gps.com")}
                                className="flex flex-col items-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800 transition-all text-xs"
                            >
                                <Truck className="w-5 h-5 text-cyan-400 mb-1.5" />
                                <span className="text-slate-300 font-medium">Manager</span>
                            </button>
                            <button
                                onClick={() => demoLogin("driver1@gps.com")}
                                className="flex flex-col items-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 hover:bg-slate-800 transition-all text-xs"
                            >
                                <MapPin className="w-5 h-5 text-emerald-400 mb-1.5" />
                                <span className="text-slate-300 font-medium">Driver</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
