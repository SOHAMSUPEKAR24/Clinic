-- ============================================================
-- Migration 001: Schema
-- Run this in the Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- profiles table (extends auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  role text not null default 'user' check (role in ('admin', 'user')),
  subscription_end timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- clinic_settings table
-- ============================================================
create table if not exists public.clinic_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  clinic_name text default '',
  doctor_name text default '',
  reg_number text default '',
  phone text default '',
  email text default '',
  address text default '',
  city text default '',
  state text default '',
  pin text default '',
  logo_url text,
  updated_at timestamptz default now(),
  unique(user_id)
);

-- ============================================================
-- patients table
-- ============================================================
create table if not exists public.patients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  age integer,
  gender text check (gender in ('Male', 'Female', 'Other')),
  phone text,
  email text,
  address text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- visits table
-- ============================================================
create table if not exists public.visits (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid references public.patients(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  visit_date date not null default current_date,
  chief_complaint text,
  symptoms text,
  diagnosis text,
  bp text,
  temperature text,
  heart_rate text,
  notes text,
  next_visit_date date,
  created_at timestamptz default now()
);

-- ============================================================
-- prescriptions table
-- ============================================================
create table if not exists public.prescriptions (
  id uuid primary key default uuid_generate_v4(),
  visit_id uuid references public.visits(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  medicines jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- ============================================================
-- medicines table
-- ============================================================
create table if not exists public.medicines (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  medicine_name text not null,
  strength text,
  dosage_form text,
  manufacturer text,
  price numeric,
  is_custom boolean default false,
  created_at timestamptz default now()
);

-- Full text search index on medicine_name
create index if not exists medicines_name_idx on public.medicines using gin(to_tsvector('english', medicine_name));
create index if not exists medicines_name_trgm_idx on public.medicines (medicine_name);

-- ============================================================
-- quick_notes table
-- ============================================================
create table if not exists public.quick_notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text default '',
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists patients_user_id_idx on public.patients(user_id);
create index if not exists patients_name_idx on public.patients(name);
create index if not exists visits_patient_id_idx on public.visits(patient_id);
create index if not exists visits_user_id_idx on public.visits(user_id);
create index if not exists visits_next_visit_date_idx on public.visits(next_visit_date);
create index if not exists prescriptions_visit_id_idx on public.prescriptions(visit_id);
