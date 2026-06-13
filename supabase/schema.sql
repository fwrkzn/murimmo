create extension if not exists pgcrypto;

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric(12, 2) not null check (price >= 0),
  city text not null,
  area_sqm numeric(10, 2) not null check (area_sqm >= 0),
  bedrooms integer not null check (bedrooms >= 0),
  photos text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  published boolean not null default false
);

create table if not exists public.access_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_by uuid not null references public.admins(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists listings_set_updated_at on public.listings;

create trigger listings_set_updated_at
before update on public.listings
for each row
execute function public.set_updated_at();

create index if not exists listings_city_idx on public.listings (city);
create index if not exists listings_published_idx on public.listings (published);
create index if not exists listings_created_at_idx on public.listings (created_at desc);
create index if not exists access_codes_expires_at_idx on public.access_codes (expires_at);
create index if not exists access_codes_created_by_idx on public.access_codes (created_by);
