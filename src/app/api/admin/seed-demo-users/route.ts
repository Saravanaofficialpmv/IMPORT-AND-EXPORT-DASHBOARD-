import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";

const DEMO_USERS = [
  {
    email: "admin@gps.com",
    password: "password123",
    name: "Admin User",
    phone: "+1-555-0100",
    role: "admin",
  },
  {
    email: "manager@gps.com",
    password: "password123",
    name: "Manager User",
    phone: "+1-555-0101",
    role: "manager",
  },
  {
    email: "driver1@gps.com",
    password: "password123",
    name: "Driver User 1",
    phone: "+1-555-0102",
    role: "driver",
  },
];

export async function POST(req: NextRequest) {
  try {
    // Check for admin API key (simple protection)
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    const results = [];

    for (const user of DEMO_USERS) {
      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Check if user already exists
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();

        if (existingUser) {
          results.push({
            email: user.email,
            status: "exists",
            message: "User already exists",
          });
          continue;
        }

        // Create user in public.users table
        const { data: newUser, error: userError } = await supabase
          .from("users")
          .insert([
            {
              email: user.email,
              password_hash: hashedPassword,
              name: user.name,
              phone: user.phone,
              role: user.role,
            },
          ])
          .select()
          .single();

        if (userError) {
          results.push({
            email: user.email,
            status: "failed",
            error: userError.message,
          });
        } else {
          results.push({
            email: user.email,
            status: "created",
            id: newUser.id,
          });
        }
      } catch (error) {
        results.push({
          email: user.email,
          status: "error",
          error: String(error),
        });
      }
    }

    return NextResponse.json(
      {
        message: "Demo user seeding completed",
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed demo users" },
      { status: 500 }
    );
  }
}
