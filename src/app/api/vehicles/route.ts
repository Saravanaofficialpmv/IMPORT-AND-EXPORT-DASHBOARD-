import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const vehicles = await prisma.vehicle.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                manager: { select: { name: true } },
                _count: { select: { trips: true } },
            },
        });
        return NextResponse.json(vehicles);
    } catch (error) {
        console.error("Vehicles GET error:", error);
        return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const vehicle = await prisma.vehicle.create({
            data: {
                vehicleNumber: body.vehicleNumber,
                driverName: body.driverName,
                driverPhone: body.driverPhone,
                permitId: body.permitId,
                status: body.status || "ACTIVE",
                managerId: body.managerId,
            },
        });
        return NextResponse.json(vehicle, { status: 201 });
    } catch (error) {
        console.error("Vehicles POST error:", error);
        return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
    }
}
