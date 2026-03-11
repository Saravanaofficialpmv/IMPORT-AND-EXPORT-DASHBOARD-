import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: alerts, error } = await supabase
            .from("alerts")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json(alerts);
    } catch (error) {
        console.error("Alerts GET error:", error);
        return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { data: alert, error } = await supabase
            .from("alerts")
            .update({ resolved: body.resolved })
            .eq("id", body.id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(alert);
    } catch (error) {
        console.error("Alerts PUT error:", error);
        return NextResponse.json({ error: "Failed to update alert" }, { status: 500 });
    }
}
