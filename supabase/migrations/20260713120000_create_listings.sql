begin;

-- First product vertical: marketplace listings.
-- price_cents is display-only listing metadata. NearU does not process,
-- collect, transfer, or enforce payments.

do $$ begin
  create type public.listing_condition as enum ('new', 'like_new', 'good', 'fair');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.listing_category as enum (
    'textbooks', 'electronics', 'furniture', 'clothing', 'sports', 'other'
  );
exception when duplicate_object then null;
end $$;

-- 'sold' and 'removed' listings stay in the table for seller history but drop
-- out of the public browse query.
do $$ begin
  create type public.listing_status as enum ('active', 'sold', 'removed');
exception when duplicate_object then null;
end $$;

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  price_cents integer not null,
  category public.listing_category not null,
  condition public.listing_condition not null,
  image_url text,
  status public.listing_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint listings_title_length check (char_length(btrim(title)) between 3 and 120),
  constraint listings_description_length check (char_length(btrim(description)) between 1 and 2000),
  -- Ceiling is $1,000,000.00. Guards against fat-fingered / hostile prices.
  constraint listings_price_range check (price_cents >= 0 and price_cents <= 100000000)
);

-- The rls_auto_enable event trigger already does this for new public tables;
-- stated explicitly so the migration is correct on its own.
alter table public.listings enable row level security;

-- Browse feed: newest active listings first.
create index if not exists listings_status_created_at_idx
  on public.listings (status, created_at desc);

-- "My listings" on the profile page.
create index if not exists listings_seller_id_idx
  on public.listings (seller_id);

-- Category filter over the browse feed only.
create index if not exists listings_category_idx
  on public.listings (category)
  where status = 'active';

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
before update on public.listings
for each row execute function public.set_updated_at();

revoke all on public.listings from anon;
revoke all on public.listings from authenticated;
grant select, insert, update, delete on public.listings to authenticated;

-- Anyone signed in can browse active listings. Sellers additionally see their
-- own sold/removed rows so their history does not vanish from under them.
drop policy if exists "Active listings viewable by authenticated" on public.listings;
create policy "Active listings viewable by authenticated"
on public.listings
for select
to authenticated
using (status = 'active' or seller_id = (select auth.uid()));

-- seller_id is pinned to the caller, so a user cannot post as someone else.
drop policy if exists "Own listing insert" on public.listings;
create policy "Own listing insert"
on public.listings
for insert
to authenticated
with check (seller_id = (select auth.uid()));

-- with check repeats the predicate so a seller cannot reassign a listing away.
drop policy if exists "Own listing update" on public.listings;
create policy "Own listing update"
on public.listings
for update
to authenticated
using (seller_id = (select auth.uid()))
with check (seller_id = (select auth.uid()));

drop policy if exists "Own listing delete" on public.listings;
create policy "Own listing delete"
on public.listings
for delete
to authenticated
using (seller_id = (select auth.uid()));

commit;
