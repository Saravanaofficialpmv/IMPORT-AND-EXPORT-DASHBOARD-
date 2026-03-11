import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const vehicle = await prisma.vehicle.update({
            where: { id },
            data: {
                vehicleNumber: body.vehicleNumber,
                driverName: body.driverName,
                driverPhone: body.driverPhone,
                permitId: body.permitId,
                status: body.status,
            },
        });
        return NextResponse.json(vehicle);
    } catch (error) {
        console.error("Vehicle PUT error:", error);
        return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.vehicle.delete({ where: { id } });
        return NextResponse.json({ message: "Vehicle deleted" });
    } catch (error) {
        console.error("Vehicle DELETE error:", error);
        return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 });
    }
}
