"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation, Eye, EyeOff, Truck, Shield, MapPin, Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            {/* Top Navigation */}
            <div className="relative z-20 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
                        <Navigation className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">FleetTrack Pro</h1>
                        <p className="text-xs text-slate-400">Vehicle Monitoring</p>
                    </div>
                </div>
                <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                    Help
                </a>
            </div>

            <div className="flex-1 flex lg:flex-row flex-col relative z-10">
                {/* Left Panel - Branding & Benefits */}
                <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center px-12 xl:px-20">
                    <div className="max-w-2xl">
                        <h2 className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
                            Real-time GPS
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                Fleet Tracking
                            </span>
                        </h2>

                        <p className="text-lg text-slate-300 mb-12 max-w-lg leading-relaxed">
                            Monitor your entire import & export fleet with real-time location tracking, comprehensive analytics, and advanced security features.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: MapPin, label: "Real-time Location Tracking", color: "cyan" },
                                { icon: Shield, label: "Enterprise Security & Compliance", color: "blue" },
                                { icon: Truck, label: "500+ Vehicles Managed Daily", color: "emerald" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm hover:bg-slate-800/50 transition-all">
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-${item.color}-500/10 flex items-center justify-center border border-${item.color}-500/20`}>
                                        <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                                    </div>
                                    <div className="flex items-center justify-between flex-1">
                                        <span className="text-slate-200 font-medium">{item.label}</span>
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-700/30">
                            <p className="text-sm text-slate-400 mb-4">Trusted by leading logistics companies</p>
                            <div className="flex gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">500+</div>
                                    <div className="text-xs text-slate-400">Active Vehicles</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">99.9%</div>
                                    <div className="text-xs text-slate-400">Uptime SLA</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">24/7</div>
                                    <div className="text-xs text-slate-400">Live Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
                    <div className="w-full max-w-sm">
                        <div className="mb-8">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                                <Lock className="w-3 h-3 text-blue-400 mr-2" />
                                <span className="text-xs text-blue-300 font-semibold uppercase tracking-wider">Secure Login</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                            <p className="text-slate-400 mt-2 text-sm">Sign in to access your fleet management dashboard</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 animate-in">
                                    <div className="w-5 h-5 rounded-full bg-red-500/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                                        <div className="w-2 h-2 bg-red-400 rounded-full" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-red-400 text-sm font-medium">Authentication Failed</p>
                                        <p className="text-red-300/70 text-xs mt-1">{error}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-slate-200">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@fleettrack.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-11 bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-slate-800 transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-semibold text-slate-200">Password</Label>
                                    <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot?</a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10 h-11 bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-slate-800 transition-colors"
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

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 cursor-pointer"
                                />
                                <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                                    Keep me signed in for 30 days
                                </label>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Demo Accounts Section */}
                        <div className="mt-10 pt-8 border-t border-slate-800">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-4 text-center">Quick Demo Access</p>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { email: "admin@gps.com", icon: Shield, label: "Admin", color: "from-blue-600 to-blue-700" },
                                    { email: "manager@gps.com", icon: Truck, label: "Manager", color: "from-cyan-600 to-cyan-700" },
                                    { email: "driver1@gps.com", icon: MapPin, label: "Driver", color: "from-emerald-600 to-emerald-700" }
                                ].map((demo, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => demoLogin(demo.email)}
                                        className={`flex flex-col items-center p-3 rounded-xl bg-gradient-to-br ${demo.color} border border-slate-700/30 hover:border-white/20 transition-all duration-200 group hover:shadow-lg hover:shadow-blue-500/10 active:scale-95`}
                                    >
                                        <demo.icon className="w-5 h-5 text-white mb-1.5 group-hover:scale-110 transition-transform" />
                                        <span className="text-xs font-semibold text-white">{demo.label}</span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500 text-center mt-3">Password: <span className="text-slate-400 font-mono">password123</span></p>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-slate-800">
                            <p className="text-xs text-slate-500 text-center">
                                By signing in, you agree to our{" "}
                                <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
                                {" "}and{" "}
                                <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
