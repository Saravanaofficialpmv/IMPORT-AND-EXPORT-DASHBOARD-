-- Fix users table to work with NextAuth (not Supabase Auth)
-- Remove the foreign key constraint to auth.users since we're using custom authentication

-- Drop the foreign key constraint if it exists
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Ensure the users table has the correct structure
-- First, let's check if we need to recreate it
DO $$
BEGIN
    -- Add id column if missing or fix it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'id') THEN
        ALTER TABLE public.users ADD COLUMN id uuid PRIMARY KEY DEFAULT gen_random_uuid();
    END IF;
END $$;

-- Now insert demo users with pre-generated UUIDs
-- Password: password123 (bcrypt hash with 10 rounds)
INSERT INTO public.users (id, email, name, password_hash, role, phone, created_at, updated_at)
VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'admin@gps.com',
    'Admin User',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/OFS',
    'admin',
    '+1-555-0100',
    now(),
    now()
)
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    updated_at = now();

INSERT INTO public.users (id, email, name, password_hash, role, phone, created_at, updated_at)
VALUES (
    'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e',
    'manager@gps.com',
    'Manager User',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/OFS',
    'manager',
    '+1-555-0101',
    now(),
    now()
)
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    updated_at = now();

INSERT INTO public.users (id, email, name, password_hash, role, phone, created_at, updated_at)
VALUES (
    'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f',
    'driver1@gps.com',
    'Driver User',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/OFS',
    'driver',
    '+1-555-0102',
    now(),
    now()
)
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    updated_at = now();
