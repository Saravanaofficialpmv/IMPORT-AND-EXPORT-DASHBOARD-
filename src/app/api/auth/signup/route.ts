import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, name, phone, role = "driver" } = body;

        // Validation
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Email, password, and name are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // Mock successful signup since we are bypassing Supabase for now
        return NextResponse.json(
            {
                message: "Account created successfully (Mock)",
                user: {
                    id: "mock-user-id",
                    email,
                    name,
                    role,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        console.error("[v0] Signup error:", errorMsg);
        return NextResponse.json(
            { error: "An error occurred during signup: " + errorMsg },
            { status: 500 }
        );
    }
}
