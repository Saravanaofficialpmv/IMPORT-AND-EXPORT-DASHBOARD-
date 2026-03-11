import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mockDb";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        
        const vehicle = mockDb.updateVehicle(id, {
            vehicle_number: body.vehicleNumber,
            driver_name: body.driverName,
            driver_phone: body.driverPhone,
            permit_id: body.permitId,
            status: body.status,
        });

        if (!vehicle) {
            return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
        }

        return NextResponse.json(vehicle);
    } catch (error) {
        console.error("Vehicle PUT error:", error);
        return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        
        mockDb.deleteVehicle(id);
        
        return NextResponse.json({ message: "Vehicle deleted" });
    } catch (error) {
        console.error("Vehicle DELETE error:", error);
        return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 });
    }
}
