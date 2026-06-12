-- ============================================================
-- EcoPulse — Full Database Schema
-- Run this entire file in the Supabase SQL Editor once.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. PROFILES (linked to auth.users)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  full_name        text,
  avatar_url       text,
  eco_points       integer not null default 0,
  level            integer not null default 1,
  streak_days      integer not null default 0,
  total_co2_saved_kg numeric(10,2) not null default 0,
  created_at       timestamptz not null default now()
);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Drop trigger if it already exists then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- 2. ACTIVITIES
-- ─────────────────────────────────────────────────────────────
create table if not exists public.activities (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  label       text not null,
  category    text not null check (category in ('transport','food','energy','shopping','travel','digital','other')),
  co2_kg      numeric(8,2) not null,  -- positive = emission, negative = saving
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- 3. CHALLENGES (system-defined, seeded below)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.challenges (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  description    text,
  type           text not null check (type in ('daily','weekly','seasonal')),
  points_reward  integer not null default 50,
  target_value   numeric(8,2) not null default 1,
  unit           text not null default 'times',
  created_at     timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- 4. USER_CHALLENGES (progress per user per challenge)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.user_challenges (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  challenge_id   uuid not null references public.challenges(id) on delete cascade,
  progress       numeric(8,2) not null default 0,
  completed      boolean not null default false,
  completed_at   timestamptz,
  assigned_at    timestamptz not null default now(),
  unique (user_id, challenge_id)
);

-- ─────────────────────────────────────────────────────────────
-- 5. ACHIEVEMENTS (system-defined, seeded below)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.achievements (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  description  text,
  icon         text not null default 'award',
  color        text not null default 'emerald',
  created_at   timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- 6. USER_ACHIEVEMENTS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.user_achievements (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  earned_at      timestamptz not null default now(),
  unique (user_id, achievement_id)
);

-- ─────────────────────────────────────────────────────────────
-- 7. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────
alter table public.profiles         enable row level security;
alter table public.activities       enable row level security;
alter table public.challenges       enable row level security;
alter table public.user_challenges  enable row level security;
alter table public.achievements     enable row level security;
alter table public.user_achievements enable row level security;

-- profiles: anyone can read (for leaderboard), only owner can update, and owner can insert (for auto-sync)
drop policy if exists "profiles_read_all"   on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_read_all"   on public.profiles for select using (true);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- activities: owner only
drop policy if exists "activities_own" on public.activities;
create policy "activities_own" on public.activities
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- challenges: everyone can read
drop policy if exists "challenges_read_all" on public.challenges;
create policy "challenges_read_all" on public.challenges for select using (true);

-- user_challenges: owner only
drop policy if exists "user_challenges_own" on public.user_challenges;
create policy "user_challenges_own" on public.user_challenges
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- achievements: everyone can read
drop policy if exists "achievements_read_all" on public.achievements;
create policy "achievements_read_all" on public.achievements for select using (true);

-- user_achievements: owner can read
drop policy if exists "user_achievements_own" on public.user_achievements;
create policy "user_achievements_own" on public.user_achievements
  for select using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- 8. SEED DATA — Challenges
-- ─────────────────────────────────────────────────────────────
insert into public.challenges (title, description, type, points_reward, target_value, unit) values
  ('Walk 5km instead of driving', 'Use your feet instead of a car for short trips.', 'daily', 50, 5, 'km'),
  ('No food delivery for 3 days', 'Cook at home and reduce packaging waste.', 'weekly', 150, 3, 'days'),
  ('Use public transit twice', 'Take the bus or metro instead of a private vehicle.', 'daily', 80, 2, 'rides'),
  ('Choose vegan meal 5 times', 'Plant-based diets produce significantly less CO₂.', 'weekly', 120, 5, 'meals'),
  ('Turn off unused electronics', 'Unplug devices you are not using for a full day.', 'daily', 40, 1, 'day'),
  ('Bike to work 3 times', 'Zero-emission commuting challenge.', 'weekly', 200, 3, 'rides'),
  ('Reduce shower to under 5 mins', 'Save water and heating energy.', 'daily', 30, 1, 'day'),
  ('Plant a tree or donate to reforestation', 'Offset carbon by supporting reforestation.', 'seasonal', 500, 1, 'tree')
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────
-- 9. SEED DATA — Achievements
-- ─────────────────────────────────────────────────────────────
insert into public.achievements (name, description, icon, color) values
  ('Carbon Slayer',    'Saved over 50 kg of CO₂.',             'shield',    'blue'),
  ('Green Shopper',    'Logged 10 eco-friendly purchases.',     'tree-pine', 'green'),
  ('Energy Saver',     'Completed 5 energy-saving challenges.', 'zap',       'purple'),
  ('Transit King',     'Used public transit 20 times.',         'award',     'amber'),
  ('Zero Waste',       'Logged 7 days with no waste activities.','award',    'emerald'),
  ('Plant Pioneer',    'Planted or donated to plant a tree.',   'leaf',      'green'),
  ('Streak Master',    'Maintained a 30-day activity streak.',  'flame',     'orange'),
  ('Early Adopter',    'One of the first 1000 EcoPulse users.', 'star',      'yellow')
on conflict (name) do nothing;

-- ─────────────────────────────────────────────────────────────
-- 10. HELPER FUNCTION: Assign active challenges to a user
--     Call this after a new user signs up.
-- ─────────────────────────────────────────────────────────────
create or replace function public.assign_challenges_to_user(p_user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.user_challenges (user_id, challenge_id)
  select p_user_id, id
  from public.challenges
  where type in ('daily', 'weekly')
  on conflict (user_id, challenge_id) do nothing;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 11. CLANS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.clans (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  description  text,
  tag          text not null default 'General',
  created_by   uuid not null references public.profiles(id) on delete cascade,
  max_members  integer not null default 50,
  created_at   timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- 12. CLAN_MEMBERS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.clan_members (
  id         uuid primary key default gen_random_uuid(),
  clan_id    uuid not null references public.clans(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  role       text not null default 'member' check (role in ('leader', 'member')),
  joined_at  timestamptz not null default now(),
  unique (user_id)  -- one clan per user
);

-- RLS for clans
alter table public.clans        enable row level security;
alter table public.clan_members enable row level security;

-- clans: everyone can read, authenticated can create, creator can update/delete
drop policy if exists "clans_read_all" on public.clans;
drop policy if exists "clans_insert_auth" on public.clans;
drop policy if exists "clans_update_creator" on public.clans;
drop policy if exists "clans_delete_creator" on public.clans;
create policy "clans_read_all" on public.clans for select using (true);
create policy "clans_insert_auth" on public.clans for insert with check (auth.uid() = created_by);
create policy "clans_update_creator" on public.clans for update using (auth.uid() = created_by);
create policy "clans_delete_creator" on public.clans for delete using (auth.uid() = created_by);

-- clan_members: everyone can read (for leaderboard), owner can insert/delete own row
drop policy if exists "clan_members_read_all" on public.clan_members;
drop policy if exists "clan_members_insert_own" on public.clan_members;
drop policy if exists "clan_members_delete_own" on public.clan_members;
create policy "clan_members_read_all" on public.clan_members for select using (true);
create policy "clan_members_insert_own" on public.clan_members for insert with check (auth.uid() = user_id);
create policy "clan_members_delete_own" on public.clan_members for delete using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- 13. CLAN LEADERBOARD VIEW
-- ─────────────────────────────────────────────────────────────
create or replace view public.clan_leaderboard as
select
  c.id as clan_id,
  c.name,
  c.description,
  c.tag,
  c.created_by,
  count(cm.id)::integer as member_count,
  coalesce(sum(p.eco_points), 0)::integer as total_points,
  coalesce(sum(p.total_co2_saved_kg), 0)::numeric(12,2) as total_co2_saved_kg
from public.clans c
left join public.clan_members cm on cm.clan_id = c.id
left join public.profiles p on p.id = cm.user_id
group by c.id, c.name, c.description, c.tag, c.created_by
order by total_points desc;

-- ─────────────────────────────────────────────────────────────
-- 14. RAG / KNOWLEDGE BASE (pgvector)
-- ─────────────────────────────────────────────────────────────

create extension if not exists vector;

drop table if exists public.knowledge_base;

create table public.knowledge_base (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  metadata jsonb,
  embedding vector(3072)
);

-- RLS for knowledge base (allow everyone to read, insert, and delete for demo purposes)
alter table public.knowledge_base enable row level security;

drop policy if exists "knowledge_base_read_all" on public.knowledge_base;
create policy "knowledge_base_read_all" on public.knowledge_base for select using (true);

drop policy if exists "knowledge_base_insert_all" on public.knowledge_base;
create policy "knowledge_base_insert_all" on public.knowledge_base for insert with check (true);

drop policy if exists "knowledge_base_delete_all" on public.knowledge_base;
create policy "knowledge_base_delete_all" on public.knowledge_base for delete using (true);

-- Function to match documents using cosine distance
create or replace function public.match_documents (
  query_embedding vector(3072),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    kb.id,
    kb.content,
    kb.metadata,
    1 - (kb.embedding <=> query_embedding) as similarity
  from public.knowledge_base kb
  where 1 - (kb.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;

-- ─────────────────────────────────────────────────────────────
-- Done! Tables: profiles, activities, challenges,
--               user_challenges, achievements, user_achievements,
--               clans, clan_members, knowledge_base
-- View:  clan_leaderboard
-- ─────────────────────────────────────────────────────────────
