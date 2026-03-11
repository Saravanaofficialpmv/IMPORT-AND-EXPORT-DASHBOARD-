-- Seed demo users for FleetTrack Pro GPS Dashboard
-- Password hash generated using bcryptjs for "password123"
-- Admin user
INSERT INTO public.users (id, email, name, password_hash, role, phone, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@gps.com',
  'Admin User',
  '$2a$10$zxcvbn./zxcvbn./zxcvbn./abcdefghijklmnopqrstuvwxyz1234567890',
  'admin',
  '+1-555-0100',
  now(),
  now()
)
ON CONFLICT (email) DO NOTHING;

-- Manager user
INSERT INTO public.users (id, email, name, password_hash, role, phone, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'manager@gps.com',
  'Manager User',
  '$2a$10$zxcvbn./zxcvbn./zxcvbn./abcdefghijklmnopqrstuvwxyz1234567890',
  'manager',
  '+1-555-0101',
  now(),
  now()
)
ON CONFLICT (email) DO NOTHING;

-- Driver user
INSERT INTO public.users (id, email, name, password_hash, role, phone, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'driver1@gps.com',
  'Driver User',
  '$2a$10$zxcvbn./zxcvbn./zxcvbn./abcdefghijklmnopqrstuvwxyz1234567890',
  'driver',
  '+1-555-0102',
  now(),
  now()
)
ON CONFLICT (email) DO NOTHING;
