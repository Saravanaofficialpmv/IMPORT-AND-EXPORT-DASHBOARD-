import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mockDb";

export async function GET() {
    try {
        const vehicles = mockDb.getVehicles();
        const trips = mockDb.getTrips();
        const alerts = mockDb.getAlerts();

        const mappedAlerts = alerts.map((a: any) => ({
            ...a,
            vehicle: vehicles.find((v: any) => v.id === a.vehicle_id) || null,
            trip: trips.find((t: any) => t.id === a.trip_id) || null,
        }));

        return NextResponse.json(mappedAlerts);
    } catch (error) {
        console.error("Alerts GET error:", error);
        return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        
        const alert = mockDb.updateAlert(body.id, { resolved: body.resolved });

        if (!alert) {
            return NextResponse.json({ error: "Alert not found" }, { status: 404 });
        }

        return NextResponse.json(alert);
    } catch (error) {
        console.error("Alerts PUT error:", error);
        return NextResponse.json({ error: "Failed to update alert" }, { status: 500 });
    }
}
