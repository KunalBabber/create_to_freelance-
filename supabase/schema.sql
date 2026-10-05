create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null check (event_name in ('page_view', 'view_course', 'click_buy', 'begin_checkout', 'lead_generated', 'purchase')),
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
    count(distinct session_id) filter (
      where event_name = 'page_view'
        and created_at >= ((now() at time zone 'UTC')::date::timestamp at time zone 'UTC')
    ) as today_visitors,
    count(*) filter (where event_name = 'page_view') as page_views,
    count(*) filter (where event_name = 'click_buy') as buy_clicks,
    count(*) filter (where event_name = 'begin_checkout') as checkouts
  from public.analytics_events
), lead_metrics as (
  select count(*) as leads from public.leads
), purchase_metrics as (
  select
    (select count(*) from public.purchases where status = 'paid') as purchases,
    coalesce((select jsonb_object_agg(currency, revenue) from (
      select currency, sum(amount_cents)::numeric / 100 as revenue
      from public.purchases where status = 'paid' group by currency
    ) revenue_by_currency), '{}'::jsonb) as revenue_by_currency
), event_source_metrics as (
  select source, count(distinct visitor_id) as visitors
  from public.analytics_events
  where event_name = 'page_view'
  group by source
), lead_source_metrics as (
  select source, count(*) as leads
  from public.leads
  group by source
), purchase_source_metrics as (
  select source, currency, count(*) as purchases, sum(amount_cents)::numeric / 100 as revenue
  from public.purchases
  where status = 'paid'
  group by source, currency
), source_names as (
  select unnest(array['Instagram', 'YouTube', 'Google', 'Facebook', 'WhatsApp', 'Direct', 'Other']) as source
  union select source from event_source_metrics
  union select source from lead_source_metrics
  union select source from purchase_source_metrics
), source_rows as (
  select
    source_names.source,
    coalesce(event_source_metrics.visitors, 0) as visitors,
    coalesce(lead_source_metrics.leads, 0) as leads,
    coalesce(sum(purchase_source_metrics.purchases), 0) as purchases,
    coalesce(jsonb_object_agg(purchase_source_metrics.currency, purchase_source_metrics.revenue)
      filter (where purchase_source_metrics.currency is not null), '{}'::jsonb) as revenue_by_currency
  from source_names
  left join event_source_metrics using (source)
  left join lead_source_metrics using (source)
  left join purchase_source_metrics using (source)
  group by source_names.source, event_source_metrics.visitors, lead_source_metrics.leads
), funnel as (
  select
    event_metrics.total_visitors as visitors,
    lead_metrics.leads,
    (select count(distinct visitor_id) from public.analytics_events where event_name = 'click_buy') as buy_clicks,
    (select count(distinct visitor_id) from public.analytics_events where event_name = 'begin_checkout') as checkouts,
    purchase_metrics.purchases
  from event_metrics, lead_metrics, purchase_metrics
)
select jsonb_build_object(
  'totalVisitors', event_metrics.total_visitors,
  'todayVisitors', event_metrics.today_visitors,
  'uniqueVisitors', event_metrics.unique_visitors,
  'pageViews', event_metrics.page_views,
  'leads', lead_metrics.leads,
  'buyClicks', event_metrics.buy_clicks,
  'checkouts', event_metrics.checkouts,
  'purchases', purchase_metrics.purchases,
  'revenueByCurrency', purchase_metrics.revenue_by_currency,
  'conversionRate', case when event_metrics.unique_visitors = 0 then 0
    else round(purchase_metrics.purchases::numeric * 100 / event_metrics.unique_visitors, 2) end,
  'funnel', jsonb_build_array(
    jsonb_build_object('stage', 'Visitors', 'count', funnel.visitors, 'conversion', 100),
    jsonb_build_object('stage', 'Leads', 'count', funnel.leads, 'conversion', case when funnel.visitors = 0 then 0 else round(funnel.leads::numeric * 100 / funnel.visitors, 2) end),
    jsonb_build_object('stage', 'Buy clicks', 'count', funnel.buy_clicks, 'conversion', case when funnel.leads = 0 then 0 else round(funnel.buy_clicks::numeric * 100 / funnel.leads, 2) end),
    jsonb_build_object('stage', 'Checkout', 'count', funnel.checkouts, 'conversion', case when funnel.buy_clicks = 0 then 0 else round(funnel.checkouts::numeric * 100 / funnel.buy_clicks, 2) end),
    jsonb_build_object('stage', 'Purchases', 'count', funnel.purchases, 'conversion', case when funnel.checkouts = 0 then 0 else round(funnel.purchases::numeric * 100 / funnel.checkouts, 2) end)
  ),
  'sources', coalesce((select jsonb_agg(to_jsonb(source_rows) order by source_rows.visitors desc) from source_rows), '[]'::jsonb)
)
from event_metrics, lead_metrics, purchase_metrics, funnel;
$$;

revoke all on function public.get_admin_analytics() from public, anon, authenticated;
grant execute on function public.get_admin_analytics() to service_role;