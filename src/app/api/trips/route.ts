import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const trips = await prisma.trip.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                vehicle: { select: { vehicleNumber: true } },
                driver: { select: { name: true } },
                manager: { select: { name: true } },
                _count: { select: { alerts: true } },
            },
        });
        return NextResponse.json(trips);
    } catch (error) {
        console.error("Trips GET error:", error);
        return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const trip = await prisma.trip.create({
            data: {
                origin: body.origin,
                destination: body.destination,
                originLat: body.originLat || 0,
                originLng: body.originLng || 0,
                destLat: body.destLat || 0,
                destLng: body.destLng || 0,
                cargo: body.cargo,
                permitId: body.permitId,
                allowedTrips: body.allowedTrips || 1,
                status: "PENDING",
                vehicleId: body.vehicleId,
                driverId: body.driverId,
                managerId: body.managerId,
            },
        });
        return NextResponse.json(trip, { status: 201 });
    } catch (error) {
        console.error("Trips POST error:", error);
        return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
    }
}
