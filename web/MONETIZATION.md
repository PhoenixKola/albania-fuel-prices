# Web monetization

Karburanti Sot currently has three independent commercial/measurement paths:

- **DiscoverCars referrals** use validated HTTPS URLs supplied through `VITE_RENTAL_URL` and optional placement overrides. The cards carry a visible disclosure and `rel="sponsored noopener"`.
- **Cloudflare Web Analytics** uses one manually injected beacon configured by `VITE_CF_ANALYTICS_TOKEN`. It is separate from advertising preferences.
- **Adsterra Native Banner** is integrated but feature-flagged off for the first deployment. Google AdSense runtime support is decommissioned.

## Adsterra configuration

`VITE_ADSTERRA_ENABLED` is the only Adsterra build setting. Missing, blank, or `false` means disabled. Local development defaults to disabled in `.env.example`. The Deploy web workflow passes `${{ vars.VITE_ADSTERRA_ENABLED }}` into the Vite production build. Keep the repository variable `false` until the disabled deployment has been inspected.

The public Native Banner identifiers live centrally in `src/config/monetization.ts`. They are the exact script URL and fixed container ID supplied by Adsterra; they are browser-visible identifiers, not secrets.

An ad becomes eligible only when all of these are true:

1. `VITE_DEPLOY_ENV=production`;
2. `VITE_ADSTERRA_ENABLED=true`;
3. the hostname is `karburantisot.com` or `www.karburantisot.com`;
4. the visitor has explicitly allowed optional advertising;
5. the current route is eligible and its page renders the single placement.

The versioned `karburanti-privacy-v1` local-storage value records `necessary: true` and `advertising: true`, `false`, or undecided. A first-party privacy panel offers equally clear allow and continue-without-advertising actions. The footer’s **Privacy & cookies** button reopens it. Declining leaves every product feature available.

## Placement and SPA lifecycle

The MVP permits one active Native Banner per page:

- homepage: after the primary fuel-price experience;
- fuel-country pages: after the current-price section;
- Albania rental guide: after the first substantive selection sections;
- road-trip guide: after the cross-border section;
- How fuel prices work and Europe comparison guides: after their primary content.

The Trip Calculator, Road Reality, stations/maps, legal pages, contact, games, 404/error pages, and small utilities are excluded.

`AdsterraNativeAd` first renders the fixed container, then schedules provider initialization by one browser task. The delay prevents React StrictMode’s development probe from making a duplicate request. A module-level active-placement guard removes any previous script and markup before a new route initializes. Unmount removes the script, observer, timer, and container children; a later eligible route receives a fresh invocation. There can be only one matching container and one active provider script at a time.

The wrapper reserves a modest responsive area while loading. Provider-inserted content marks it filled. A script failure or an eight-second no-fill timeout collapses the wrapper without displaying an error or retrying. Real creative delivery may not work on localhost, so browser tests intercept the exact provider URL and insert a mock creative.

## Operations

Instant display-ad rollback: set `VITE_ADSTERRA_ENABLED=false` and run **Deploy web**. This does not affect analytics, referrals, or privacy preferences.

After enabling, inspect `/`, `/fuel-prices/albania`, `/fuel-prices/greece`, `/albania-car-rental-guide`, and `/road-trip-fuel-guide` after allowing advertising. Confirm one labelled creative, one fixed container, no overflow, clean SPA navigation, and no console errors. Also confirm excluded pages make no provider request. Test accept, decline, and changing the choice from the footer.

`public/ads.txt` intentionally contains no seller entry. The obsolete Google authorization was removed. Do not add an Adsterra line unless the publisher dashboard or Adsterra support supplies the exact authorized record.

No Content Security Policy is currently configured by this repository. The supplied script host is `pl31351771.profitableratecpmnetwork.com`. Once real delivery is enabled, inspect the browser network log for any additional provider hosts before introducing a restrictive CSP; do not guess or use broad wildcards.

## Environment variables

| Variable | Purpose |
|---|---|
| `VITE_ADSTERRA_ENABLED` | Exact `true` enables consent-gated Adsterra eligibility |
| `VITE_RENTAL_URL` | Base DiscoverCars URL with a real `a_aid` parameter |
| `VITE_RENTAL_URL_CALCULATOR` | Optional calculator campaign override |
| `VITE_RENTAL_URL_GUIDE` | Optional rental-guide campaign override |
| `VITE_RENTAL_URL_ROAD_TRIP` | Optional road-trip campaign override |
| `VITE_RENTAL_URL_ALBANIA` | Optional Albania country-page campaign override |
| `VITE_CF_ANALYTICS_TOKEN` | 32-character Cloudflare Web Analytics token |

The following repository variables are obsolete after this migration and may be deleted manually: `VITE_ADS_ENABLED`, `VITE_ADS_CMP_PUBLISHED`, `VITE_AD_SLOT_HOME`, `VITE_AD_SLOT_CONTENT`, and `VITE_AD_SLOT_ARTICLE_END`.

Adsterra revenue and creative quality must be measured in its publisher dashboard. DiscoverCars clicks, completed rentals, and commissions remain in its affiliate dashboard. Cloudflare measures site traffic and performance. Review revenue per 1,000 visits alongside engagement and page performance before expanding ad coverage.
