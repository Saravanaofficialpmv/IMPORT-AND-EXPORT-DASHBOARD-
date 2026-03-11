-- Seed demo users for FleetTrack Pro GPS Dashboard
-- Password: password123
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/OFS (bcryptjs round 10)

-- Admin user
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
)
ON CONFLICT (email) DO NOTHING;

-- Manager user
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
)
ON CONFLICT (email) DO NOTHING;

-- Driver user 1
INSERT INTO public.users (id, email, name, password_hash, role, phone, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'driver1@gps.com',
  'Driver User 1',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/OFS',
  'driver',
  '+1-555-0102',
  now(),
  now()
)
ON CONFLICT (email) DO NOTHING;
