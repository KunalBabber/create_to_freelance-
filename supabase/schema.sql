create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null check (event_name in ('page_view', 'view_course', 'click_buy', 'begin_checkout', 'time_on_site', 'lead_generated', 'purchase')),
  duration_seconds integer check (duration_seconds between 1 and 86400),
  visitor_id uuid,
  session_id uuid,
  page_path text not null default '/',
  source text not null default 'Direct',
  medium text,
  campaign text,
  content text,
  utm_source text,
  referrer text,
  purchase_id text,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_visitor_event_idx on public.analytics_events (visitor_id, event_name, created_at desc);
create index if not exists analytics_events_source_idx on public.analytics_events (source, created_at desc);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now(),
  requested_at timestamptz not null default now(),
  source text not null default 'Direct',
  medium text,
  campaign text,
  content text,
  utm_source text,
  first_landing_page text not null default '/',
  visitor_id uuid,
  session_id uuid,
  analytics_consent boolean not null default false,
  last_resource_email_sent_at timestamptz,
  converted boolean not null default false,
  purchase_id text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_source_idx on public.leads (source, created_at desc);

create table if not exists public.purchases (
  gumroad_sale_id text primary key,
  lead_id uuid references public.leads (id) on delete set null,
  visitor_id uuid,
  product_id text not null,
  amount_cents bigint not null,
  currency text not null,
  status text not null check (status in ('paid', 'refunded', 'disputed')),
  source text not null default 'Direct',
  medium text,
  campaign text,
  content text,
  utm_source text,
  referrer text,
  first_landing_page text not null default '/',
  purchased_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create index if not exists purchases_status_date_idx on public.purchases (status, purchased_at desc);
create index if not exists purchases_source_idx on public.purchases (source, purchased_at desc);
create unique index if not exists analytics_purchase_once_idx on public.analytics_events (purchase_id) where event_name = 'purchase';

create table if not exists public.gumroad_webhook_deliveries (
  id uuid primary key default gen_random_uuid(),
  sale_id text not null,
  resource_name text not null check (resource_name in ('sale', 'refund', 'dispute', 'dispute_won')),
  received_at timestamptz not null default now(),
  unique (sale_id, resource_name)
);

alter table public.analytics_events add column if not exists utm_source text;
alter table public.analytics_events add column if not exists duration_seconds integer;
alter table public.analytics_events drop constraint if exists analytics_events_duration_seconds_check;
alter table public.analytics_events add constraint analytics_events_duration_seconds_check
  check (duration_seconds between 1 and 86400);
alter table public.analytics_events drop constraint if exists analytics_events_event_name_check;
alter table public.analytics_events add constraint analytics_events_event_name_check
  check (event_name in ('page_view', 'view_course', 'click_buy', 'begin_checkout', 'time_on_site', 'lead_generated', 'purchase'));
alter table public.leads add column if not exists utm_source text;
alter table public.leads add column if not exists last_resource_email_sent_at timestamptz;
alter table public.purchases add column if not exists utm_source text;
alter table public.purchases add column if not exists first_landing_page text not null default '/';

alter table public.analytics_events enable row level security;
alter table public.leads enable row level security;
alter table public.purchases enable row level security;
alter table public.gumroad_webhook_deliveries enable row level security;

revoke all on public.analytics_events, public.leads, public.purchases, public.gumroad_webhook_deliveries from anon, authenticated;
grant all on public.analytics_events, public.leads, public.purchases, public.gumroad_webhook_deliveries to service_role;

create or replace function public.get_admin_analytics()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
with event_metrics as (
  select
    count(distinct session_id) filter (where event_name = 'page_view') as total_visitors,
    count(distinct visitor_id) filter (where event_name = 'page_view') as unique_visitors,
    count(*) filter (where event_name = 'click_buy') as buy_clicks
  from public.analytics_events
), event_source_metrics as (
  select source, count(distinct visitor_id) as visitors
  from public.analytics_events
  where event_name = 'page_view'
  group by source
), visitor_time_rows as (
  select visitor_id, max(source) as source, sum(duration_seconds)::integer as seconds, max(created_at) as last_seen
  from public.analytics_events
  where event_name = 'time_on_site' and visitor_id is not null and duration_seconds is not null
  group by visitor_id
), visitor_time_metrics as (
  select
    coalesce(round(avg(seconds)), 0)::integer as average_time_seconds,
    coalesce((
      select jsonb_agg(to_jsonb(visitor_rows) order by visitor_rows.seconds desc)
      from (select visitor_id, source, seconds, last_seen from visitor_time_rows order by seconds desc limit 100) visitor_rows
    ), '[]'::jsonb) as visitor_times
  from visitor_time_rows
)
select jsonb_build_object(
  'totalVisitors', event_metrics.total_visitors,
  'uniqueVisitors', event_metrics.unique_visitors,
  'buyClicks', event_metrics.buy_clicks,
  'averageTimeSeconds', visitor_time_metrics.average_time_seconds,
  'visitorTimes', visitor_time_metrics.visitor_times,
  'sources', coalesce((select jsonb_agg(to_jsonb(event_source_metrics) order by event_source_metrics.visitors desc) from event_source_metrics), '[]'::jsonb)
)
from event_metrics, visitor_time_metrics;
$$;

revoke all on function public.get_admin_analytics() from public, anon, authenticated;
grant execute on function public.get_admin_analytics() to service_role;