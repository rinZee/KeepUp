const express = require('express');
const path = require('path');
const { getEvents, getEventBySlug, getGenres, getLocations, getLocationBySlug } = require('./db');

const app = express();
const publicDirectory = path.join(__dirname, '..', 'public');

app.use(express.static(publicDirectory));

app.get('/api/locations', async (req, res, next) => {
  try {
    return res.json(await getLocations());
  } catch (error) {
    return next(error);
  }
});

app.get('/api/locations/:slug', async (req, res, next) => {
  try {
    const location = await getLocationBySlug(req.params.slug);
    if (!location) return res.status(404).json({ error: 'Location not found.' });
    return res.json(location);
  } catch (error) {
    return next(error);
  }
});

app.get('/api/events', async (req, res, next) => {
  const genre = typeof req.query.genre === 'string' ? req.query.genre : 'all';
  const location = typeof req.query.location === 'string' ? req.query.location : undefined;
  try {
    const [events, genres] = await Promise.all([getEvents(genre, location), getGenres()]);
    return res.json({ events, genres });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/events/:slug', async (req, res, next) => {
  try {
    const event = await getEventBySlug(req.params.slug);
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    return res.json(event);
  } catch (error) {
    return next(error);
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(publicDirectory, 'index.html'));
});

app.use((error, req, res, next) => {
  console.error('API request failed:', error.message);
  if (res.headersSent) return next(error);
  return res.status(503).json({ error: 'The community events service is temporarily unavailable.' });
});

module.exports = app;
