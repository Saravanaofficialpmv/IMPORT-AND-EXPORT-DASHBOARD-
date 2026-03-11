import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = await createClient();
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

        const { data: trip, error } = await supabase
            .from("trips")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(trip);
    } catch (error) {
        console.error("Trip PUT error:", error);
        return NextResponse.json({ error: "Failed to update trip" }, { status: 500 });
    }
}
