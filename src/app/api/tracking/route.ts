import { NextResponse } from "next/server";
import { mockDb } from "@/lib/mockDb";

export async function GET() {
    try {
        const vehicles = mockDb.getVehicles();
        const locations = mockDb.getLocations();
        const trips = mockDb.getTrips();

        const trackingData = vehicles.map((v: any) => {
            const latestLocation = locations.find((l: any) => l.vehicle_id === v.id);
            const activeTrip = trips.find((t: any) => t.vehicle_id === v.id && t.status === "ACTIVE");

            return {
                id: v.id,
                vehicleNumber: v.vehicle_number,
                status: v.status,
                lat: latestLocation?.lat || 0,
                lng: latestLocation?.lng || 0,
                speed: latestLocation?.speed || 0,
                heading: latestLocation?.heading || 0,
                lastUpdate: latestLocation?.timestamp || null,
                driverName: v.driver_name,
                activeTrip: activeTrip ? {
                    origin: activeTrip.origin,
                    destination: activeTrip.destination,
                    cargo: activeTrip.cargo,
                    routeTaken: activeTrip.route_taken
                } : null
            };
        });

        return NextResponse.json(trackingData);
    } catch (error) {
        console.error("Tracking GET error:", error);
        return NextResponse.json({ error: "Failed to fetch tracking data" }, { status: 500 });
    }
}
