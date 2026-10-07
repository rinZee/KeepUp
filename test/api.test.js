require('../src/config/dotenv');

const assert = require('node:assert/strict');
const { test } = require('node:test');
const app = require('../src/app');
const { pool } = require('../src/config/database');

const sampleEvent = {
  id: 1,
  slug: 'midnight-bloom',
  name: 'Midnight Bloom',
  venue: 'The Lantern Room',
  location_slug: 'the-lantern-room',
  starts_at: '2026-11-13T20:30:00-06:00'
};
const sampleLocation = {
  id: 1,
  slug: 'the-lantern-room',
  name: 'The Lantern Room',
  event_count: 1,
  events: [sampleEvent]
};

async function withServer(t, query) {
  const originalQuery = pool.query;
  pool.query = query;
  const server = app.listen(0);
  t.after(async () => {
    pool.query = originalQuery;
    await new Promise((resolve) => server.close(resolve));
  });
  await new Promise((resolve) => server.once('listening', resolve));
  return `http://127.0.0.1:${server.address().port}`;
}

test('the visual app shell is served at the root', async (t) => {
  const baseUrl = await withServer(t, async () => ({ rows: [] }));
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /KeepUp \| Discover local music/);
});

test('locations and a location detail include the associated events', async (t) => {
  const baseUrl = await withServer(t, async (query, values) => {
    if (query.includes('SELECT locations.*') && query.includes('WHERE locations.slug = $1')) {
      return { rows: values[0] === 'not-a-place' ? [] : [{ ...sampleLocation, events: undefined }] };
    }
    if (query.includes('FROM events')) return { rows: [sampleEvent] };
    return { rows: [{ ...sampleLocation, events: undefined }] };
  });
  const locationsResponse = await fetch(`${baseUrl}/api/locations`);
  assert.equal(locationsResponse.status, 200);
  assert.equal((await locationsResponse.json())[0].slug, 'the-lantern-room');

  const detailResponse = await fetch(`${baseUrl}/api/locations/the-lantern-room`);
  const detail = await detailResponse.json();
  assert.equal(detailResponse.status, 200);
  assert.equal(detail.events[0].slug, 'midnight-bloom');

  const missingResponse = await fetch(`${baseUrl}/api/locations/not-a-place`);
  assert.equal(missingResponse.status, 404);
  assert.deepEqual(await missingResponse.json(), { error: 'Location not found.' });
});

test('events can be filtered by location and genre', async (t) => {
  const baseUrl = await withServer(t, async (query, values) => {
    if (query.includes('SELECT DISTINCT genre')) return { rows: [{ genre: 'Indie Pop' }] };
    if (query.includes('WHERE events.slug = $1')) {
      return { rows: values[0] === sampleEvent.slug ? [sampleEvent] : [] };
    }
    assert.match(query, /events\.genre = \$1/);
    assert.match(query, /locations\.slug = \$2/);
    assert.deepEqual(values, ['Indie Pop', 'the-lantern-room']);
    return { rows: [sampleEvent] };
  });
  const response = await fetch(`${baseUrl}/api/events?genre=Indie%20Pop&location=the-lantern-room`);
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(result.events[0].location_slug, 'the-lantern-room');
  assert.deepEqual(result.genres, ['Indie Pop']);

  const detailResponse = await fetch(`${baseUrl}/api/events/${sampleEvent.slug}`);
  assert.equal(detailResponse.status, 200);
  assert.equal((await detailResponse.json()).name, 'Midnight Bloom');

  const missingResponse = await fetch(`${baseUrl}/api/events/not-an-event`);
  assert.equal(missingResponse.status, 404);
});

test('database errors return an explicit service error', async (t) => {
  const originalError = console.error;
  console.error = () => {};
  t.after(() => { console.error = originalError; });
  const baseUrl = await withServer(t, async () => { throw new Error('database offline'); });
  const response = await fetch(`${baseUrl}/api/locations`);
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /temporarily unavailable/);
});
