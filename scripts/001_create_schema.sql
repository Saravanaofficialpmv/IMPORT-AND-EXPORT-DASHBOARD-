-- Create users table with Supabase auth integration
-- This table extends auth.users with additional application data
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null,
  role text default 'DRIVER',
  phone text,
  password_hash text, -- kept for backward compatibility if needed
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create vehicles table
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  vehicle_number text unique not null,
  driver_name text not null,
  driver_phone text not null,
  permit_id text not null,
  status text default 'ACTIVE',
  manager_id uuid not null references public.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create trips table
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  origin text not null,
  destination text not null,
  origin_lat float default 0,
  origin_lng float default 0,
  dest_lat float default 0,
  dest_lng float default 0,
  cargo text not null,
  permit_id text not null,
  allowed_trips int default 1,
  status text default 'PENDING',
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  route_taken text default '[]',
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  driver_id uuid not null references public.users(id) on delete cascade,
  manager_id uuid not null references public.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create alerts table
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  message text not null,
  severity text default 'WARNING',
  resolved boolean default false,
  trip_id uuid references public.trips(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- Create vehicle_locations table for tracking
create table if not exists public.vehicle_locations (
  id uuid primary key default gen_random_uuid(),
  lat float not null,
  lng float not null,
  speed float default 0,
  heading float default 0,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  timestamp timestamp with time zone default now()
);

-- Create indexes for performance
create index if not exists idx_vehicles_manager_id on public.vehicles(manager_id);
create index if not exists idx_trips_vehicle_id on public.trips(vehicle_id);
create index if not exists idx_trips_driver_id on public.trips(driver_id);
create index if not exists idx_trips_manager_id on public.trips(manager_id);
create index if not exists idx_alerts_vehicle_id on public.alerts(vehicle_id);
create index if not exists idx_alerts_trip_id on public.alerts(trip_id);
create index if not exists idx_vehicle_locations_vehicle_id on public.vehicle_locations(vehicle_id);
