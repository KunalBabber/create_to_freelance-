# Analytics Setup

The landing page keeps its existing Gumroad checkout. First-party storage and the admin dashboard use Supabase; analytics collection is opt-in. Do not commit real credentials.

## 1. Supabase

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor. It is safe to rerun to add the attribution, visitor-duration, and cooldown columns.
3. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` and in the production host's server environment. Use a Supabase service-role/secret key (legacy `service_role` or current `sb_secret_` format), never a publishable/anon key. Keep it server-only; never use a `NEXT_PUBLIC_` variable.

If analytics event inserts report that `duration_seconds` is missing or that `time_on_site` violates the event-name constraint, run this in the Supabase SQL Editor to migrate the deployed table and refresh the PostgREST schema cache:

```sql
alter table public.analytics_events add column if not exists duration_seconds integer;
alter table public.analytics_events drop constraint if exists analytics_events_event_name_check;
alter table public.analytics_events add constraint analytics_events_event_name_check
  check (event_name in ('page_view', 'view_course', 'click_buy', 'begin_checkout', 'time_on_site', 'lead_generated', 'purchase'));
notify pgrst, 'reload schema';
```

All analytics, lead, purchase, and webhook tables have RLS enabled and no public policies. The server uses the service role; browser clients only call same-origin API routes.

## 2. Google Analytics 4

1. Create a GA4 web data stream and copy its measurement ID into `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
2. Create a Measurement Protocol API secret and set `GA4_API_SECRET` server-side to enable verified purchase events.

GA4 and first-party visitor/session tracking start only after the visitor selects **Allow analytics**. Declining analytics leaves checkout and the resource form available. First-touch UTM/referrer attribution is passed to Gumroad as URL parameters only for visitors who consented.

## 3. Gumroad Purchase Verification

1. Create a Gumroad API application and an access token with the `view_sales` scope; set `GUMROAD_ACCESS_TOKEN` server-side.
2. Find the product's API ID and set it as `GUMROAD_PRODUCT_ID`.
3. Generate a long random `GUMROAD_WEBHOOK_SECRET` and configure Gumroad Ping/resource subscriptions to call `https://YOUR_DOMAIN/api/gumroad/webhook?key=YOUR_SECRET` for `sale`, `refund`, and `dispute` notifications. Use HTTPS and keep that URL private.

Gumroad documents Ping as unsigned and at-least-once. The handler therefore treats Ping only as a trigger, fetches the sale by ID through the authenticated Sales API, checks the product and paid/refund/dispute state, and deduplicates by sale ID. A browser redirect never creates a purchase. Test purchases are ignored. Sale/refund/dispute notifications may be retried by Gumroad.

The handler reads `url_params` and the verified sale's UTM/referrer values for attribution. Configure Gumroad's resource subscription once against the deployed HTTPS URL; the app does not register a webhook on its own.

## 4. Free Resource Email

1. Create a Resend account, verify a sending domain, and set `RESEND_API_KEY` and `LEAD_FROM_EMAIL`.
2. Optionally set `LEAD_RESOURCE_URL` to your own public resource pack. The default email links to Canva's public templates and design lessons.

The form stores an email only after voluntary submission. Email addresses are normalized and unique; repeated submissions reuse the same lead record. The email is used to send the requested resources and is not added to unrelated marketing.

## 5. Admin Dashboard

Set `ANALYTICS_ADMIN_USER` and a strong `ANALYTICS_ADMIN_PASSWORD` on the server. Visit `/admin/analytics`; the browser will prompt for Basic Auth. The page and `/api/admin/*` routes return `503` until these values are configured and never expose dashboard data publicly.

## 6. Local Check

Copy `.env.example` to `.env.local`, fill the values in the local environment (never commit `.env.local`), then run:

```sh
npm run typecheck
npm run build
```

Use a URL such as `/?utm_source=instagram&utm_medium=reel&utm_campaign=canva_course` to verify first-touch attribution. Dashboard visitor counts and time-on-site data include only visitors who opt into analytics. Time is measured while the page is visible and shown per anonymous visitor ID.