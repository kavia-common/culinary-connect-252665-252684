-- FlavorShare Supabase schema helper
-- Run this in the Supabase SQL editor for your project.
-- This creates tables, relationships, indexes, RLS policies, and storage bucket policies
-- required by the FlavorShare frontend.

-- ================================
-- Extensions
-- ================================
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ================================
-- Auth helper view (optional)
-- ================================
-- Provides quick access to auth.users -> profile linking if needed
-- Not required by app but useful for debugging
create or replace view public.auth_users_min as
select id, email, created_at
from auth.users;

-- ================================
-- Tables
-- ================================

-- profiles: 1:1 with auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  bio text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_profiles_username on public.profiles (username);

-- recipes
create table if not exists public.recipes (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null references auth.users (id) on delete cascade,
  author_username text,
  title text not null,
  description text,
  ingredients text,
  instructions text,
  servings int,
  cook_time int,
  cover_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_recipes_created_at on public.recipes (created_at desc);
create index if not exists idx_recipes_author_id on public.recipes (author_id);
create index if not exists idx_recipes_title_trgm on public.recipes using gin (title gin_trgm_ops);

-- tags
create table if not exists public.tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamptz default now()
);

-- recipe_tags (many-to-many)
create table if not exists public.recipe_tags (
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (recipe_id, tag_id)
);

create index if not exists idx_recipe_tags_tag_id on public.recipe_tags (tag_id);

-- favorites (user likes recipe)
create table if not exists public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, recipe_id)
);

create index if not exists idx_favorites_recipe_id on public.favorites (recipe_id);

-- follows (user follows user)
create table if not exists public.follows (
  follower_id uuid not null references auth.users (id) on delete cascade,
  following_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, following_id),
  constraint follows_no_self_follow check (follower_id <> following_id)
);

create index if not exists idx_follows_following on public.follows (following_id);

-- comments (optional feature)
create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_comments_recipe_id_created on public.comments (recipe_id, created_at);

-- ================================
-- Updated-at triggers
-- ================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_recipes_updated_at on public.recipes;
create trigger trg_recipes_updated_at
before update on public.recipes
for each row execute function public.set_updated_at();

drop trigger if exists trg_comments_updated_at on public.comments;
create trigger trg_comments_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

-- ================================
-- Row Level Security
-- ================================
alter table public.profiles enable row level security;
alter table public.recipes enable row level security;
alter table public.tags enable row level security;
alter table public.recipe_tags enable row level security;
alter table public.favorites enable row level security;
alter table public.follows enable row level security;
alter table public.comments enable row level security;

-- PROFILES policies
drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public"
on public.profiles
for select
to public
using (true);

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profiles_delete_self" on public.profiles;
create policy "profiles_delete_self"
on public.profiles
for delete
to authenticated
using (auth.uid() = id);

-- RECIPES policies
drop policy if exists "recipes_select_public" on public.recipes;
create policy "recipes_select_public"
on public.recipes
for select
to public
using (true);

drop policy if exists "recipes_insert_owner" on public.recipes;
create policy "recipes_insert_owner"
on public.recipes
for insert
to authenticated
with check (auth.uid() = author_id);

drop policy if exists "recipes_update_owner" on public.recipes;
create policy "recipes_update_owner"
on public.recipes
for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists "recipes_delete_owner" on public.recipes;
create policy "recipes_delete_owner"
on public.recipes
for delete
to authenticated
using (auth.uid() = author_id);

-- TAGS policies (read public, write restricted to authenticated for curated tags;
-- you may choose to restrict further to a role)
drop policy if exists "tags_select_public" on public.tags;
create policy "tags_select_public"
on public.tags
for select
to public
using (true);

drop policy if exists "tags_insert_auth" on public.tags;
create policy "tags_insert_auth"
on public.tags
for insert
to authenticated
with check (true);

drop policy if exists "tags_update_auth" on public.tags;
create policy "tags_update_auth"
on public.tags
for update
to authenticated
using (true)
with check (true);

drop policy if exists "tags_delete_auth" on public.tags;
create policy "tags_delete_auth"
on public.tags
for delete
to authenticated
using (true);

-- RECIPE_TAGS policies (link rows must reference author-owned recipe)
drop policy if exists "recipe_tags_select_public" on public.recipe_tags;
create policy "recipe_tags_select_public"
on public.recipe_tags
for select
to public
using (true);

drop policy if exists "recipe_tags_insert_owner" on public.recipe_tags;
create policy "recipe_tags_insert_owner"
on public.recipe_tags
for insert
to authenticated
with check (
  exists (
    select 1 from public.recipes r
    where r.id = recipe_id and r.author_id = auth.uid()
  )
);

drop policy if exists "recipe_tags_delete_owner" on public.recipe_tags;
create policy "recipe_tags_delete_owner"
on public.recipe_tags
for delete
to authenticated
using (
  exists (
    select 1 from public.recipes r
    where r.id = recipe_id and r.author_id = auth.uid()
  )
);

-- FAVORITES policies (users can manage their own favorites, public can read counts)
drop policy if exists "favorites_select_public" on public.favorites;
create policy "favorites_select_public"
on public.favorites
for select
to public
using (true);

drop policy if exists "favorites_insert_self" on public.favorites;
create policy "favorites_insert_self"
on public.favorites
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "favorites_delete_self" on public.favorites;
create policy "favorites_delete_self"
on public.favorites
for delete
to authenticated
using (auth.uid() = user_id);

-- FOLLOWS policies (users manage their own follow relationships, read public)
drop policy if exists "follows_select_public" on public.follows;
create policy "follows_select_public"
on public.follows
for select
to public
using (true);

drop policy if exists "follows_insert_self" on public.follows;
create policy "follows_insert_self"
on public.follows
for insert
to authenticated
with check (auth.uid() = follower_id);

drop policy if exists "follows_delete_self" on public.follows;
create policy "follows_delete_self"
on public.follows
for delete
to authenticated
using (auth.uid() = follower_id);

-- COMMENTS policies (public readable, author can manage)
drop policy if exists "comments_select_public" on public.comments;
create policy "comments_select_public"
on public.comments
for select
to public
using (true);

drop policy if exists "comments_insert_self" on public.comments;
create policy "comments_insert_self"
on public.comments
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "comments_update_self" on public.comments;
create policy "comments_update_self"
on public.comments
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "comments_delete_self" on public.comments;
create policy "comments_delete_self"
on public.comments
for delete
to authenticated
using (auth.uid() = user_id);

-- ================================
-- Helper functions/triggers
-- ================================

-- Optional: keep recipes.author_username synced with profiles.username
create or replace function public.set_recipe_author_username()
returns trigger as $$
begin
  if new.author_username is null then
    select p.username into new.author_username from public.profiles p where p.id = new.author_id;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_recipes_set_author_username on public.recipes;
create trigger trg_recipes_set_author_username
before insert on public.recipes
for each row execute function public.set_recipe_author_username();

-- ================================
-- Storage (Buckets + Policies)
-- Note: You can run these with service role or via SQL editor with sufficient privileges.
-- ================================
-- Create buckets if not existing
insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage RLS policies (for storage.objects)
-- Public read for both buckets; authenticated users can write to their own paths.

-- Recipe images: public read
drop policy if exists "recipe_images_public_read" on storage.objects;
create policy "recipe_images_public_read"
on storage.objects
for select
to public
using (bucket_id = 'recipe-images');

-- Recipe images: authenticated write
drop policy if exists "recipe_images_authenticated_write" on storage.objects;
create policy "recipe_images_authenticated_write"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'recipe-images'
);

-- Avatars: public read
drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

-- Avatars: authenticated write, recommended to scope path to user id folder 'userId/*'
drop policy if exists "avatars_authenticated_write_scoped" on storage.objects;
create policy "avatars_authenticated_write_scoped"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (position(auth.uid()::text || '/' in coalesce(name, '')) = 1) -- ensure path starts with "<uid>/"
);

-- Also allow update/delete for owners on their own avatar files
drop policy if exists "avatars_authenticated_update_scoped" on storage.objects;
create policy "avatars_authenticated_update_scoped"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (position(auth.uid()::text || '/' in coalesce(name, '')) = 1)
)
with check (
  bucket_id = 'avatars'
  and (position(auth.uid()::text || '/' in coalesce(name, '')) = 1)
);

drop policy if exists "avatars_authenticated_delete_scoped" on storage.objects;
create policy "avatars_authenticated_delete_scoped"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (position(auth.uid()::text || '/' in coalesce(name, '')) = 1)
);

-- Optional: similar scoped update/delete for recipe-images if you want to restrict by author folders.
-- The frontend currently uploads to recipe-images/<recipeId>/..., which is not tied to auth.uid().
-- For simplicity we allow any authenticated insert and leave updates/deletes to admins if needed.

-- ================================
-- Seeds (Optional)
-- ================================

-- Basic tags
insert into public.tags (name)
values ('Vegan'), ('Vegetarian'), ('Quick'), ('Dessert'), ('Gluten-free')
on conflict (name) do nothing;

-- Example public profile (requires an existing auth user id - replace UUID to match your user)
-- update public.profiles set username='demo', bio='Hello FlavorShare!' where id='00000000-0000-0000-0000-000000000000';

-- Example recipe (replace author_id with a real user id)
-- insert into public.recipes (author_id, title, description, servings, cook_time)
-- values ('00000000-0000-0000-0000-000000000000', 'Sample Pancakes', 'Fluffy pancakes with syrup', 2, 15);

-- Link a tag to the sample recipe (replace ids)
-- insert into public.recipe_tags (recipe_id, tag_id) values ('<recipe-uuid>', (select id from public.tags where name='Quick' limit 1));

-- ================================
-- Notes
-- ================================
-- 1) Ensure Authentication is enabled (Email/Password) in your Supabase project.
-- 2) The frontend expects:
--    - Tables: profiles, recipes, tags, recipe_tags, favorites, follows, comments
--    - Buckets: 'recipe-images' and 'avatars' with public read
-- 3) RLS is enabled across tables; policies map to expected app behavior.
-- 4) If you prefer private storage, remove public read policies and generate signed URLs in the app.
