import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

        const supabase = await createClient();

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

        // Create user
        const { data: newUser, error: userError } = await supabase
            .from("users")
            .insert([
                {
                    email,
                    password_hash: hashedPassword,
                    name,
                    phone: phone || null,
                    role,
                },
            ])
            .select()
            .single();

        if (userError) {
            console.error("User creation error:", userError);
            return NextResponse.json(
                { error: "Failed to create account" },
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
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "An error occurred during signup" },
            { status: 500 }
        );
    }
}
