import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = await createClient();
        const { id } = await params;
        const body = await req.json();
        
        const { data: vehicle, error } = await supabase
            .from("vehicles")
            .update({
                vehicle_number: body.vehicleNumber,
                driver_name: body.driverName,
                driver_phone: body.driverPhone,
                permit_id: body.permitId,
                status: body.status,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(vehicle);
    } catch (error) {
        console.error("Vehicle PUT error:", error);
        return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = await createClient();
        const { id } = await params;
        
        const { error } = await supabase.from("vehicles").delete().eq("id", id);
        
        if (error) throw error;
        return NextResponse.json({ message: "Vehicle deleted" });
    } catch (error) {
        console.error("Vehicle DELETE error:", error);
        return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 });
    }
}
