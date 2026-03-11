"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
    const { data: session } = useSession();

    return (
        <div className="space-y-6 animate-fade-in-up max-w-3xl">
            <div>
                <h1 className="page-title">Settings</h1>
                <p className="page-description">Manage your account and preferences</p>
            </div>

            {/* Profile */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-400" /> Profile Settings
                    </CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-slate-700/50">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                            {session?.user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">{session?.user?.name}</h3>
                            <p className="text-sm text-slate-400">{session?.user?.email}</p>
                            <Badge variant="default" className="mt-1">{session?.user?.role}</Badge>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input defaultValue={session?.user?.name || ""} />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input defaultValue={session?.user?.email || ""} type="email" />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input placeholder="+91 9876543210" />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Input value={session?.user?.role || ""} disabled className="opacity-60" />
                        </div>
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-amber-400" /> Notification Preferences
                    </CardTitle>
                    <CardDescription>Configure how you receive alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        { label: "Route Deviation Alerts", desc: "Get notified when a vehicle deviates from its route", default: true },
                        { label: "Permit Violation Alerts", desc: "Alerts for permit misuse or expired permits", default: true },
                        { label: "Trip Completion Notifications", desc: "Notify when trips are completed", default: false },
                        { label: "Daily Summary Reports", desc: "Receive daily fleet summary via email", default: false },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-700/30 last:border-0">
                            <div>
                                <p className="text-sm font-medium text-slate-200">{item.label}</p>
                                <p className="text-xs text-slate-400">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Security */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-400" /> Security
                    </CardTitle>
                    <CardDescription>Manage your security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Current Password</Label>
                        <Input type="password" placeholder="Enter current password" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>New Password</Label>
                            <Input type="password" placeholder="Enter new password" />
                        </div>
                        <div className="space-y-2">
                            <Label>Confirm Password</Label>
                            <Input type="password" placeholder="Confirm new password" />
                        </div>
                    </div>
                    <Button>Update Password</Button>
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5 text-purple-400" /> Appearance
                    </CardTitle>
                    <CardDescription>Customize the look and feel</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <button className="p-4 rounded-xl border-2 border-blue-500 bg-slate-900 text-center">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 mx-auto mb-2 border border-slate-700" />
                            <span className="text-xs text-slate-300">Dark</span>
                        </button>
                        <button className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/50 text-center opacity-50 cursor-not-allowed">
                            <div className="w-8 h-8 rounded-lg bg-white mx-auto mb-2 border border-slate-300" />
                            <span className="text-xs text-slate-400">Light</span>
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
