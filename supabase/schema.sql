create table if not exists public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  completed jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

create policy "Users can read their own progress"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "Users can create their own progress"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
