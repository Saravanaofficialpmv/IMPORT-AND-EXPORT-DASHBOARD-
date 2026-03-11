import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mockDb";

export async function GET() {
    try {
        const trips = mockDb.getTrips();
        return NextResponse.json(trips);
    } catch (error) {
        console.error("Trips GET error:", error);
        return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const trip = mockDb.createTrip({
            origin: body.origin,
            destination: body.destination,
            origin_lat: body.originLat || 0,
            origin_lng: body.originLng || 0,
            dest_lat: body.destLat || 0,
            dest_lng: body.destLng || 0,
            cargo: body.cargo,
            permit_id: body.permitId,
            allowed_trips: body.allowedTrips || 1,
            status: "PENDING",
            vehicle_id: body.vehicleId,
            driver_id: body.driverId,
            manager_id: body.managerId,
        });

        return NextResponse.json(trip, { status: 201 });
    } catch (error) {
        console.error("Trips POST error:", error);
        return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
    }
}
