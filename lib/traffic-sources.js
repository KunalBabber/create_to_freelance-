const DEFAULT_TRAFFIC_SOURCES = ['Instagram', 'YouTube', 'Google', 'Facebook', 'WhatsApp', 'Direct', 'Other'];

function normalizeTrafficSource(value) {
  const rawValue = typeof value === 'string' ? value.trim() : '';
  if (!rawValue) return 'Other';

  const normalized = rawValue.toLowerCase();
  const aliases = {
    instagram: 'Instagram',
    insta: 'Instagram',
    ig: 'Instagram',
    youtube: 'YouTube',
    yt: 'YouTube',
    google: 'Google',
    facebook: 'Facebook',
    fb: 'Facebook',
    whatsapp: 'WhatsApp',
    wa: 'WhatsApp',
    direct: 'Direct',
    other: 'Other',
  };

  if (aliases[normalized]) return aliases[normalized];

  const directMatch = DEFAULT_TRAFFIC_SOURCES.find((source) => source.toLowerCase() === normalized);
  return directMatch ?? 'Other';
}

function buildTrafficSourceList(events) {
  const sourceVisitors = new Map(DEFAULT_TRAFFIC_SOURCES.map((source) => [source, new Set()]));

  for (const event of events || []) {
    const visitorId = typeof event?.visitor_id === 'string' ? event.visitor_id.trim() : '';
    const sessionId = typeof event?.session_id === 'string' ? event.session_id.trim() : '';
    const visitorKey = visitorId ? `visitor:${visitorId}` : sessionId ? `session:${sessionId}` : '';
    if (!visitorKey) continue;

    const sourceName = normalizeTrafficSource(event?.source ?? event?.utm_source ?? null);
    const visitors = sourceVisitors.get(sourceName) ?? new Set();
    visitors.add(visitorKey);
    sourceVisitors.set(sourceName, visitors);
  }

  return [...DEFAULT_TRAFFIC_SOURCES]
    .map((source) => ({
      source,
      visitors: sourceVisitors.get(source)?.size ?? 0,
    }))
    .sort((left, right) => {
      if (right.visitors !== left.visitors) return right.visitors - left.visitors;
      return DEFAULT_TRAFFIC_SOURCES.indexOf(left.source) - DEFAULT_TRAFFIC_SOURCES.indexOf(right.source);
    });
}

module.exports = {
  DEFAULT_TRAFFIC_SOURCES,
  normalizeTrafficSource,
  buildTrafficSourceList,
};
