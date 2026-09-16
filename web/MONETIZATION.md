# Web monetization

Karburanti Sot uses DiscoverCars rental referrals, one Cloudflare Web Analytics beacon, and consent-gated Adsterra display advertising. Google AdSense runtime code is absent. `VITE_ADSTERRA_ENABLED=true` is live in production; do not switch it off as part of routine releases.

## Configuration and consent

`VITE_ADSTERRA_ENABLED` must equal `true`, `VITE_DEPLOY_ENV` must equal `production`, the hostname must be `karburantisot.com` or `www.karburantisot.com`, and the visitor must explicitly allow optional advertising before either provider script loads. Local and preview hosts never request Adsterra. The Deploy web workflow passes the flag from `${{ vars.VITE_ADSTERRA_ENABLED }}`. The first-party `karburanti-privacy-v1` preference can be changed from **Privacy & cookies** in the footer; declining removes both active placements and causes zero new Adsterra requests. The product remains usable without ads. No Google CMP is installed.

The public identifiers are centralized in `src/config/monetization.ts`:

- Native Banner: `pl31351771.profitableratecpmnetwork.com/d3a677f82e7972dbdc5767166cde992f/invoke.js`, fixed container `container-d3a677f82e7972dbdc5767166cde992f`.
- 300×250 Banner: key `2faa9939eb0689d7a6d953b40a97a354`, `iframe` format, `www.highrevenueformat.com/2faa9939eb0689d7a6d953b40a97a354/invoke.js`.

The banner executes the supplied synchronous iframe-format code inside a 300×250 `srcDoc` iframe. This keeps `window.atOptions` scoped to that iframe and prevents its `document.write` behavior from replacing the SPA document. The iframe mounts only when the placement nears the viewport and is removed on route change or consent revocation. The Native unit uses a singleton active-placement guard and its fixed container ID. It, too, initializes near the viewport. Each active page has at most one of each format. Script error or an eight-second no-fill timeout collapses the wrapper without a user-facing error or retry. Both wrappers carry a visible **Advertisement / Reklamë** label and reserve their dimensions while loading. The 300×250 creative is centered without stretching. Ad blockers may stop either provider domain; this is handled as no-fill.

## Placement policy

Primary content always comes before ads. There is at most one ad on short/interactive pages and two on substantial guides and country pages. Native placements:

| Route | Position |
|---|---|
| `/` | After primary fuel-price content |
| `/fuel-prices/:country` | After current-price section, only when price data exists |
| `/trip-cost-calculator` | After form and results |
| `/road-status` and `/road-status/:route` | After result, map, sources, referral and safety note |
| `/stations` | After station finder and route entry point |
| `/compare` | After watchlist tool |
| `/rankings` | After ranking and map experience |
| `/fuel-quiz`, `/daily-challenge` | After the game when price data exists |
| `/insights`, `/insights/:article` | After articles/list, only on published articles |
| `/market-report` | After the report when available |
| `/about` | After the main narrative and principles |
| `/methodology` | After the data-process sections |
| `/albania-car-rental-guide`, `/road-trip-fuel-guide`, `/how-fuel-prices-work`, `/europe-fuel-comparison` | Between substantive sections |

The second 300×250 unit appears only on `/fuel-prices/:country` with prices, `/methodology`, `/albania-car-rental-guide`, `/road-trip-fuel-guide`, `/how-fuel-prices-work`, and `/europe-fuel-comparison`. Each has substantial content between it and the Native unit. The rental guide, road-trip guide and Albania price page also contain a separate DiscoverCars card; the display banner is separated from that card by editorial content. The calculator, road and station tools each have only one ad and no ad inside controls, map, route status, or source cards.

Intentionally ad-free public routes: `/privacy`, `/terms`, `/editorial-policy`, and `/disclaimer` are legal/policy content; `/contact` is too short; 404 and unknown article/country pages are error or insufficient-content states. The consent dialog has no ad. Offline/missing-data game and country states also suppress ads that would outweigh the useful content.

## Other commercial paths and operations

DiscoverCars cards only render for validated HTTPS `discovercars.com` links with a real `a_aid`. `VITE_RENTAL_URL` is the base link; `VITE_RENTAL_URL_CALCULATOR`, `VITE_RENTAL_URL_GUIDE`, `VITE_RENTAL_URL_ROAD_TRIP`, and `VITE_RENTAL_URL_ALBANIA` are optional overrides. Tracking parameters are preserved. Cards have visible affiliate disclosures and `rel="sponsored noopener"`.

`VITE_CF_ANALYTICS_TOKEN` enables exactly one manually inserted Cloudflare Web Analytics beacon on the production host. It is independent of advertising consent and handles SPA navigation. No Google Analytics or custom event system is added.

Adult ad categories are controlled in the Adsterra account, not by this app. The application does not alter them. The provider controls creative selection, fill, downstream requests and any behavior inside its creative. `public/ads.txt` has no unverified seller line; add one only if Adsterra supplies the exact authorization record. Revenue and creative quality should be checked in Adsterra reporting; DiscoverCars clicks, completed rentals and commissions in its dashboard; traffic and page performance in Cloudflare. Compare revenue per 1,000 visits with page engagement and Core Web Vitals before adding formats.

If a serious ad problem requires an emergency rollback, set `VITE_ADSTERRA_ENABLED=false` and run **Deploy web**. This does not affect referrals, analytics, or the saved privacy preference. This is an emergency control, not the normal release state.
