import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        // Return empty object instead of null to prevent client-side errors
        if (!session) {
            return NextResponse.json({ user: null });
        }
        return NextResponse.json(session);
    } catch (error) {
        console.error("[v0] Session API error:", error);
        return NextResponse.json({ user: null, error: "Failed to get session" });
    }
}
