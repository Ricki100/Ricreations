-- Ricreations CMS schema. Run once in the Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('project', 'blog')),
  title text not null check (char_length(title) between 2 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text not null default '',
  body_html text not null default '',
  cover_url text,
  video_url text,
  external_url text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  sort_order integer not null default 100,
  seo_title text,
  seo_description text,
  author_id uuid not null default auth.uid() references auth.users(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_requires_date check (status = 'draft' or published_at is not null)
);

create index if not exists content_items_public_list_idx
  on public.content_items (type, featured desc, sort_order, published_at desc)
  where status = 'published';
create index if not exists content_items_author_id_idx on public.content_items (author_id);

alter table public.content_items enable row level security;

revoke all on table public.content_items from anon, authenticated;
grant select on table public.content_items to anon;
grant select, insert, update, delete on table public.content_items to authenticated;

drop policy if exists "Public can read published content" on public.content_items;
create policy "Public can read published content" on public.content_items
  for select to anon
  using (status = 'published' and published_at <= now());

drop policy if exists "Admins can read all content" on public.content_items;
create policy "Admins can read all content" on public.content_items
  for select to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can insert content" on public.content_items;
create policy "Admins can insert content" on public.content_items
  for insert to authenticated
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and author_id = (select auth.uid()));

drop policy if exists "Admins can update content" on public.content_items;
create policy "Admins can update content" on public.content_items
  for update to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin' and author_id = (select auth.uid()));

drop policy if exists "Admins can delete content" on public.content_items;
create policy "Admins can delete content" on public.content_items
  for delete to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-media', 'cms-media', true, 15728640,
  array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can upload CMS media" on storage.objects;
create policy "Admins can upload CMS media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'cms-media' and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can view CMS media metadata" on storage.objects;
create policy "Admins can view CMS media metadata" on storage.objects
  for select to authenticated
  using (bucket_id = 'cms-media' and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update CMS media" on storage.objects;
create policy "Admins can update CMS media" on storage.objects
  for update to authenticated
  using (bucket_id = 'cms-media' and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (bucket_id = 'cms-media' and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can delete CMS media" on storage.objects;
create policy "Admins can delete CMS media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'cms-media' and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
