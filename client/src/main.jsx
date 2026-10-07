const React = require('react');
const { createRoot } = require('react-dom/client');

const h = React.createElement;

async function getJson(url) {
  const response = await fetch(url);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Unable to load community events.');
  return result;
}

function Header() {
  return h('header', { className: 'site-header' },
    h('div', { className: 'nav-wrap' },
      h('a', { className: 'brand', href: '/', 'aria-label': 'KeepUp home' },
        h('span', { className: 'brand-mark', 'aria-hidden': 'true' }, 'K'),
        h('span', null, 'keepup')
      ),
      h('nav', { 'aria-label': 'Main navigation' },
        h('a', { href: '/' }, 'Locations'),
        h('a', { href: '/events' }, 'All events')
      )
    )
  );
}

function RequestState({ error }) {
  return h('div', { className: 'request-state', role: error ? 'alert' : 'status' },
    error || 'Loading community events…'
  );
}

function useResource(url) {
  const [state, setState] = React.useState({ data: null, error: '' });
  React.useEffect(() => {
    let active = true;
    setState({ data: null, error: '' });
    getJson(url)
      .then((data) => { if (active) setState({ data, error: '' }); })
      .catch((error) => { if (active) setState({ data: null, error: error.message }); });
    return () => { active = false; };
  }, [url]);
  return state;
}

function useCountdown(startsAt) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return new Date(startsAt).getTime() - now;
}

function Countdown({ remaining }) {
  if (remaining <= 0) return h('span', { className: 'countdown passed' }, 'Event has passed');
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return h('span', { className: 'countdown' },
    days > 0 ? `${days}d ${hours}h until show` : `${hours}h ${minutes}m ${seconds}s until show`
  );
}

function EventCard({ event }) {
  const remaining = useCountdown(event.starts_at);
  const passed = remaining <= 0;
  return h('article', { className: `event-card${passed ? ' event-passed' : ''}` },
    h('a', { className: 'event-image-link', href: `/events/${event.slug}`, tabIndex: -1, 'aria-hidden': 'true' },
      h('img', { src: event.image, alt: '', loading: 'lazy' })
    ),
    h('div', { className: 'event-copy' },
      h('span', { className: 'eyebrow' }, event.genre),
      h('h3', null, h('a', { href: `/events/${event.slug}` }, event.name)),
      h('p', { className: 'event-meta' }, `${event.date} · ${event.time}`),
      h('p', null, `${event.venue} · ${event.price}`),
      h(Countdown, { remaining })
    )
  );
}

function LocationCard({ location }) {
  return h('a', { className: 'location-card', href: `/locations/${location.slug}` },
    h('img', { src: location.image, alt: '', loading: 'lazy' }),
    h('span', { className: 'location-shade' }),
    h('span', { className: 'location-copy' },
      h('span', { className: 'location-count' }, `${location.event_count} ${location.event_count === 1 ? 'event' : 'events'}`),
      h('strong', null, location.name),
      h('span', null, location.address)
    )
  );
}

function HomePage() {
  const { data: locations, error } = useResource('/api/locations');
  return h(React.Fragment, null,
    h('section', { className: 'hero' },
      h('p', { className: 'eyebrow' }, 'Your city, in rhythm'),
      h('h1', null, 'Find your next favorite night out.'),
      h('p', null, 'Explore the venues that bring our local music community together.')
    ),
    h('section', { className: 'content-section' },
      h('div', { className: 'section-heading' },
        h('div', null, h('p', { className: 'eyebrow' }, 'Explore by place'), h('h2', null, 'Pick your scene')),
        h('a', { className: 'text-link', href: '/events' }, 'Browse every event →')
      ),
      error ? h(RequestState, { error }) : locations
        ? h('div', { className: 'location-grid' }, locations.map((location) => h(LocationCard, { key: location.id, location })))
        : h(RequestState, null)
    )
  );
}

function LocationPage({ slug }) {
  const { data: location, error } = useResource(`/api/locations/${encodeURIComponent(slug)}`);
  if (error) return h(RequestState, { error });
  if (!location) return h(RequestState, null);
  return h('section', { className: 'content-section detail-section' },
    h('a', { className: 'back-link', href: '/' }, '← All locations'),
    h('div', { className: 'location-heading' },
      h('img', { src: location.image, alt: `${location.name} venue` }),
      h('div', null,
        h('p', { className: 'eyebrow' }, location.address),
        h('h1', null, location.name),
        h('p', null, location.description)
      )
    ),
    h('div', { className: 'section-heading' },
      h('div', null, h('p', { className: 'eyebrow' }, 'At this venue'), h('h2', null, 'Events')),
      h('span', { className: 'muted' }, `${location.events.length} total`)
    ),
    location.events.length
      ? h('div', { className: 'event-grid' }, location.events.map((event) => h(EventCard, { key: event.id, event })))
      : h('p', { className: 'empty-state' }, 'No events are listed here yet.')
  );
}

function EventsPage() {
  const { data: locations, error: locationsError } = useResource('/api/locations');
  const [location, setLocation] = React.useState('all');
  const [genre, setGenre] = React.useState('all');
  const query = new URLSearchParams();
  if (location !== 'all') query.set('location', location);
  if (genre !== 'all') query.set('genre', genre);
  const { data, error } = useResource(`/api/events?${query.toString()}`);
  const all = useResource('/api/events');
  if (error || locationsError) return h(RequestState, { error: error || locationsError });
  if (!data || !all.data || !locations) return h(RequestState, null);
  return h('section', { className: 'content-section detail-section' },
    h('p', { className: 'eyebrow' }, 'The full lineup'),
    h('h1', null, 'All events'),
    h('div', { className: 'filters' },
      h('label', null, 'Location',
        h('select', { value: location, onChange: (event) => setLocation(event.target.value) },
          h('option', { value: 'all' }, 'All locations'),
          locations.map((item) => h('option', { key: item.slug, value: item.slug }, item.name))
        )
      ),
      h('label', null, 'Genre',
        h('select', { value: genre, onChange: (event) => setGenre(event.target.value) },
          h('option', { value: 'all' }, 'All genres'),
          all.data.genres.map((item) => h('option', { key: item, value: item }, item))
        )
      )
    ),
    data.events.length
      ? h('div', { className: 'event-grid' }, data.events.map((event) => h(EventCard, { key: event.id, event })))
      : h('p', { className: 'empty-state' }, 'No events match these filters.')
  );
}

function EventPage({ slug }) {
  const { data: event, error } = useResource(`/api/events/${encodeURIComponent(slug)}`);
  const remaining = useCountdown(event ? event.starts_at : new Date().toISOString());
  if (error) return h(RequestState, { error });
  if (!event) return h(RequestState, null);
  const passed = remaining <= 0;
  return h('section', { className: 'content-section detail-section' },
    h('a', { className: 'back-link', href: '/events' }, '← All events'),
    h('article', { className: `event-detail${passed ? ' event-passed' : ''}` },
      h('img', { src: event.image, alt: `${event.name} event` }),
      h('div', { className: 'event-detail-copy' },
        h('p', { className: 'eyebrow' }, `${event.genre} · ${event.venue}`),
        h('h1', null, event.name),
        h('p', { className: 'detail-description' }, event.description),
        h(Countdown, { remaining }),
        h('ul', { className: 'details-list' },
          h('li', null, h('strong', null, 'When'), ` ${event.date} at ${event.time}`),
          h('li', null, h('strong', null, 'Artists'), ` ${event.artists}`),
          h('li', null, h('strong', null, 'Lineup'), ` ${event.lineup}`),
          h('li', null, h('strong', null, 'Tickets'), ` ${event.price}`),
          h('li', null, h('strong', null, 'Venue'), ' ', h('a', { href: `/locations/${event.location_slug}` }, event.venue)),
          h('li', null, h('strong', null, 'Capacity'), ` ${event.capacity} · ${event.vibe}`)
        )
      )
    )
  );
}

function App() {
  const pathname = window.location.pathname;
  const locationMatch = pathname.match(/^\/locations\/([^/]+)\/?$/);
  const eventMatch = pathname.match(/^\/events\/([^/]+)\/?$/);
  let page = h(HomePage, null);
  if (pathname === '/events' || pathname === '/events/') page = h(EventsPage, null);
  else if (locationMatch) page = h(LocationPage, { slug: decodeURIComponent(locationMatch[1]) });
  else if (eventMatch) page = h(EventPage, { slug: decodeURIComponent(eventMatch[1]) });
  return h(React.Fragment, null,
    h(Header, null),
    h('main', { className: 'page-wrap' }, page),
    h('footer', { className: 'site-footer' }, h('span', null, 'KeepUp · Local music, closer to home'))
  );
}

createRoot(document.getElementById('root')).render(h(App, null));
