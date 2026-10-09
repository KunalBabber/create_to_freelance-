const test = require('node:test');
const assert = require('node:assert/strict');

const { buildTrafficSourceList, normalizeTrafficSource } = require('./traffic-sources.js');

test('normalizeTrafficSource handles all standard source names and lowercase variants', () => {
  assert.equal(normalizeTrafficSource('Instagram'), 'Instagram');
  assert.equal(normalizeTrafficSource('instagram'), 'Instagram');
  assert.equal(normalizeTrafficSource('google'), 'Google');
  assert.equal(normalizeTrafficSource('whatsapp'), 'WhatsApp');
  assert.equal(normalizeTrafficSource('Direct'), 'Direct');
  assert.equal(normalizeTrafficSource('newsletter'), 'Other');
});

test('buildTrafficSourceList always includes the default source buckets and increments matching counts', () => {
  const result = buildTrafficSourceList([
    { visitor_id: 'a', source: 'Instagram' },
    { visitor_id: 'b', source: 'instagram' },
    { visitor_id: 'a', source: 'google' },
    { visitor_id: 'c', source: 'Direct' },
    { visitor_id: 'd', source: 'newsletter' },
  ]);

  assert.deepEqual(result, [
    { source: 'Instagram', visitors: 2 },
    { source: 'Google', visitors: 1 },
    { source: 'Direct', visitors: 1 },
    { source: 'Other', visitors: 1 },
    { source: 'YouTube', visitors: 0 },
    { source: 'Facebook', visitors: 0 },
    { source: 'WhatsApp', visitors: 0 },
  ]);
});

test('buildTrafficSourceList counts session-only visitors', () => {
  const result = buildTrafficSourceList([
    { session_id: 'session-a', source: 'Direct' },
    { session_id: 'session-a', source: 'Direct' },
    { session_id: 'session-b', source: 'Direct' },
  ]);

  assert.equal(result.find(({ source }) => source === 'Direct')?.visitors, 2);
});
