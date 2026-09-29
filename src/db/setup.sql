CREATE TABLE IF NOT EXISTS events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  artists TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  venue TEXT NOT NULL,
  genre TEXT NOT NULL,
  price TEXT NOT NULL,
  size TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  lineup TEXT NOT NULL,
  capacity TEXT NOT NULL,
  vibe TEXT NOT NULL
);

INSERT INTO events (
  slug, name, artists, date, time, venue, genre, price, size, image,
  description, lineup, capacity, vibe
)
VALUES
  (
    'midnight-bloom', 'Midnight Bloom', 'Luna Harbor & The Soft Static',
    'Fri, Sep 27', '8:30 PM', 'The Lantern Room', 'Indie Pop', '$18',
    'Intimate',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    'A dreamy indie-pop set with warm guitars, synth textures, and a crowd that sings along to every chorus.',
    'Luna Harbor, The Soft Static, and opening act Mira Sloane', '120 guests',
    'Cozy, neon-lit, and very singable'
  ),
  (
    'after-dark-collective', 'After Dark Collective', 'Neon Harbor',
    'Sat, Sep 28', '9:15 PM', 'Basement 42', 'Electronic', '$22', 'Medium',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
    'An EDM and house night full of glowing visuals, bass-heavy drops, and a packed dance floor.',
    'Neon Harbor, Velocity Echo, and DJ Reed', '240 guests',
    'High energy and all about the beat drop'
  ),
  (
    'open-mic-on-main', 'Open Mic on Main', 'Student Performers',
    'Wed, Oct 2', '7:00 PM', 'Cedar Street Café', 'Acoustic', 'Free', 'Small',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
    'A casual open mic where poets, guitarists, and singer-songwriters share original tracks in a relaxed café setting.',
    'Student performers, spoken word artists, and acoustic duos', '80 guests',
    'Low pressure and super welcoming'
  ),
  (
    'rhythm-under-the-bridge', 'Rhythm Under the Bridge', 'Hollow Roads',
    'Thu, Oct 3', '6:45 PM', 'Riverfront Stage', 'Alternative Rock', '$15',
    'Large',
    'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=1200&q=80',
    'An outdoor indie-rock showcase with a sunset backdrop, local food trucks, and a big sing-along crowd.',
    'Hollow Roads, Fern Echo, and Last Call Parade', '500 guests',
    'Open-air, gritty, and charming'
  ),
  (
    'city-sound-festival', 'City Sound Festival', 'Multiple Artists',
    'Sat, Oct 12', '12:00 PM', 'North Park Grounds', 'Festival', '$35', 'Large',
    'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1200&q=80',
    'A full-day music festival featuring local acts, food vendors, pop-up art, and a full sunset finale.',
    'Dozens of local artists across stages and pop-up sets', '900 guests',
    'Big festival energy with something for everyone'
  ),
  (
    'midtown-hiphop-night', 'Midtown Hip-Hop Night', 'Kite Theory',
    'Fri, Oct 18', '10:00 PM', 'Hollow Beat Hall', 'Hip-Hop', '$20', 'Medium',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
    'A night of live rap, DJ sets, and high-energy guest appearances from student MCs and touring local acts.',
    'Kite Theory, Bodega Flow, and special guest DJ Mace', '300 guests',
    'Loud, sweaty, and totally worth it'
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  artists = EXCLUDED.artists,
  date = EXCLUDED.date,
  time = EXCLUDED.time,
  venue = EXCLUDED.venue,
  genre = EXCLUDED.genre,
  price = EXCLUDED.price,
  size = EXCLUDED.size,
  image = EXCLUDED.image,
  description = EXCLUDED.description,
  lineup = EXCLUDED.lineup,
  capacity = EXCLUDED.capacity,
  vibe = EXCLUDED.vibe;