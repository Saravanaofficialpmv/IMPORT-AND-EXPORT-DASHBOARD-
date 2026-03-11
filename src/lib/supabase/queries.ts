import { createAdminClient } from "./admin";

// Use admin client to bypass RLS for authentication queries
export async function getUserByEmail(email: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("[v0] getUserByEmail error:", error.message);
    return null;
  }
  return data;
}

export async function getUserById(id: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[v0] getUserById error:", error.message);
    return null;
  }
  return data;
}

export async function createUser(
  email: string,
  name: string,
  passwordHash: string,
  role: string = "driver",
  phone?: string
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        email,
        name,
        password_hash: passwordHash,
        role,
        phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("[v0] createUser error:", error.message);
    return null;
  }
  return data;
}
