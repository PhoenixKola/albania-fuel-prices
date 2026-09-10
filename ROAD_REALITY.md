# Road Reality

Road Reality is a manually curated, source-first route-status feature at `/road-status`. It answers a narrow question: what do the public sources stored with this route currently support? It is not turn-by-turn navigation or a live road feed.

## Architecture

- `web/src/models/road.ts` defines the strongly typed route, section, source, status, confidence, geometry, and vehicle-guidance records.
- `web/src/data/roadRoutes.ts` is the maintained route dataset and the only place where current road claims are seeded.
- `web/src/utils/roadReality.ts` centralizes freshness labels, status counts, timestamp formatting, and share text.
- `web/src/pages/RoadStatusPage.tsx` renders the interactive route selector, result, map, source provenance, vehicle guidance, rental referral, and report form.
- `web/src/components/road/RoadRouteMap.tsx` displays a lightweight schematic corridor over OpenStreetMap raster tiles.
- `web/scripts/roadRealityPrerender.ts` creates substantive static HTML for the main route and every curated detail URL.
- `web/src/utils/roadSeo.ts`, `web/src/app/RouteSeo.tsx`, and `web/scripts/generate-sitemap.ts` provide runtime metadata and index only the route pages with meaningful unique context.

The status taxonomy is `OPEN`, `CAUTION`, `RESTRICTED`, `CLOSED`, and `UNKNOWN`. `UNKNOWN` is used whenever a current, route-specific claim cannot be supported.

## Seed routes

The MVP contains 19 routes:

| Route | Slug | Stored status | Indexed |
| --- | --- | --- | --- |
| Berat → Gjirokastër | `berat-gjirokaster` | UNKNOWN | No |
| Himarë → Gjipe access | `himare-gjipe` | UNKNOWN | No |
| Sarandë → Blue Eye | `sarande-blue-eye` | UNKNOWN | No |
| Sarandë → Gjirokastër | `sarande-gjirokaster` | UNKNOWN | No |
| Shkodër → Koman | `shkoder-koman` | UNKNOWN | No |
| Shkodër → Theth | `shkoder-theth` | UNKNOWN | Yes |
| Tirana → Berat | `tirana-berat` | UNKNOWN | No |
| Tirana → Bovilla | `tirana-bovilla` | UNKNOWN | Yes |
| Tirana → Durrës | `tirana-durres` | UNKNOWN | No |
| Tirana → Gjirokastër | `tirana-gjirokaster` | UNKNOWN | No |
| Tirana → Korçë | `tirana-korce` | RESTRICTED | Yes |
| Tirana → Krujë | `tirana-kruje` | UNKNOWN | No |
| Tirana → Përmet | `tirana-permet` | UNKNOWN | No |
| Tirana → Pogradec | `tirana-pogradec` | RESTRICTED | Yes |
| Tirana → Sarandë | `tirana-sarande` | UNKNOWN | Yes |
| Tirana → Shkodër | `tirana-shkoder` | UNKNOWN | No |
| Tirana → Theth | `tirana-theth` | UNKNOWN | Yes |
| Tirana → Vlorë | `tirana-vlore` | UNKNOWN | No |
| Vlorë → Sarandë / SH8 | `vlore-sarande-sh8` | UNKNOWN | Yes |

No route is marked OPEN or CLOSED in the seed data. Tirana–Korçë and Tirana–Pogradec are RESTRICTED because both cross the part of the Librazhd–Pogradec corridor covered by the stored State Police restriction. All other routes remain UNKNOWN because a current route-specific authority statement was not verified during the recorded review.

## Data sources used

| Source | Type | URL | Use |
| --- | --- | --- | --- |
| Albanian State Police restriction at Arrat e Gurrës | Official notice | <https://asp.gov.al/bllokohet-levizja-ne-aksin-librazhd-pogradec-policia-ne-sherbim-per-garantimin-e-sigurise-rrugore/> | Supports the stored heavy-vehicle and bus restriction on the affected corridor. It does not decide permission for a particular passenger or rental vehicle. |
| ARRSH temporary Arrat e Gurrës deviation | Official notice | <https://www.arrsh.gov.al/njoftim-26.html> | Older construction/deviation context. It is visibly stale and is not treated as a fresh status guarantee. |
| ARRSH road-condition archive | Official public archive | <https://www.arrsh.gov.al/informacion-i-gjendjeve-te-rrugeve.html> | Manually reviewed for newer route-specific statements. Absence of a notice never produces OPEN. |
| Albanian State Police | Official public site/archive | <https://asp.gov.al/> | Manually reviewed for road notices. Silence never produces OPEN. |
| OpenStreetMap | Open map | <https://www.openstreetmap.org/copyright> | Base-map context only. It does not support a current closure or vehicle-suitability claim. |

Every source record stores the authority, source type, original HTTPS URL, publication timestamp when stated, Karburanti Sot check timestamp, geographic scope, derived status, and an explanatory note.

## Sources investigated but not integrated

- **AKMC:** public incident and severe-weather posts can be useful context, but the reviewed material was regional and not specific enough to derive a status for a curated corridor.
- **ASIG:** the national geoportal exposes road-network/geospatial services, but no documented current road-status feed was verified. Geometry alone does not establish closures or passability.
- **Albania Open Data portal:** no dependable current route-status dataset or documented API suitable for this MVP was verified.
- **ARRSH and State Police archives as automation inputs:** the public HTML notices are suitable for manual review, but no stable, documented machine-readable status API or feed was found. The MVP does not silently scrape them.
- **OpenStreetMap/Overpass as a status feed:** map geometry and tags cannot guarantee a current closure. The app makes no Overpass requests.

## Manual update process

1. Open the official source directly and confirm its publication date, geographic scope, affected vehicle classes, and whether it supersedes an older notice.
2. Edit `web/src/data/roadRoutes.ts`. Update `ROAD_DATA_CHECKED_AT` to the actual review time with an explicit offset.
3. Add or update a `RoadSource` with the original URL, source type, publication time if available, review time, scope, derived status, and a short factual note.
4. Update only the sections covered by the source. Do not spread a local notice across unrelated sections.
5. Derive the overall route status conservatively: `CLOSED` for a supported closure, `RESTRICTED` for a supported access/vehicle restriction, `CAUTION` for supported hazards or material disruption, `OPEN` only for an explicit current authority confirmation that covers the route, otherwise `UNKNOWN`.
6. Update `lastChangedAt` only when the supported status changed. Keep confidence conservative and update vehicle guidance without contractual or safety claims.
7. Run `npm test`, `npm run build`, `npm run test:browser`, and `npm run lint` from `web` before publishing.

To add a route, add one `Seed` entry with a stable slug, route-specific description and sections, representative geometry, and supported sources. Keep `indexable` false until the route has meaningful unique information that warrants a search page.

## Freshness rules

Freshness is calculated centrally from `lastCheckedAt` by calendar day:

- 0 days: **Checked today** (`fresh`)
- 1 day: **Checked yesterday** (`fresh`)
- 2–3 days: **Checked N days ago** (`recent`)
- more than 3 days: **Stale · checked N days ago** (`stale`)
- missing or invalid timestamp: **Unknown**

Route and section freshness use the review timestamp. A source card uses the publication timestamp when one exists, so an old notice stays visibly stale even if it was reviewed today. Reviewing an old notice does not make the source itself fresh.

## Safety wording

State only what the stored source supports. Preferred phrases include “No route-specific current authority statement was verified,” “conditions can change after the latest verification,” and “check current authority guidance before departure.” Never describe a route as safe, definitely open, suitable for every rental car, or guaranteed passable. Rental supplier rules remain separate from road status.

Community reports open the visitor's email client and are headed `UNVERIFIED USER REPORT`. They are reviewed manually and never update a route automatically.

## Map and OpenStreetMap use

The map reuses the project's lightweight raster-tile pattern and adds no mapping library or paid service. It requests nine lazy-loaded standard OSM tiles for the selected route viewport, draws a schematic status-colored corridor locally, and does not prefetch, bulk-download, or call Overpass. Visible links provide “© OpenStreetMap contributors” attribution and the OSM copyright page. Standard OSM tiles are best-effort infrastructure; a production scale-up should move to a policy-compliant dedicated provider or self-hosted tiles with caching.

## Manual versus automated behavior

Road status, sections, source provenance, confidence, route geometry, and vehicle guidance are maintained manually in the repository. Freshness labels, status counts, route rendering, canonical metadata, share URLs, map viewport, prerendering, and sitemap generation are automated from those records. OSM tiles provide map context at view time only.

Cloudflare Web Analytics remains the single analytics beacon and automatically records SPA page views, including route-detail URLs. Cloudflare Web Analytics does not offer arbitrary custom event tracking, so named interaction events were not fabricated and no second analytics script was added. Affiliate rendering reuses the existing `roadTrip` placement and its configured base-URL fallback. AdSense and consent configuration are untouched.

## Known limitations and future automation

- There is no verified official nationwide live road-status API in this implementation.
- Data can become stale between repository updates; the UI exposes that age instead of implying live coverage.
- UNKNOWN routes may still be open, restricted, or closed. UNKNOWN means only that the stored sources do not support a current claim.
- The line on the map is a representative schematic through named waypoints, not routable navigation geometry.
- Weather, incidents, road signs, police instructions, ferry operations, and supplier terms can supersede the summary.
- Future work can ingest a documented official feed if one becomes available, add a reviewed zero-cost report endpoint, automate stale-record alerts, and add privacy-preserving interaction analytics if the existing analytics provider adds supported custom events.
