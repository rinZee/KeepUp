const express = require('express');
const path = require('path');
const { getEvents, getEventBySlug, getGenres } = require('./db');
const {
  buildHomeMarkup,
  buildDetailMarkup,
  buildNotFoundPage,
  buildDatabaseErrorPage
} = require('./views/templates');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', async (req, res) => {
  const selectedGenre = req.query.genre || 'all';

  try {
    const [events, genres] = await Promise.all([
      getEvents(selectedGenre),
      getGenres()
    ]);
    res.send(buildHomeMarkup(selectedGenre, events, genres));
  } catch (error) {
    console.error('Unable to load events from PostgreSQL:', error.message);
    res.status(503).send(buildDatabaseErrorPage());
  }
});

app.get('/events/:slug', async (req, res) => {
  let event;

  try {
    event = await getEventBySlug(req.params.slug);
  } catch (error) {
    console.error('Unable to load event from PostgreSQL:', error.message);
    return res.status(503).send(buildDatabaseErrorPage());
  }

  if (!event) {
    return res.status(404).send(buildNotFoundPage());
  }

  return res.send(buildDetailMarkup(event));
});

app.use((req, res) => {
  res.status(404).send(buildNotFoundPage());
});

module.exports = app;
