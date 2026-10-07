CREATE TABLE IF NOT EXISTS locations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  artists TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  venue TEXT NOT NULL,
  location_id BIGINT NOT NULL REFERENCES locations(id),
  starts_at TIMESTAMPTZ NOT NULL,
  genre TEXT NOT NULL,
  price TEXT NOT NULL,
  size TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  lineup TEXT NOT NULL,
  capacity TEXT NOT NULL,
  vibe TEXT NOT NULL
);

ALTER TABLE events ADD COLUMN IF NOT EXISTS location_id BIGINT REFERENCES locations(id);
ALTER TABLE events ADD COLUMN IF NOT EXISTS starts_at TIMESTAMPTZ;

INSERT INTO locations (slug, name, address, description, image)
VALUES
  ('the-lantern-room', 'The Lantern Room', '18 Willow Lane',
   'An intimate listening room known for warm lights, close-up performances, and local indie discoveries.',
   'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80'),
  ('basement-42', 'Basement 42', '42 Mercer Street',
   'A basement dance venue with a big sound system and late-night electronic sets.',
   'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80'),
  ('cedar-street-cafe', 'Cedar Street Café', '210 Cedar Street',
   'A friendly neighborhood café where students, poets, and acoustic artists take the stage.',
   'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80'),
  ('riverfront-stage', 'Riverfront Stage', '1 Riverside Walk',
   'An open-air stage for sunset shows, food trucks, and big local sing-alongs.',
   'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=1200&q=80'),
  ('north-park-grounds', 'North Park Grounds', '500 North Park Avenue',
   'A sprawling green space that hosts all-day festivals and community gatherings.',
   'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1200&q=80'),
  ('hollow-beat-hall', 'Hollow Beat Hall', '9 Midtown Avenue',
   'A high-energy midtown hall for hip-hop showcases and dance-floor-ready live music.',
   'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  description = EXCLUDED.description,
  image = EXCLUDED.image;

INSERT INTO locations (slug, name, address, description, image)
SELECT
  trim(both '-' from regexp_replace(lower(venue), '[^a-z0-9]+', '-', 'g')),
  venue,
  venue,
  'A local music venue hosting community events.',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80'
FROM (SELECT DISTINCT venue FROM events) existing
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE locations.name = existing.venue)
ON CONFLICT (slug) DO NOTHING;

UPDATE events
SET location_id = locations.id
FROM locations
WHERE events.location_id IS NULL AND events.venue = locations.name;

UPDATE events SET starts_at = CASE slug
  WHEN 'midnight-bloom' THEN '2026-11-13 20:30:00-06'
  WHEN 'after-dark-collective' THEN '2026-11-21 21:15:00-06'
  WHEN 'open-mic-on-main' THEN '2026-10-14 19:00:00-06'
  WHEN 'rhythm-under-the-bridge' THEN '2026-08-06 18:45:00-06'
  WHEN 'city-sound-festival' THEN '2026-07-18 12:00:00-06'
  WHEN 'midtown-hiphop-night' THEN '2026-12-04 22:00:00-06'
  ELSE COALESCE(starts_at, now())
END
WHERE starts_at IS NULL;

ALTER TABLE events ALTER COLUMN location_id SET NOT NULL;
ALTER TABLE events ALTER COLUMN starts_at SET NOT NULL;

INSERT INTO events (
  slug, name, artists, date, time, venue, location_id, starts_at, genre, price,
  size, image, description, lineup, capacity, vibe
)
VALUES
  ('midnight-bloom', 'Midnight Bloom', 'Luna Harbor & The Soft Static',
   'Fri, Nov 13, 2026', '8:30 PM', 'The Lantern Room',
   (SELECT id FROM locations WHERE slug = 'the-lantern-room'), '2026-11-13 20:30:00-06',
   'Indie Pop', '$18', 'Intimate',
   'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
   'A dreamy indie-pop set with warm guitars, synth textures, and a crowd that sings along to every chorus.',
   'Luna Harbor, The Soft Static, and opening act Mira Sloane', '120 guests',
   'Cozy, neon-lit, and very singable'),
  ('after-dark-collective', 'After Dark Collective', 'Neon Harbor',
   'Sat, Nov 21, 2026', '9:15 PM', 'Basement 42',
   (SELECT id FROM locations WHERE slug = 'basement-42'), '2026-11-21 21:15:00-06',
   'Electronic', '$22', 'Medium',
   'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
   'An EDM and house night full of glowing visuals, bass-heavy drops, and a packed dance floor.',
   'Neon Harbor, Velocity Echo, and DJ Reed', '240 guests',
   'High energy and all about the beat drop'),
  ('open-mic-on-main', 'Open Mic on Main', 'Student Performers',
   'Wed, Oct 14, 2026', '7:00 PM', 'Cedar Street Café',
   (SELECT id FROM locations WHERE slug = 'cedar-street-cafe'), '2026-10-14 19:00:00-06',
   'Acoustic', 'Free', 'Small',
   'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
   'A casual open mic where poets, guitarists, and singer-songwriters share original tracks in a relaxed café setting.',
   'Student performers, spoken word artists, and acoustic duos', '80 guests',
   'Low pressure and super welcoming'),
  ('rhythm-under-the-bridge', 'Rhythm Under the Bridge', 'Hollow Roads',
   'Thu, Aug 6, 2026', '6:45 PM', 'Riverfront Stage',
   (SELECT id FROM locations WHERE slug = 'riverfront-stage'), '2026-08-06 18:45:00-06',
   'Alternative Rock', '$15', 'Large',
   'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=1200&q=80',
   'An outdoor indie-rock showcase with a sunset backdrop, local food trucks, and a big sing-along crowd.',
   'Hollow Roads, Fern Echo, and Last Call Parade', '500 guests',
   'Open-air, gritty, and charming'),
  ('city-sound-festival', 'City Sound Festival', 'Multiple Artists',
   'Sat, Jul 18, 2026', '12:00 PM', 'North Park Grounds',
   (SELECT id FROM locations WHERE slug = 'north-park-grounds'), '2026-07-18 12:00:00-06',
   'Festival', '$35', 'Large',
   'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1200&q=80',
   'A full-day music festival featuring local acts, food vendors, pop-up art, and a full sunset finale.',
   'Dozens of local artists across stages and pop-up sets', '900 guests',
   'Big festival energy with something for everyone'),
  ('midtown-hiphop-night', 'Midtown Hip-Hop Night', 'Kite Theory',
   'Fri, Dec 4, 2026', '10:00 PM', 'Hollow Beat Hall',
   (SELECT id FROM locations WHERE slug = 'hollow-beat-hall'), '2026-12-04 22:00:00-06',
   'Hip-Hop', '$20', 'Medium',
   'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
   'A night of live rap, DJ sets, and high-energy guest appearances from student MCs and touring local acts.',
   'Kite Theory, Bodega Flow, and special guest DJ Mace', '300 guests',
   'Loud, sweaty, and totally worth it')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  artists = EXCLUDED.artists,
  date = EXCLUDED.date,
  time = EXCLUDED.time,
  venue = EXCLUDED.venue,
  location_id = EXCLUDED.location_id,
  starts_at = EXCLUDED.starts_at,
  genre = EXCLUDED.genre,
  price = EXCLUDED.price,
  size = EXCLUDED.size,
  image = EXCLUDED.image,
  description = EXCLUDED.description,
  lineup = EXCLUDED.lineup,
  capacity = EXCLUDED.capacity,
  vibe = EXCLUDED.vibe;
