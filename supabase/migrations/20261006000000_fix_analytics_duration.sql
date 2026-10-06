alter table public.analytics_events
  add column if not exists duration_seconds integer;

alter table public.analytics_events
  drop constraint if exists analytics_events_duration_seconds_check;

alter table public.analytics_events
  add constraint analytics_events_duration_seconds_check
  check (duration_seconds between 1 and 86400);

alter table public.analytics_events
  drop constraint if exists analytics_events_event_name_check;

alter table public.analytics_events
  add constraint analytics_events_event_name_check
  check (event_name in (
    'page_view',
    'view_course',
    'click_buy',
    'begin_checkout',
    'time_on_site',
    'lead_generated',
    'purchase'
  ));
