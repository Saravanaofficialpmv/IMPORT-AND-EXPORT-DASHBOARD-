import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mockDb";

export async function GET() {
    try {
        const vehicles = mockDb.getVehicles();
        const trips = mockDb.getTrips();
        const alerts = mockDb.getAlerts();

        const totalVehicles = vehicles.length;
        const activeTrips = trips.filter((t: any) => t.status === "ACTIVE").length;
        const completedTrips = trips.filter((t: any) => t.status === "COMPLETED").length;
        
        const activeAlerts = alerts.filter((a: any) => !a.resolved);
        const violations = activeAlerts.length;
        
        // Populate vehicle into alerts
        const mappedAlerts = alerts.slice(0, 10).map((a: any) => ({
            ...a,
             vehicle: vehicles.find((v: any) => v.id === a.vehicle_id) || null
        }));

        const locations = mockDb.getLocations();
        const mappedVehicles = vehicles.map((v: any) => ({
            id: v.id,
            vehicleNumber: v.vehicle_number,
            status: v.status,
            locations: locations.filter((l: any) => l.vehicle_id === v.id)
        }));

        return NextResponse.json({
            totalVehicles,
            activeTrips,
            completedTrips,
            violations,
            alerts: mappedAlerts,
            vehicles: mappedVehicles,
        });
    } catch (error) {
        console.error("Dashboard API error:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
    }
}
