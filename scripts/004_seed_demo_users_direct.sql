-- Seed demo users directly into the users table
-- Password: password123
-- Bcrypt hash (10 rounds): $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/OFS

-- First, temporarily disable RLS for seeding (only service role can do this)
-- This is run with SUPABASE_SERVICE_ROLE_KEY which bypasses RLS

-- Delete existing demo users if they exist (to allow re-seeding)
DELETE FROM public.users WHERE email IN ('admin@gps.com', 'manager@gps.com', 'driver1@gps.com');

-- Insert Admin user
INSERT INTO public.users (id, email, name, password_hash, role, phone, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@gps.com',
  'Admin User',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/OFS',
  'admin',
  '+1-555-0100',
  now(),
  now()
);

-- Insert Manager user
INSERT INTO public.users (id, email, name, password_hash, role, phone, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'manager@gps.com',
  'Manager User',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/OFS',
  'manager',
  '+1-555-0101',
  now(),
  now()
);

-- Insert Driver user
INSERT INTO public.users (id, email, name, password_hash, role, phone, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'driver1@gps.com',
  'Driver User',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/OFS',
  'driver',
  '+1-555-0102',
  now(),
  now()
);
