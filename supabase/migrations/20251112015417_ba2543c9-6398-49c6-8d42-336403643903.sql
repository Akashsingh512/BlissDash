-- Create profiles table for storing display names
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
on public.profiles
for select
using (true);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

-- Trigger for profiles
drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
before update on public.profiles
for each row
execute function public.update_updated_at_column();

-- Create role helper function
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- Tighten user_roles policies
alter table public.user_roles enable row level security;

-- Drop overly permissive policies
drop policy if exists "Anyone can insert user roles" on public.user_roles;
drop policy if exists "Anyone can read user roles" on public.user_roles;

-- Users can see their own roles
drop policy if exists "Users can read their own roles" on public.user_roles;
create policy "Users can read their own roles"
on public.user_roles
for select
using (user_id = auth.uid());

-- Admins can see all roles
drop policy if exists "Admins can read all roles" on public.user_roles;
create policy "Admins can read all roles"
on public.user_roles
for select
using (public.has_role(auth.uid(), 'admin'));

-- Admins can insert roles
drop policy if exists "Admins can insert roles" on public.user_roles;
create policy "Admins can insert roles"
on public.user_roles
for insert
with check (public.has_role(auth.uid(), 'admin'));

-- Admins can delete roles
drop policy if exists "Admins can delete roles" on public.user_roles;
create policy "Admins can delete roles"
on public.user_roles
for delete
using (public.has_role(auth.uid(), 'admin'));

-- STORAGE POLICIES for posters bucket
drop policy if exists "Public can read posters" on storage.objects;
create policy "Public can read posters"
on storage.objects
for select
using (bucket_id = 'posters');

drop policy if exists "Authenticated can upload posters" on storage.objects;
create policy "Authenticated can upload posters"
on storage.objects
for insert
with check (bucket_id = 'posters' and auth.role() = 'authenticated');

drop policy if exists "Admins can update posters" on storage.objects;
create policy "Admins can update posters"
on storage.objects
for update
using (bucket_id = 'posters' and public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can delete posters" on storage.objects;
create policy "Admins can delete posters"
on storage.objects
for delete
using (bucket_id = 'posters' and public.has_role(auth.uid(), 'admin'));