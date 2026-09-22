const { events } = require('../data/events');

function getUniqueGenres(eventList = events) {
  return [...new Set(eventList.map((event) => event.genre))].sort();
}

function buildHomeMarkup(selectedGenre = 'all', filteredEvents = events) {
  const genres = getUniqueGenres();
  const eventMarkup = filteredEvents
    .map(
      (event) => `
        <article class="event-card" data-genre="${event.genre}">
          <img src="${event.image}" alt="${event.name} poster" />
          <div class="event-body">
            <span class="genre-pill">${event.genre}</span>
            <h3>${event.name}</h3>
            <p><strong>Artists:</strong> ${event.artists}</p>
            <p><strong>Date:</strong> ${event.date} at ${event.time}</p>
            <p><strong>Venue:</strong> ${event.venue}</p>
            <p><strong>Ticket:</strong> ${event.price}</p>
            <a href="/events/${event.slug}" class="button-link">See details</a>
          </div>
        </article>
      `
    )
    .join('');

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Discover Local Music</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Trebuchet+MS:wght@400;700&family=Courier+New:wght@700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        <header class="site-header">
          <nav class="container nav-bar">
            <div>
              <h1>Discover Local Music</h1>
            </div>
            <div class="tiny-badges">
              <span>Campus</span>
              <span>Live</span>
              <span>Cheap</span>
            </div>
          </nav>
        </header>

        <main class="container">
          <section class="hero">
            <h2>Find your next favorite night out.</h2>
            <p>Browse live shows, open mics, and festivals happening around campus this week.</p>
          </section>

          <section class="filter-box">
            <label for="genre-filter">Filter by genre</label>
            <select id="genre-filter">
              <option value="all" ${selectedGenre === 'all' ? 'selected' : ''}>All genres</option>
              ${genres
                .map(
                  (genre) =>
                    `<option value="${genre}" ${selectedGenre === genre ? 'selected' : ''}>${genre}</option>`
                )
                .join('')}
            </select>
          </section>

          <section class="event-list">
            ${eventMarkup || '<p class="empty-state">No events match that genre yet. Try another one.</p>'}
          </section>
        </main>

        <script>
          const genreFilter = document.getElementById('genre-filter');
          if (genreFilter) {
            genreFilter.addEventListener('change', (event) => {
              const selected = event.target.value;
              const url = selected === 'all' ? '/' : '/?genre=' + encodeURIComponent(selected);
              window.location.href = url;
            });
          }
        </script>
      </body>
    </html>`;
}

function buildDetailMarkup(event) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${event.name} | Discover Local Music</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Trebuchet+MS:wght@400;700&family=Courier+New:wght@700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        <header class="site-header">
          <nav class="container nav-bar">
            <div>
              <h1>Discover Local Music</h1>
            </div>
            <div class="tiny-badges">
              <a href="/">Back home</a>
            </div>
          </nav>
        </header>

        <main class="container detail-main">
          <article class="detail-card">
            <img src="${event.image}" alt="${event.name}" />
            <div class="detail-copy">
              <span class="genre-pill">${event.genre}</span>
              <h2>${event.name}</h2>
              <p class="lede">${event.description}</p>

              <ul class="details-list">
                <li><strong>Artist(s):</strong> ${event.artists}</li>
                <li><strong>Date:</strong> ${event.date}</li>
                <li><strong>Time:</strong> ${event.time}</li>
                <li><strong>Venue:</strong> ${event.venue}</li>
                <li><strong>Genre:</strong> ${event.genre}</li>
                <li><strong>Ticket Price:</strong> ${event.price}</li>
                <li><strong>Venue Size:</strong> ${event.size}</li>
                <li><strong>Capacity:</strong> ${event.capacity}</li>
                <li><strong>Lineup:</strong> ${event.lineup}</li>
                <li><strong>Overall Vibe:</strong> ${event.vibe}</li>
              </ul>

              <a href="/" class="button-link">Browse more shows</a>
            </div>
          </article>
        </main>
      </body>
    </html>`;
}

function buildNotFoundPage() {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Page Not Found</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Trebuchet+MS:wght@400;700&family=Courier+New:wght@700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        <main class="container not-found-box">
          <div class="missing-card">
            <h2>404 - Not Found</h2>
            <p>This page does not exist. Try going back home and checking out another event.</p>
            <a href="/" class="button-link">Return to music list</a>
          </div>
        </main>
      </body>
    </html>`;
}

module.exports = {
  buildHomeMarkup,
  buildDetailMarkup,
  buildNotFoundPage,
  getUniqueGenres
};
