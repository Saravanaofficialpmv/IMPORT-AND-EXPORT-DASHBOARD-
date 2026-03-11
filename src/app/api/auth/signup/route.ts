import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import bcrypt from "bcryptjs";

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

        // Use admin client to bypass RLS
        const supabase = createAdminClient();

        // Check if user exists
        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user using admin client (bypasses RLS)
        const { data: newUser, error: userError } = await supabase
            .from("users")
            .insert([
                {
                    email,
                    password_hash: hashedPassword,
                    name,
                    phone: phone || null,
                    role,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (userError) {
            console.error("[v0] User insert error:", userError);
            return NextResponse.json(
                { error: userError.message || "Failed to create account. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                message: "Account created successfully",
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                    role: newUser.role,
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
