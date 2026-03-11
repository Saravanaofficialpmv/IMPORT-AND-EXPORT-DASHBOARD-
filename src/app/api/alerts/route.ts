import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const alerts = await prisma.alert.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                vehicle: { select: { vehicleNumber: true } },
                trip: { select: { origin: true, destination: true } },
            },
        });
        return NextResponse.json(alerts);
    } catch (error) {
        console.error("Alerts GET error:", error);
        return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const alert = await prisma.alert.update({
            where: { id: body.id },
            data: { resolved: body.resolved },
        });
        return NextResponse.json(alert);
    } catch (error) {
        console.error("Alerts PUT error:", error);
        return NextResponse.json({ error: "Failed to update alert" }, { status: 500 });
    }
}
