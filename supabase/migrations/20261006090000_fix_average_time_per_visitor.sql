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
),
event_source_metrics as (
  select source, count(distinct visitor_id) as visitors
  from public.analytics_events
  where event_name = 'page_view'
  group by source
),
visitor_time_rows as (
  select
    visitor_id,
    max(source) as source,
    sum(duration_seconds)::integer as seconds,
    max(created_at) as last_seen
  from public.analytics_events
  where event_name = 'time_on_site'
    and visitor_id is not null
    and duration_seconds is not null
  group by visitor_id
),
visitor_time_metrics as (
  select
    coalesce(round(avg(seconds)), 0)::integer as average_time_seconds,
    coalesce(
      (
        select jsonb_agg(to_jsonb(visitor_rows) order by visitor_rows.seconds desc)
        from (
          select visitor_id, source, seconds, last_seen
          from visitor_time_rows
          order by seconds desc
          limit 100
        ) visitor_rows
      ),
      '[]'::jsonb
    ) as visitor_times
  from visitor_time_rows
)
select jsonb_build_object(
  'totalVisitors', event_metrics.total_visitors,
  'uniqueVisitors', event_metrics.unique_visitors,
  'buyClicks', event_metrics.buy_clicks,
  'averageTimeSeconds', visitor_time_metrics.average_time_seconds,
  'visitorTimes', visitor_time_metrics.visitor_times,
  'sources', coalesce(
    (
      select jsonb_agg(to_jsonb(event_source_metrics) order by event_source_metrics.visitors desc)
      from event_source_metrics
    ),
    '[]'::jsonb
  )
)
from event_metrics, visitor_time_metrics;
$$;

revoke all on function public.get_admin_analytics() from public, anon, authenticated;
grant execute on function public.get_admin_analytics() to service_role;
