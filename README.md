# Atlas Watch

A React dashboard for browsing natural events from [NASA EONET](https://eonet.gsfc.nasa.gov/) (Earth Observatory Natural Event Tracker). Use it to scan active wildfires, storms, floods, and volcanoes on a map, then drill into a full event list and observation history.
[Live App](https://atlas-weather-watch.web.app/)

## Features

- **Dashboard** (`/`) — summary stats, status and time-range filters, a read-only clustered map (up to 100 markers), and the 10 most recent events
- **Event Explorer** (`/explorer`) — search, categories, status, and time range; paginated table; interactive map that flies to a selected event
- **Event detail** (`/events/:eventId`) — track or flood polygon on a satellite map, sources, and observation history

Filters live in the URL (`status`, `days`, `category`, `q`) so views can be shared. Header navigation starts each page with default filters. **View all events** on the dashboard keeps status and time range.

## Stack

- Vite, React 19, TypeScript
- Mantine v9, Tabler icons
- React Router
- Leaflet / react-leaflet (Esri World Imagery tiles)
- Vitest + Testing Library

Data is fetched in the browser from EONET v3 (`https://eonet.gsfc.nasa.gov/api/v3`). Override the base URL with `VITE_API_BASE_URL` if needed. No API key is required.

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm test` | Unit tests (Vitest) |
| `npm run test:watch` | Watch mode |
| `npm run build` | Typecheck and production build (`dist/`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Oxlint |
| `npm run format` | Prettier |

## Project layout

```
src/
  api/           EONET client
  app/           Shell, header, router
  components/    UI (maps, filters, table, cards)
  hooks/         Data and URL filters
  lib/           Normalize, coordinates, summary helpers
  pages/         Dashboard, Explorer, Event detail
  types/
```

EONET **Point** geometry is GeoJSON `[longitude, latitude]`. Some flood **Polygon** rings from GDACS are stored as `[latitude, longitude]`; `src/lib/coordinates.ts` detects that case so markers land on land, not in the ocean.

## Product decisions and tradeoffs

**Geographic overview first.** The dashboard is a briefing, not a research desk. A world map plus a short list answers “what’s happening where?” faster than a table of 2,000 rows. Explorer exists for people who want to filter, sort, and inspect.

**History only on the event page.** Observation tracks and flood footprints are the interesting part of a single event, and they are expensive to draw at global scale. The home map shows last-known location only. Opening an event is the contract for “show me how this moved.”

**Limited filters on the dashboard.** Status and time range change the briefing. Search and category belong on Explorer, where the table can absorb a narrower set. Fewer controls on home also keep the default story stable: active events in the last week.

**Geometry was messier than the API docs.** Points are GeoJSON `[lng, lat]`. Some GDACS flood polygons arrive as `[lat, lng]`, which put events in the ocean or Antarctica until we inspected rings instead of trusting array order. First and latest observation are taken from geometry **sorted by date**, not from the order EONET returns the array.

## Data notes

EONET events are reported by third-party sources (IRWIN, GDACS, JTWC, and others). Locations, magnitudes, and “open” vs “closed” status come from those feeds, not from this app.
