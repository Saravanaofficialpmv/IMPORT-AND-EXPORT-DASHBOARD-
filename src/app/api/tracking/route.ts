import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const vehicles = await prisma.vehicle.findMany({
            include: {
                locations: {
                    orderBy: { timestamp: "desc" },
                    take: 1,
                },
                trips: {
                    where: { status: "ACTIVE" },
                    take: 1,
                    select: {
                        id: true,
                        origin: true,
                        destination: true,
                        cargo: true,
                        routeTaken: true,
                        driver: { select: { name: true } },
                    },
                },
            },
        });

        const trackingData = vehicles
            .filter((v) => v.locations.length > 0)
            .map((v) => ({
                id: v.id,
                vehicleNumber: v.vehicleNumber,
                status: v.status,
                lat: v.locations[0].lat,
                lng: v.locations[0].lng,
                speed: v.locations[0].speed,
                heading: v.locations[0].heading,
                lastUpdate: v.locations[0].timestamp,
                activeTrip: v.trips[0] || null,
                driverName: v.driverName,
            }));

        return NextResponse.json(trackingData);
    } catch (error) {
        console.error("Tracking GET error:", error);
        return NextResponse.json({ error: "Failed to fetch tracking data" }, { status: 500 });
    }
}
