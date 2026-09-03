-- V24.1 Row Level Security policy scaffold
-- Review before running on production. Run after SUPABASE_SCHEMA.sql.

alter table if exists public.people enable row level security;
alter table if exists public.family_events enable row level security;
alter table if exists public.grave_sites enable row level security;
alter table if exists public.grave_photos enable row level security;
alter table if exists public.contact_profiles enable row level security;
alter table if exists public.career_profiles enable row level security;
alter table if exists public.young_generation_profiles enable row level security;
alter table if exists public.family_requests enable row level security;
alter table if exists public.profiles enable row level security;
alter table if exists public.beta_feedback enable row level security;
alter table if exists public.beta_test_runs enable row level security;
alter table if exists public.audit_logs enable row level security;

create or replace function public.current_profile_role()
returns text language sql stable as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'public');
$$;

create or replace function public.current_profile_branch()
returns text language sql stable as $$
  select (select branch from public.profiles where id = auth.uid());
$$;

create or replace function public.is_admin_or_editor()
returns boolean language sql stable as $$
  select public.current_profile_role() in ('admin','editor');
$$;

-- People read policies
create policy if not exists people_public_read on public.people
  for select using (privacy = 'public');

create policy if not exists people_family_read on public.people
  for select using (
    public.current_profile_role() in ('family_member','same_branch','contributor','editor','admin')
    and privacy in ('public','family')
  );

create policy if not exists people_same_branch_read on public.people
  for select using (
    public.current_profile_role() in ('same_branch','contributor','editor','admin')
    and privacy in ('public','family','same_branch')
    and (branch is null or branch = public.current_profile_branch() or public.current_profile_role() in ('editor','admin'))
  );

create policy if not exists people_editor_write on public.people
  for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());

-- Grave data: never public by default unless explicitly privacy=public
create policy if not exists grave_family_read on public.grave_sites
  for select using (
    public.current_profile_role() in ('family_member','same_branch','contributor','editor','admin')
    and privacy in ('family','same_branch','public')
  );

create policy if not exists grave_editor_write on public.grave_sites
  for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());

-- Contact profiles: no public read. Editor/admin manage; members request contact via family_requests.
create policy if not exists contact_owner_or_admin_read on public.contact_profiles
  for select using (public.current_profile_role() in ('editor','admin'));

create policy if not exists contact_editor_write on public.contact_profiles
  for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());

-- Requests: authenticated family users can create pending requests.
create policy if not exists request_family_insert on public.family_requests
  for insert with check (auth.uid() is not null and status = 'pending');

create policy if not exists request_editor_read on public.family_requests
  for select using (public.is_admin_or_editor());

create policy if not exists request_editor_update on public.family_requests
  for update using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());

-- Beta and audit visible to admin/editor only.
create policy if not exists beta_feedback_editor_all on public.beta_feedback
  for all using (public.is_admin_or_editor()) with check (public.is_admin_or_editor());

create policy if not exists audit_admin_read on public.audit_logs
  for select using (public.current_profile_role() = 'admin');
