-- Vũ Hồn Family OS - Supabase/PostgreSQL schema proposal
-- Dùng cho phase production: database, phân quyền, kiểm duyệt, mộ phần, liên hệ, hướng nghiệp.
create extension if not exists "uuid-ossp";
create type person_gender as enum ('male','female','unknown');
create type privacy_level as enum ('public','family','same_branch','editor','admin','private');
create type confidence_level as enum ('high','medium','low');
create type review_status as enum ('verified','needs_review','draft','rejected');

create table public.people (
  id text primary key,
  full_name text not null,
  gender person_gender default 'unknown',
  generation int,
  branch text,
  father_id text references public.people(id) on delete set null,
  mother_id text references public.people(id) on delete set null,
  birth_date date,
  birth_year int,
  death_date date,
  death_year int,
  lunar_death text,
  place text,
  note text,
  confidence confidence_level default 'medium',
  privacy privacy_level default 'family',
  status review_status default 'needs_review',
  source text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.person_aliases (
  id uuid primary key default uuid_generate_v4(),
  person_id text not null references public.people(id) on delete cascade,
  alias text not null
);

create table public.relationships (
  id uuid primary key default uuid_generate_v4(),
  person_id text not null references public.people(id) on delete cascade,
  related_person_id text not null references public.people(id) on delete cascade,
  relation_type text not null check (relation_type in ('spouse','child','parent','sibling','adopted_child','unknown')),
  note text,
  confidence confidence_level default 'medium',
  created_at timestamptz default now()
);

create table public.family_events (
  id uuid primary key default uuid_generate_v4(),
  person_id text references public.people(id) on delete cascade,
  title text not null,
  event_type text not null default 'death_anniversary',
  date_lunar text,
  date_solar date,
  branch text,
  privacy privacy_level default 'family',
  note text,
  created_at timestamptz default now()
);

create table public.grave_sites (
  id uuid primary key default uuid_generate_v4(),
  person_id text references public.people(id) on delete cascade,
  name text not null,
  cemetery_name text,
  grave_area text,
  grave_row text,
  grave_number text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  google_maps_url text,
  apple_maps_url text,
  route_note text,
  epitaph_text text,
  maintainer_person_id text references public.people(id) on delete set null,
  privacy privacy_level default 'family',
  status review_status default 'needs_review',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.contact_profiles (
  id uuid primary key default uuid_generate_v4(),
  person_id text unique references public.people(id) on delete cascade,
  phone text,
  zalo text,
  facebook text,
  instagram text,
  linkedin text,
  email text,
  city text,
  country text,
  phone_visibility privacy_level default 'private',
  social_visibility privacy_level default 'family',
  email_visibility privacy_level default 'private',
  allow_contact_request boolean default true,
  consent_at timestamptz,
  updated_at timestamptz default now()
);

create table public.career_profiles (
  id uuid primary key default uuid_generate_v4(),
  person_id text unique references public.people(id) on delete cascade,
  industry text,
  occupation text,
  company text,
  city text,
  country text,
  skills text[],
  education text,
  can_mentor boolean default false,
  can_offer_internship boolean default false,
  can_review_cv boolean default false,
  can_refer_job boolean default false,
  public_bio text,
  visibility privacy_level default 'family',
  updated_at timestamptz default now()
);

create table public.family_requests (
  id uuid primary key default uuid_generate_v4(),
  request_type text not null check (request_type in ('contact_request','data_correction','grave_location_update','mentorship_request','scholarship_request','source_upload')),
  from_person_id text references public.people(id) on delete set null,
  to_person_id text references public.people(id) on delete set null,
  message text,
  status text not null default 'pending' check (status in ('pending','approved','rejected','closed')),
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

create table public.source_evidence (
  id uuid primary key default uuid_generate_v4(),
  person_id text references public.people(id) on delete cascade,
  source_type text not null check (source_type in ('pdf_scan','family_submission','grave_photo','oral_history','admin_verified','other')),
  title text not null,
  description text,
  file_url text,
  page_number int,
  confidence confidence_level default 'medium',
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- V19 profiles + privacy helper columns
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  person_id text references public.people(id) on delete set null,
  role text not null default 'family_member' check (role in ('public','family_member','same_branch','contributor','editor','admin')),
  branch text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Suggested RLS setup for V19/V20
-- alter table public.people enable row level security;
-- alter table public.family_events enable row level security;
-- alter table public.grave_sites enable row level security;
-- alter table public.contact_profiles enable row level security;
-- alter table public.career_profiles enable row level security;
-- alter table public.family_requests enable row level security;
-- alter table public.profiles enable row level security;

-- Example helper:
-- create or replace function public.current_role()
-- returns text language sql stable as $$
--   select coalesce((select role from public.profiles where id = auth.uid()), 'public');
-- $$;



-- V20 Admin CMS support
-- Records created from CMS should default to draft/needs_review.
-- Admin is responsible for moving records to verified after evidence review.

alter table if exists public.people
  add column if not exists reviewed_by uuid,
  add column if not exists reviewed_at timestamptz;

alter table if exists public.family_events
  add column if not exists status review_status default 'needs_review',
  add column if not exists reviewed_by uuid,
  add column if not exists reviewed_at timestamptz;

alter table if exists public.grave_sites
  add column if not exists note text,
  add column if not exists reviewed_by uuid,
  add column if not exists reviewed_at timestamptz;

-- Recommended CMS policy direction:
-- contributor: insert family_requests only.
-- editor: insert/update draft/needs_review records.
-- admin: verify records and manage roles.



-- V21 Grave Map + QR + Storage support

create table if not exists public.grave_photos (
  id uuid primary key default uuid_generate_v4(),
  grave_id uuid references public.grave_sites(id) on delete cascade,
  person_id text references public.people(id) on delete set null,
  photo_type text not null default 'grave_photo' check (photo_type in ('overview','tombstone','route','grave_photo','other')),
  file_url text not null,
  storage_path text,
  caption text,
  privacy privacy_level default 'family',
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- Supabase Storage bucket suggestion:
-- Bucket name: family-assets
-- Folder convention:
-- grave-photos/<graveId-or-personId>/<timestamp>-filename.jpg

-- Recommended RLS:
-- public: no access to grave_photos unless privacy=public
-- family_member: read family grave_photos
-- editor/admin: upload and moderate



-- V22 Internal Network + Career/Mentor support

create table if not exists public.young_generation_profiles (
  id uuid primary key default uuid_generate_v4(),
  person_id text unique references public.people(id) on delete cascade,
  school text,
  class_name text,
  strengths text,
  interests text,
  target_major text,
  support_needed text,
  portfolio_url text,
  visibility privacy_level default 'family',
  status review_status default 'needs_review',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.family_requests
  add column if not exists contact_channel_requested text,
  add column if not exists reason text;

-- Recommended V22 privacy:
-- contact_profiles.phone_visibility default private
-- contact_profiles.email_visibility default private
-- career_profiles.visibility default family
-- young_generation_profiles.visibility default family/private
-- public must not read contact_profiles unless explicit consent + public visibility.



-- V23 Internal Beta support

create table if not exists public.beta_feedback (
  id uuid primary key default uuid_generate_v4(),
  feedback_type text not null default 'bug' check (feedback_type in ('bug','data_issue','privacy_issue','ux_feedback','feature_request')),
  screen text,
  severity text not null default 'medium' check (severity in ('low','medium','high','critical')),
  title text,
  description text not null,
  reporter_name text,
  reporter_contact text,
  user_role text,
  branch text,
  status text not null default 'open' check (status in ('open','triaged','fixed','rejected','closed')),
  created_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null
);

create table if not exists public.beta_test_runs (
  id uuid primary key default uuid_generate_v4(),
  checklist_state jsonb not null default '{}'::jsonb,
  metrics jsonb not null default '{}'::jsonb,
  user_role text,
  branch text,
  created_at timestamptz default now()
);

-- Recommended V23 privacy:
-- beta_feedback visible to editor/admin only.
-- beta_test_runs visible to editor/admin only.

-- V24.1 required table: places
create table if not exists public.places (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text,
  address text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  google_maps_url text,
  note text,
  privacy privacy_level default 'family',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- V24.1 audit log for sensitive actions
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_role text,
  action text not null,
  table_name text,
  record_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);
