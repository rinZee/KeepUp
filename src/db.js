const { pool } = require('./config/database');

async function getEvents(genre = 'all', locationSlug) {
  const clauses = [];
  const values = [];
  if (genre !== 'all') {
    values.push(genre);
    clauses.push(`events.genre = $${values.length}`);
  }
  if (locationSlug) {
    values.push(locationSlug);
    clauses.push(`locations.slug = $${values.length}`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const { rows } = await pool.query(`
    SELECT events.*, locations.slug AS location_slug
    FROM events
    JOIN locations ON locations.id = events.location_id
    ${where}
    ORDER BY events.starts_at
  `, values);
  return rows;
}

async function getEventBySlug(slug) {
  const { rows } = await pool.query(`
    SELECT events.*, locations.slug AS location_slug
    FROM events
    JOIN locations ON locations.id = events.location_id
    WHERE events.slug = $1
  `, [slug]);
  return rows[0] || null;
}

async function getGenres() {
  const { rows } = await pool.query('SELECT DISTINCT genre FROM events ORDER BY genre');
  return rows.map((row) => row.genre);
}

async function getLocations() {
  const { rows } = await pool.query(`
    SELECT locations.*, COUNT(events.id)::integer AS event_count
    FROM locations
    LEFT JOIN events ON events.location_id = locations.id
    GROUP BY locations.id
    ORDER BY locations.name
  `);
  return rows;
}

async function getLocationBySlug(slug) {
  const { rows } = await pool.query(`
    SELECT locations.*, COUNT(events.id)::integer AS event_count
    FROM locations
    LEFT JOIN events ON events.location_id = locations.id
    WHERE locations.slug = $1
    GROUP BY locations.id
  `, [slug]);
  if (!rows[0]) return null;
  const events = await getEvents('all', slug);
  return { ...rows[0], events };
}

module.exports = { getEvents, getEventBySlug, getGenres, getLocations, getLocationBySlug };
