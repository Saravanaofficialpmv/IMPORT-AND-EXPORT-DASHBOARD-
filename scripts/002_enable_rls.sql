-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.vehicles enable row level security;
alter table public.trips enable row level security;
alter table public.alerts enable row level security;
alter table public.vehicle_locations enable row level security;

-- Users table policies
create policy "Users can view their own record" on public.users for select using (auth.uid() = id);
create policy "Users can update their own record" on public.users for update using (auth.uid() = id);

-- Vehicles table policies - managers can view/update their vehicles
create policy "Managers can view their vehicles" on public.vehicles for select using (auth.uid() = manager_id);
create policy "Managers can create vehicles" on public.vehicles for insert with check (auth.uid() = manager_id);
create policy "Managers can update their vehicles" on public.vehicles for update using (auth.uid() = manager_id);
create policy "Managers can delete their vehicles" on public.vehicles for delete using (auth.uid() = manager_id);

-- Trips table policies
create policy "Users can view trips they are involved in" on public.trips for select using (
  auth.uid() = driver_id or 
  auth.uid() = manager_id or
  exists (select 1 from public.vehicles where id = trips.vehicle_id and manager_id = auth.uid())
);

create policy "Managers can create trips" on public.trips for insert with check (auth.uid() = manager_id);
create policy "Users can update their assigned trips" on public.trips for update using (
  auth.uid() = driver_id or 
  auth.uid() = manager_id
);

-- Alerts table policies
create policy "Users can view relevant alerts" on public.alerts for select using (
  exists (
    select 1 from public.vehicles v where v.id = alerts.vehicle_id and v.manager_id = auth.uid()
  ) or
  exists (
    select 1 from public.trips t where t.id = alerts.trip_id and (t.driver_id = auth.uid() or t.manager_id = auth.uid())
  )
);

create policy "Service role can create alerts" on public.alerts for insert with check (true);

-- Vehicle locations table policies
create policy "Users can view locations of their vehicles" on public.vehicle_locations for select using (
  exists (
    select 1 from public.vehicles v where v.id = vehicle_locations.vehicle_id and v.manager_id = auth.uid()
  )
);

create policy "Service role can insert locations" on public.vehicle_locations for insert with check (true);
