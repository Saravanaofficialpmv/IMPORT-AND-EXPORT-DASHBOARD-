import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const [totalVehicles, activeTrips, completedTrips, violations, alerts, vehicles] =
            await Promise.all([
                prisma.vehicle.count(),
                prisma.trip.count({ where: { status: "ACTIVE" } }),
                prisma.trip.count({ where: { status: "COMPLETED" } }),
                prisma.alert.count({ where: { resolved: false } }),
                prisma.alert.findMany({
                    orderBy: { createdAt: "desc" },
                    take: 10,
                    include: { vehicle: { select: { vehicleNumber: true } } },
                }),
                prisma.vehicle.findMany({
                    include: {
                        locations: {
                            orderBy: { timestamp: "desc" },
                            take: 1,
                        },
                    },
                }),
            ]);

        return NextResponse.json({
            totalVehicles,
            activeTrips,
            completedTrips,
            violations,
            alerts,
            vehicles,
        });
    } catch (error) {
        console.error("Dashboard API error:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
    }
}
