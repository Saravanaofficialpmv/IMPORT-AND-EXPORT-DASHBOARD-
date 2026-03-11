"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation, Eye, EyeOff, Truck, Shield, MapPin, Lock, Mail, ArrowRight, CheckCircle2, User, Phone, AlertCircle } from "lucide-react";

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        role: "driver",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) return "Name is required";
        if (!formData.email.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Invalid email format";
        if (formData.password.length < 8) return "Password must be at least 8 characters";
        if (formData.password !== formData.confirmPassword) return "Passwords do not match";
        return "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone || null,
                    role: formData.role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to create account");
                setLoading(false);
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err) {
            setError("An error occurred. Please try again.");
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6">
                <div className="w-full max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">Account Created!</h1>
                    <p className="text-slate-400 mb-6">Your account has been created successfully. Redirecting to login...</p>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            {/* Top Navigation */}
            <div className="relative z-20 px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
                        <Navigation className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">FleetTrack Pro</h1>
                        <p className="text-xs text-slate-400">Vehicle Monitoring</p>
                    </div>
                </Link>
                <Link href="/login" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                    Sign In
                </Link>
            </div>

            <div className="flex-1 flex lg:flex-row flex-col relative z-10">
                {/* Left Panel - Branding & Benefits */}
                <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center px-12 xl:px-20">
                    <div className="max-w-2xl">
                        <h2 className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
                            Join FleetTrack
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                Today
                            </span>
                        </h2>

                        <p className="text-lg text-slate-300 mb-12 max-w-lg leading-relaxed">
                            Start managing your fleet with real-time GPS tracking, comprehensive analytics, and enterprise-grade security features.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: MapPin, label: "Real-time Location Tracking", color: "cyan" },
                                { icon: Shield, label: "Enterprise Security & Compliance", color: "blue" },
                                { icon: Truck, label: "Support for 500+ Vehicles", color: "emerald" }
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
                    </div>
                </div>

                {/* Right Panel - Signup Form */}
                <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
                    <div className="w-full max-w-sm">
                        <div className="mb-8">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                                <User className="w-3 h-3 text-blue-400 mr-2" />
                                <span className="text-xs text-blue-300 font-semibold uppercase tracking-wider">Create Account</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white">Get Started</h2>
                            <p className="text-slate-400 mt-2 text-sm">Create your account to access the fleet management dashboard</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-red-400 text-sm font-medium">Error</p>
                                        <p className="text-red-300/70 text-xs mt-1">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-semibold text-slate-200">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="pl-10 h-11 bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-slate-800 transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-slate-200">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@company.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-10 h-11 bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-slate-800 transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone (Optional) */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-semibold text-slate-200">Phone Number (Optional)</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="pl-10 h-11 bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-slate-800 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-sm font-semibold text-slate-200">Role</Label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full h-11 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-100 focus:border-blue-500/50 focus:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    <option value="driver">Driver</option>
                                    <option value="manager">Fleet Manager</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-slate-200">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
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
                                <p className="text-xs text-slate-400">Minimum 8 characters</p>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-200">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="pl-10 pr-10 h-11 bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-slate-800 transition-colors"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Terms & Conditions */}
                            <div className="flex items-start gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 cursor-pointer mt-1"
                                    required
                                />
                                <label htmlFor="terms" className="text-xs text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                                    I agree to the{" "}
                                    <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
                                    {" "}and{" "}
                                    <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
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
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Sign In Link */}
                        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                            <p className="text-slate-400 text-sm">
                                Already have an account?{" "}
                                <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
