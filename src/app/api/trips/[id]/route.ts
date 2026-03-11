import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const updateData: Record<string, unknown> = {};

        if (body.status) {
            updateData.status = body.status;
            if (body.status === "ACTIVE") {
                updateData.startTime = new Date();
            }
            if (body.status === "COMPLETED") {
                updateData.endTime = new Date();
            }
        }

        if (body.routeTaken) {
            updateData.routeTaken = JSON.stringify(body.routeTaken);
        }

        const trip = await prisma.trip.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(trip);
    } catch (error) {
        console.error("Trip PUT error:", error);
        return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
    }
}
