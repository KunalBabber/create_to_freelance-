'use client';

export type AnalyticsEventName =
  | 'page_view'
  | 'view_course'
  | 'click_buy'
  | 'begin_checkout'
  | 'time_on_site'
  | 'lead_generated';

export type Attribution = {
  source: string;
  utmSource: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  referrer: string | null;
  firstLandingPage: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

const consentKey = 'growlearnix-analytics-consent';
const consentUpdatedAtKey = 'growlearnix-analytics-consent-updated-at';
const consentLifetimeMs = 180 * 24 * 60 * 60 * 1000;
const visitorKey = 'growlearnix-visitor-id';
const sessionKey = 'growlearnix-session-id';
const attributionKey = 'growlearnix-first-touch';
const gaClientIdKey = 'growlearnix-ga-client-id';
const gaSessionIdKey = 'growlearnix-ga-session-id';

function newId() {
  return crypto.randomUUID();
}

function setConsentCookie(value: 'accepted' | 'rejected') {
  if (typeof document === 'undefined') return;
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `growlearnix_analytics_consent=${value === 'accepted' ? 'granted' : 'denied'}; path=/; max-age=${180 * 24 * 60 * 60}${secure}; SameSite=Lax`;
}

function isLocalDevelopment() {
  return typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
}

export function hasAnalyticsConsent() {
  if (typeof window === 'undefined') return false;
  if (isLocalDevelopment()) {
    return getConsentChoice() !== 'rejected';
  }
  return getConsentChoice() === 'accepted';
}

export function getConsentChoice(): 'accepted' | 'rejected' | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;

  const saved = localStorage.getItem(consentKey);
  const updatedAt = Number(localStorage.getItem(consentUpdatedAtKey));
  const age = Date.now() - updatedAt;

  if (isLocalDevelopment() && !saved) {
    localStorage.setItem(consentKey, 'accepted');
    localStorage.setItem(consentUpdatedAtKey, String(Date.now()));
    setConsentCookie('accepted');
    return 'accepted';
  }

  if ((saved !== 'accepted' && saved !== 'rejected') || !Number.isFinite(updatedAt) || age < 0 || age >= consentLifetimeMs) {
    localStorage.removeItem(consentKey);
    localStorage.removeItem(consentUpdatedAtKey);
    localStorage.setItem(consentKey, 'accepted');
    localStorage.setItem(consentUpdatedAtKey, String(Date.now()));
    setConsentCookie('accepted');
    return 'accepted';
  }
  return saved;
}

export function getVisitorId() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return newId();

  let id = localStorage.getItem(visitorKey);
  if (!id) {
    id = newId();
    localStorage.setItem(visitorKey, id);
  }
  return id;
}

export function getSessionId() {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return newId();

  let id = sessionStorage.getItem(sessionKey);
  if (!id) {
    id = newId();
    sessionStorage.setItem(sessionKey, id);
  }
  return id;
}

function normalizeSource(value: string | null, referrer: string | null) {
  const input = (value || '').toLowerCase();
  const host = (referrer || '').toLowerCase();
  if (input.includes('instagram') || host.includes('instagram.com')) return 'Instagram';
  if (input.includes('youtube') || host.includes('youtube.com') || host.includes('youtu.be')) return 'YouTube';
  if (input.includes('google') || host.includes('google.')) return 'Google';
  if (input.includes('facebook') || host.includes('facebook.com') || host.includes('fb.com')) return 'Facebook';
  if (input.includes('whatsapp') || host.includes('whatsapp.com') || host.includes('wa.me')) return 'WhatsApp';
  if (!input && !host) return 'Direct';
  return input ? 'Other' : 'Other';
}

function referrerOrigin(value: string) {
  try {
    const url = new URL(value);
    return url.origin.slice(0, 200);
  } catch {
    return null;
  }
}

export function getFirstTouchAttribution(): Attribution {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return {
      source: 'Direct',
      utmSource: null,
      medium: null,
      campaign: null,
      content: null,
      referrer: null,
      firstLandingPage: '/',
    };
  }

  const saved = localStorage.getItem(attributionKey);
  if (saved) {
    try {
      return JSON.parse(saved) as Attribution;
    } catch {
      localStorage.removeItem(attributionKey);
    }
  }

  const params = new URLSearchParams(window.location.search);
  const referrer = referrerOrigin(document.referrer);
  const utmSource = params.get('utm_source')?.slice(0, 100) || null;
  const attribution: Attribution = {
    source: normalizeSource(utmSource, referrer),
    utmSource,
    medium: params.get('utm_medium')?.slice(0, 100) || null,
    campaign: params.get('utm_campaign')?.slice(0, 150) || null,
    content: params.get('utm_content')?.slice(0, 150) || null,
    referrer,
    firstLandingPage: window.location.pathname.slice(0, 255) || '/',
  };

  localStorage.setItem(attributionKey, JSON.stringify(attribution));
  return attribution;
}

export function getVoluntaryLeadAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const referrer = referrerOrigin(document.referrer);
  const utmSource = params.get('utm_source')?.slice(0, 100) || null;
  const internalReferrer = referrer ? new URL(referrer).host === window.location.host : false;

  return {
    source: !utmSource && internalReferrer ? 'Direct' : normalizeSource(utmSource, referrer),
    utmSource,
    medium: params.get('utm_medium')?.slice(0, 100) || null,
    campaign: params.get('utm_campaign')?.slice(0, 150) || null,
    content: params.get('utm_content')?.slice(0, 150) || null,
    referrer,
    firstLandingPage: window.location.pathname.slice(0, 255) || '/',
  };
}

export function setConsentChoice(choice: 'accepted' | 'rejected') {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

  localStorage.setItem(consentKey, choice);
  localStorage.setItem(consentUpdatedAtKey, String(Date.now()));
  setConsentCookie(choice);
  if (choice === 'rejected') {
    localStorage.removeItem(visitorKey);
    localStorage.removeItem(attributionKey);
    localStorage.removeItem(gaClientIdKey);
    localStorage.removeItem(gaSessionIdKey);
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(sessionKey);
  }
  window.dispatchEvent(new CustomEvent('growlearnix-analytics-consent-change', { detail: choice }));
}

export function getStoredGoogleIds() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return { clientId: null, sessionId: null };
  }

  return {
    clientId: localStorage.getItem(gaClientIdKey),
    sessionId: localStorage.getItem(gaSessionIdKey),
  };
}

export function rememberGoogleIds(clientId: string, sessionId: string) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

  localStorage.setItem(gaClientIdKey, clientId);
  localStorage.setItem(gaSessionIdKey, sessionId);
}

export function trackAnalyticsEvent(
  eventName: AnalyticsEventName,
  details: Record<string, string | number | boolean | undefined> = {},
  options: { sendToGoogle?: boolean } = {}
) {
  if (!hasAnalyticsConsent()) return;

  const attribution = getFirstTouchAttribution();
  const visitorId = getVisitorId();
  const sessionId = getSessionId();
  const pagePath = window.location.pathname.slice(0, 255) || '/';

  if (options.sendToGoogle !== false) trackGoogleAnalyticsEvent(eventName, details);

  if (eventName === 'lead_generated') return;

  void fetch('/api/analytics/events', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      eventName,
      visitorId,
      sessionId,
      pagePath,
      ...(eventName === 'time_on_site' ? { durationSeconds: details.durationSeconds } : {}),
      ...attribution,
    }),
    keepalive: true,
  }).catch(() => undefined);
}

export function trackGoogleAnalyticsEvent(
  eventName: AnalyticsEventName,
  details: Record<string, string | number | boolean | undefined> = {}
) {
  if (!hasAnalyticsConsent() || typeof window === 'undefined' || typeof window.gtag !== 'function') return false;
  window.gtag('event', eventName, {
    page_location: `${window.location.origin}${window.location.pathname}`,
    page_title: document.title,
    ...details,
  });
  return true;
}

export function buildCheckoutUrl(checkoutUrl: string) {
  const url = new URL(checkoutUrl);
  if (!hasAnalyticsConsent()) return url.toString();

  const attribution = getFirstTouchAttribution();
  const visitorId = getVisitorId();
  const sessionId = getSessionId();
  const googleIds = getStoredGoogleIds();

  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const) {
    const value = key === 'utm_source'
      ? attribution.utmSource || (attribution.source === 'Direct' ? null : attribution.source)
      : attribution[key.slice(4) as 'medium' | 'campaign' | 'content'];
    if (value) url.searchParams.set(key, value);
  }

  url.searchParams.set('growlearnix_visitor_id', visitorId);
  url.searchParams.set('growlearnix_session_id', sessionId);
  url.searchParams.set('growlearnix_source', attribution.source);
  url.searchParams.set('growlearnix_first_landing_page', attribution.firstLandingPage);
  url.searchParams.set('growlearnix_analytics_consent', 'granted');
  if (googleIds.clientId) url.searchParams.set('growlearnix_ga_client_id', googleIds.clientId);
  if (googleIds.sessionId) url.searchParams.set('growlearnix_ga_session_id', googleIds.sessionId);

  return url.toString();
}