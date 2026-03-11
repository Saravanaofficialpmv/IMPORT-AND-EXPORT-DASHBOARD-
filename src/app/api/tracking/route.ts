import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: vehicles, error } = await supabase.from("vehicles").select("*");

        if (error) throw error;

        const { data: locations, error: locError } = await supabase
            .from("vehicle_locations")
            .select("*")
            .order("timestamp", { ascending: false });

        if (locError) throw locError;

        const trackingData = vehicles.map((v) => {
            const latestLocation = locations.find((l) => l.vehicle_id === v.id);
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
            };
        });

        return NextResponse.json(trackingData);
    } catch (error) {
        console.error("Tracking GET error:", error);
        return NextResponse.json({ error: "Failed to fetch tracking data" }, { status: 500 });
    }
}
