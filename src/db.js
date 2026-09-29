const { pool } = require('./config/database');

async function getEvents(genre = 'all') {
  const query =
    genre === 'all'
      ? 'SELECT * FROM events ORDER BY id'
      : 'SELECT * FROM events WHERE genre = $1 ORDER BY id';
  const values = genre === 'all' ? [] : [genre];
  const { rows } = await pool.query(query, values);
  return rows;
}

async function getEventBySlug(slug) {
  const { rows } = await pool.query('SELECT * FROM events WHERE slug = $1', [slug]);
  return rows[0] || null;
}

async function getGenres() {
  const { rows } = await pool.query('SELECT DISTINCT genre FROM events ORDER BY genre');
  return rows.map((row) => row.genre);
}

module.exports = { getEvents, getEventBySlug, getGenres };