import { NextRequest, NextResponse } from "next/server";
import { mockDb } from "@/lib/mockDb";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const updateData: Record<string, unknown> = {};

        if (body.status) {
            updateData.status = body.status;
            if (body.status === "ACTIVE") {
                updateData.start_time = new Date().toISOString();
            }
            if (body.status === "COMPLETED") {
                updateData.end_time = new Date().toISOString();
            }
        }

        if (body.routeTaken) {
            updateData.route_taken = JSON.stringify(body.routeTaken);
        }

        const trip = mockDb.updateTrip(id, updateData);

        if (!trip) {
            return NextResponse.json({ error: "Trip not found" }, { status: 404 });
        }

        return NextResponse.json(trip);
    } catch (error) {
        console.error("Trip PUT error:", error);
        return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
    }
}
