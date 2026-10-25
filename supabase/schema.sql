-- CRC Dashboard shared storage (run in Supabase SQL Editor)
create table if not exists public.crc_dashboard_state (
  id text primary key default 'shared' check (id = 'shared'),
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.crc_dashboard_state enable row level security;
revoke all on public.crc_dashboard_state from anon;
grant select, insert, update on public.crc_dashboard_state to authenticated;

drop policy if exists "Authenticated users can read CRC dashboard state" on public.crc_dashboard_state;
create policy "Authenticated users can read CRC dashboard state"
  on public.crc_dashboard_state for select to authenticated using (true);

drop policy if exists "Authenticated users can insert CRC dashboard state" on public.crc_dashboard_state;
create policy "Authenticated users can insert CRC dashboard state"
  on public.crc_dashboard_state for insert to authenticated with check (true);

drop policy if exists "Authenticated users can update CRC dashboard state" on public.crc_dashboard_state;
create policy "Authenticated users can update CRC dashboard state"
  on public.crc_dashboard_state for update to authenticated using (true) with check (true);

-- Start with a blank dashboard; this does not import any browser/localStorage demo data.
insert into public.crc_dashboard_state (id, payload)
values ('shared', jsonb_build_object(
  'campaigns', '[]'::jsonb,
  'ads', '[]'::jsonb,
  'social', '[]'::jsonb,
  'website', '[]'::jsonb,
  'leads', '[]'::jsonb,
  'quotations', '[]'::jsonb,
  'sales', '[]'::jsonb,
  'importJobs', '[]'::jsonb,
  'users', '[]'::jsonb,
  'initialized', true
))
on conflict (id) do nothing;
