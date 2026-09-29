# WEB103 Project 2 - KeepUp (Discover Local Music)

Submitted by: **Tsheten Sherpa**

About this web app: **A local music event discovery app that lets users browse live shows, filter by genre, and view detailed event information for each listing.**

Time spent: **8 hours**

## Required Features

The following required functionality is implemented:

- [x] The web app uses only HTML, CSS, and JavaScript without a frontend framework.
- [ ] The web app is connected to a Render PostgreSQL database with a structured `events` table.
  - [ ] Record the Render dashboard showing the available PostgreSQL database in the walkthrough.
  - [ ] Show the table contents with `SELECT * FROM events;` in `psql` during the walkthrough.

The database connection and schema are implemented, but the Render database must be created and configured before the database requirement can be checked off.

## PostgreSQL Setup

Install dependencies and create a local environment file:

```powershell
npm install
Copy-Item .env.example .env
```

Create a PostgreSQL database in Render. For local development, fill the `PGDATABASE`, `PGHOST`, `PGPASSWORD`, `PGPORT`, and `PGUSER` values in `.env` using the database's external connection details. Keep `.env` private; it is ignored by Git.

In the Render web service's Environment settings, add those same five variables using the database's internal connection details. The app enables SSL for the PostgreSQL connection. To start locally, run `npm start`; the server listens on port `3000` unless `PORT` is set.

Run the schema and seed script against the Render database using its external connection URL from the Render dashboard:

```powershell
psql "PASTE_EXTERNAL_DATABASE_URL_HERE" -f src/db/setup.sql
```

Connect with `psql "PASTE_EXTERNAL_DATABASE_URL_HERE"`, then run `SELECT * FROM events;` to verify the seeded events and capture the required walkthrough evidence. The SQL setup is safe to rerun: event slugs are unique and existing seed rows are updated.

## Optional Features

The following optional functionality is implemented:

- [ ] Users can search for items by a specific attribute.

Additional functionality:

- [x] Genre filtering, unique event detail pages, and a custom 404 page.

## Video Walkthrough


The existing walkthrough shows the app UI. Record a new walkthrough that also shows the Render PostgreSQL database in the dashboard and the result of `SELECT * FROM events;` in `psql` before marking the database requirement complete.

[Click here to watch the walkthrough](https://i.imgboxy.com/5tsblj.gif)

![Video Walkthrough](https://i.imgboxy.com/5tsblj.gif)

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ... screenToGif
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

This project was built as a lightweight Express app with a static HTML/CSS/JS frontend. The main challenges were organizing the event data cleanly and making sure the detail views, 404 handling, and genre filtering all worked consistently.

## License

Copyright [2026] [Tsheten]

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
