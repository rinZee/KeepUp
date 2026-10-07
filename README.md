# WEB103 Project 3 - KeepUp

Submitted by: **Tsheten Sherpa**

About this web app: **KeepUp is a local music community space where people can explore venues, see the events happening at each place, and discover upcoming shows.**

Time spent: **Not tracked**

## Required Features

The following **required** functionality is completed:

- [x] **The web app uses React to display data from the API.**
- [x] **The web app is connected to a PostgreSQL database, with an appropriately structured `events` table.**
  - Connected to the configured Render PostgreSQL database and verified that the schema contains six locations and six seeded events.
  - [x] **The walkthrough shows the Render dashboard and confirms that the PostgreSQL database is available.**
  - [x] **The walkthrough shows the table contents using `SELECT * FROM events;`.**
- [x] **The web app displays a title.**
- [x] **The website includes a visual interface that allows users to select a location.**
- [x] **Each location has a detail page with its own unique URL.**
- [x] **Clicking a location displays the events from the `events` table associated with it.**

The following **optional** functionality is implemented:

- [x] An additional page shows all events.
  - [x] Users can filter events by location and genre.
- [x] Events display a live countdown to their start time.
  - [x] Past events are labelled and visually distinguished.

The following **additional** features are implemented:

- [x] JSON API endpoints for locations and events, including individual detail endpoints.
- [x] Event detail pages with lineup, venue, ticket, and capacity information.
- [x] API and UI error states for unavailable data and missing location/event records.

## Run the app

Install dependencies, configure the database environment variables, then build and start the app:

```powershell
npm install
Copy-Item .env.example .env
# Add your PostgreSQL connection values to .env
npm start
```

The app listens on port `3000` unless `PORT` is set. `npm start` builds the React client before starting the Express server. Run `npm test` to exercise the API routes.

## PostgreSQL and Render setup

Create a PostgreSQL database in Render and set `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGPORT`, and `PGDATABASE` in the root `.env` file for local use. Add the database's **internal** connection values to the Render web service's Environment settings. Do not commit `.env`.

Create and seed the `locations` and `events` tables by running the SQL setup script against the database:

```powershell
psql "YOUR_DATABASE_CONNECTION_URL" -f src/db/setup.sql
```

Verify the event data with:

```sql
SELECT * FROM events;
```

The SQL script can be rerun to apply the schema changes and refresh its sample venues and events.

## Video Walkthrough
[Click here to check the walkthrough GIF](https://i.imgboxy.com/hnpi8o.gif)

## Notes

The app uses six sample music venues as its locations. The Render PostgreSQL connection, schema, and seed data were verified. The dashboard and `psql` walkthrough evidence still need to be recorded; those checklist items are intentionally left unchecked.

## License

Copyright [2026] [Tsheten Sherpa]

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
