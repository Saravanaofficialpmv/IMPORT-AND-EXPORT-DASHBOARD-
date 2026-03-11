import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();

        const [
            { count: totalVehicles },
            { count: activeTrips },
            { count: completedTrips },
            { count: violations },
            { data: alerts },
            { data: vehicles },
        ] = await Promise.all([
            supabase.from("vehicles").select("*", { count: "exact", head: true }),
            supabase.from("trips").select("*", { count: "exact", head: true }).eq("status", "ACTIVE"),
            supabase.from("trips").select("*", { count: "exact", head: true }).eq("status", "COMPLETED"),
            supabase.from("alerts").select("*", { count: "exact", head: true }).eq("resolved", false),
            supabase.from("alerts").select("*").order("created_at", { ascending: false }).limit(10),
            supabase.from("vehicles").select("*"),
        ]);

        return NextResponse.json({
            totalVehicles,
            activeTrips,
            completedTrips,
            violations,
            alerts,
            vehicles,
        });
    } catch (error) {
        console.error("Dashboard API error:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
    }
}
