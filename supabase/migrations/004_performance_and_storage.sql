-- ============================================================
-- Migration 004: Performance Indexes & Storage
-- ============================================================

-- Create indexes for performance
create index if not exists idx_patients_created_at on public.patients(created_at desc);
create index if not exists idx_visits_date on public.visits(visit_date desc);
create index if not exists idx_visits_user_next_date on public.visits(user_id, next_visit_date);
create index if not exists idx_medicines_user_custom on public.medicines(user_id, is_custom);

-- Ensure storage schema and buckets exist for CSV
insert into storage.buckets (id, name, public) 
values ('medicines_csv', 'medicines_csv', false)
on conflict (id) do nothing;

-- Admin can manage CSV files
create policy "Admin can insert CSV" on storage.objects for insert
with check ( bucket_id = 'medicines_csv' and auth.uid() in (select id from public.profiles where role = 'admin') );

create policy "Admin can select CSV" on storage.objects for select
using ( bucket_id = 'medicines_csv' and auth.uid() in (select id from public.profiles where role = 'admin') );

create policy "Admin can delete CSV" on storage.objects for delete
using ( bucket_id = 'medicines_csv' and auth.uid() in (select id from public.profiles where role = 'admin') );
