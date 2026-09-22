const express = require('express');
const path = require('path');
const { events } = require('./data/events');
const { buildHomeMarkup, buildDetailMarkup, buildNotFoundPage } = require('./views/templates');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  const selectedGenre = req.query.genre || 'all';
  const filteredEvents =
    selectedGenre === 'all'
      ? events
      : events.filter((event) => event.genre === selectedGenre);

  res.send(buildHomeMarkup(selectedGenre, filteredEvents));
});

app.get('/events/:slug', (req, res) => {
  const event = events.find((entry) => entry.slug === req.params.slug);

  if (!event) {
    return res.status(404).send(buildNotFoundPage());
  }

  return res.send(buildDetailMarkup(event));
});

app.use((req, res) => {
  res.status(404).send(buildNotFoundPage());
});

module.exports = app;
