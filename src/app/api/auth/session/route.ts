import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(null);
        }
        return NextResponse.json(session);
    } catch (error) {
        console.error("[v0] Session API error:", error);
        return NextResponse.json(null);
    }
}
