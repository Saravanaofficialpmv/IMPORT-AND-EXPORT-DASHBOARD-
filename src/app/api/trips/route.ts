import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: trips, error } = await supabase
            .from("trips")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json(trips);
    } catch (error) {
        console.error("Trips GET error:", error);
        return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { data: trip, error } = await supabase
            .from("trips")
            .insert([
                {
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
                },
            ])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(trip, { status: 201 });
    } catch (error) {
        console.error("Trips POST error:", error);
        return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
    }
}
