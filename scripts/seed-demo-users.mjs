import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("[v0] Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const demoUsers = [
  {
    email: "admin@gps.com",
    password: "password123",
    name: "Admin User",
    role: "admin",
    phone: "+1-555-0100",
  },
  {
    email: "manager@gps.com",
    password: "password123",
    name: "Manager User",
    role: "manager",
    phone: "+1-555-0101",
  },
  {
    email: "driver1@gps.com",
    password: "password123",
    name: "Driver User 1",
    role: "driver",
    phone: "+1-555-0102",
  },
];

async function seedDemoUsers() {
  console.log("[v0] Starting demo user creation...");

  for (const user of demoUsers) {
    try {
      // Create user in auth.users table
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      });

      if (error) {
        console.error(`[v0] Error creating auth user ${user.email}:`, error.message);
        continue;
      }

      console.log(`[v0] Created auth user: ${user.email} (ID: ${data.user.id})`);

      // Insert into public.users table
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
        },
      ]);

      if (insertError) {
        console.error(`[v0] Error inserting user record ${user.email}:`, insertError.message);
      } else {
        console.log(`[v0] Successfully created user: ${user.email} (${user.role})`);
      }
    } catch (err) {
      console.error(`[v0] Unexpected error for ${user.email}:`, err);
    }
  }

  console.log("[v0] Demo user creation completed!");
}

seedDemoUsers();
