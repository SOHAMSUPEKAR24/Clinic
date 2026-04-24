-- ============================================================
-- Migration 002: Row Level Security
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.clinic_settings enable row level security;
alter table public.patients enable row level security;
alter table public.visits enable row level security;
alter table public.prescriptions enable row level security;
alter table public.medicines enable row level security;
alter table public.quick_notes enable row level security;

-- ============================================================
-- profiles policies
-- ============================================================
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Service role can manage profiles"
  on public.profiles for all
  using (true)
  with check (true);

-- ============================================================
-- clinic_settings policies
-- ============================================================
create policy "Users can view own settings"
  on public.clinic_settings for select
  using (auth.uid() = user_id);

create policy "Service role can manage settings"
  on public.clinic_settings for all
  using (true)
  with check (true);

-- ============================================================
-- patients policies
-- ============================================================
create policy "Users can manage own patients"
  on public.patients for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- visits policies
-- ============================================================
create policy "Users can manage own visits"
  on public.visits for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- prescriptions policies
-- ============================================================
create policy "Users can manage own prescriptions"
  on public.prescriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- medicines policies
-- ============================================================
-- Users can see global medicines (user_id IS NULL) + their own custom medicines
create policy "Users can view global and own medicines"
  on public.medicines for select
  using (user_id IS NULL OR auth.uid() = user_id);

create policy "Users can insert own custom medicines"
  on public.medicines for insert
  with check (auth.uid() = user_id);

create policy "Service role can manage all medicines"
  on public.medicines for all
  using (true)
  with check (true);

-- ============================================================
-- quick_notes policies
-- ============================================================
create policy "Users can manage own notes"
  on public.quick_notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
