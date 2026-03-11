import { createClient } from "./server";

export async function getUserByEmail(email: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return null;
  return data;
}

export async function getUserById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createUser(email: string, name: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .insert([{ email, name, password }])
    .select()
    .single();

  if (error) return null;
  return data;
}
