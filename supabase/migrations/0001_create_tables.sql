create extension if not exists "pgcrypto";

create table if not exists analyses (
  id uuid primary key default gen_random_uuid(),
  session_token text not null,
  target_url text not null,
  self_url text null,
  goal text null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

create table if not exists analysis_results (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references analyses(id) on delete cascade,
  preview_json jsonb not null,
  full_json jsonb not null,
  created_at timestamptz default now()
);

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references analyses(id) on delete cascade,
  gumroad_sale_id text unique not null,
  product_id text not null,
  email text null,
  price_cents int null,
  currency text null,
  verified boolean not null default false,
  raw_payload jsonb not null,
  created_at timestamptz default now()
);

create table if not exists unlock_tokens (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null unique references analyses(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz null,
  created_at timestamptz default now()
);

create index if not exists idx_analyses_session_token on analyses(session_token);
create index if not exists idx_purchases_sale_id on purchases(gumroad_sale_id);
create index if not exists idx_unlock_tokens_token on unlock_tokens(token);
