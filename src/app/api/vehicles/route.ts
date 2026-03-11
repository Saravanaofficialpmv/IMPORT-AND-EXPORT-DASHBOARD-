import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: vehicles, error } = await supabase
            .from("vehicles")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json(vehicles);
    } catch (error) {
        console.error("Vehicles GET error:", error);
        return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { data: vehicle, error } = await supabase
            .from("vehicles")
            .insert([
                {
                    vehicle_number: body.vehicleNumber,
                    driver_name: body.driverName,
                    driver_phone: body.driverPhone,
                    permit_id: body.permitId,
                    status: body.status || "ACTIVE",
                    manager_id: body.managerId,
                },
            ])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(vehicle, { status: 201 });
    } catch (error) {
        console.error("Vehicles POST error:", error);
        return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
    }
}
