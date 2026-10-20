# October 2026 search and data accuracy remediation

Baseline: `main` at `87a8571`, after fast-forwarding the data bot's 20 October commit. Owner-supplied Search Console window: **20 September–17 October 2026**, 155 clicks, 17,697 impressions, 0.88% CTR, average position 10.7. Those are aggregate page results, not page-filtered query data; no search outcome is asserted here.

## Confirmed defects and repair

| Evidence | Before | Repair and verification |
| --- | --- | --- |
| CONFIRMED IN SOURCE and live [Cargopedia table](https://www.cargopedia.net/europe-fuel-prices) | The parser required a dotted month date and substituted the fetch day when it failed. The source showed **12 October 2026**, while `latest.json` said **20 October**. | Accept the displayed undotted date, reject missing/invalid/future dates, and fail safely. Correct `latest.as_of` to 12 October while preserving its actual 20 October fetch timestamp. Fixture tests cover these paths. The snapshot is visibly stale on 20 October. |
| CONFIRMED IN SOURCE | Static country paragraphs and FAQ/schema said, for example, Greek fuel was always dearer and Kosovo's gap was negligible. | Replace dormant fixed market claims with one fuel-specific, source-dated model shared by React, prerender and FAQ JSON-LD. Remove unverified station/tax/traffic claims from the country metadata module. Test petrol/diesel opposite directions, Kosovo, missing fuel, ties and stale dates. |
| CONFIRMED IN SOURCE | Historical percentile copy recommended refuelling or waiting and called collection-day observations “today.” | Historical position is descriptive, explicitly not predictive. Generated reports label collection dates separately from upstream publication dates and compare border gaps only on matched observed dates. |
| CONFIRMED IN SOURCE | August Insights articles used dated readings as present advice and made unsupported market-cause claims. | Keep all six existing URLs but rewrite as dated, clearly bounded examples. Preserve reproducible 5 August prices and correct 50 L arithmetic; remove current buy/wait instructions and unsupported causal certainty. |
| CONFIRMED IN SOURCE | Compare editorial and prerender repeated fixed border advice opposite to the dataset. | React examples use the shared comparison helper for the selected fuel; prerender examples use the same helper for diesel. EN/SQ context and route-calculator links explain the limits. |
| CONFIRMED IN SOURCE | Stations copy said coordinates stayed in the browser even though a station proxy receives them; the hook hid results beyond 100. | Align EN/SQ privacy copy with the lookup path; keep all fetched results reachable through the existing eight-per-page list while rendering only the current page on the map. No station-level price claim. |
| CONFIRMED IN SOURCE | Sitemap fell back to build day when price data was unreadable. | Build fails without a valid source date. A build gate checks 13 priority static routes, sitemap entries, unique SEO tags, visible country copy and FAQ JSON-LD parity. |
| CONFIRMED IN SOURCE | A stale/cached mobile price could trigger a threshold notification; a Kosovo fallback could inherit the main table's date. | Alerts require a recent verified source date and reject unverified/mismatched market dates. Mobile Home, Compare and Rankings disclose fallback or differing dates. Optional JSON fields preserve old app compatibility. |
| CONFIRMED IN SOURCE | Road review remains dated **10 September 2026**. | Add a prominent EN/SQ stale warning in runtime and static route pages. Do not advance the review date, claim a new opening, or infer an open road from silence. Rendering is tested not to mutate the review. |

For the 20 October price fixture, **Greece petrol 95 is €0.052/L above Albania (€2.60 per 50 L)**, while **Greece diesel is €0.279/L below (€13.95 per 50 L)**. Kosovo diesel is **€0.785/L below Albania (€39.25 per 50 L)**, but this particular Kosovo row has an **unverified individual source date**, so it is not presented as a current border recommendation. Actual pump prices, fuel already in the tank, distance, detours and tolls can reverse any practical saving.

The old history file remains an archive of **collection-day** records. We did not retrospectively invent publication dates or rewrite its observations. On the current source page, the main table's date is eight days before this review. The daily GitHub ingest now no-ops if the publication and values are unchanged; a same-date value change fails for manual review. Watch the “Update fuel data (Europe)” workflow and the site's source-date badge for stale feeds or failed jobs.

## Search landing-page changes

| Page | Title / first answer |
| --- | --- |
| Home | Title and 5-flame layout preserved. Meta description now calls the data source-dated. |
| Kosovo | Existing landing route and structure preserved; title drops an inaccurate “Today.” Visible reading and FAQ disclose the unverified row date. |
| Albania | Title: “Albania Fuel Prices | Petrol, Diesel & LPG per Litre”. First price section gives the dated three-fuel reference and a 50 L example; Greece and Kosovo are compared separately by fuel. |
| Greece | Title: “Greece Fuel Prices | Petrol & Diesel vs Albania”. Dated EUR/L values and opposite petrol/diesel directions replace fixed border instructions. |
| Italy | Title: “Italy Fuel Prices | Petrol, Diesel & LPG vs Albania”. Source-dated comparison replaces unsupported ferry/pump-price promises. |
| Croatia | Title: “Croatia Fuel Prices | Petrol, Diesel & LPG per Litre”. Dated values and Adriatic route links remain. |
| Portugal | Title: “Portugal Fuel Prices | Petrol, Diesel & LPG per Litre”. Dated values and Albania comparison replace an implied fixed price ordering. |
| Compare | Metadata explains selectable countries, fuel, EUR/L references and pump-price limits. Visible examples change with fuel. |
| Trip calculator | Metadata names actual inputs: country distance, consumption and fuel type, with dated EUR/ALL estimates. Existing interaction preserved. |
| Stations | Metadata and EN/SQ first explanation state mapped locations, straight-line distances and listed hours, not pump prices. |

Exact title changes on the search-priority routes (the country H1 changed consistently from “{country} fuel prices today” to “{country} fuel prices”; its lead changed “Current” to “Dated”):

| Route | Before `<title>` | After `<title>` | First useful answer / metadata change |
| --- | --- | --- | --- |
| `/` | Fuel Prices Today in Albania & Europe \| Petrol, Diesel & LPG | Preserved | Description now says “source-dated ... reference prices” rather than “current ... daily-updated data”; five-flame H1 and layout preserved. |
| `/fuel-prices/kosovo` | Kosovo Fuel Prices Today — Petrol, Diesel & LPG \| Fuel Today | Kosovo Fuel Prices \| Petrol, Diesel & LPG \| Fuel Today | First dated price block discloses that this fallback row's individual source date is unverified. Existing route and landing structure remain. |
| `/fuel-prices/albania` | Fuel Prices in Albania Today \| Petrol, Diesel & LPG | Albania Fuel Prices \| Petrol, Diesel & LPG per Litre | First price block shows three EUR/L values and the actual source date; meta describes the 50 L and fuel-specific neighbor comparisons. |
| `/fuel-prices/greece` | Greece Fuel Prices Today \| Petrol & Diesel per Litre | Greece Fuel Prices \| Petrol & Diesel vs Albania | First price block shows actual source date; meta and comparison distinguish petrol and diesel directions. |
| `/fuel-prices/italy` | Italy Fuel Prices Today — Petrol, Diesel & LPG \| Fuel Today | Italy Fuel Prices \| Petrol, Diesel & LPG vs Albania | Meta replaces unverified ferry/motorway price advice with dated, fuel-specific reference comparison. |
| `/fuel-prices/croatia` | Croatia Fuel Prices Today \| Petrol, Diesel & LPG per Litre | Croatia Fuel Prices \| Petrol, Diesel & LPG per Litre | Meta says dated reference values, Albania comparison and Adriatic trip links. |
| `/fuel-prices/portugal` | Portugal Fuel Prices Today \| Petrol & Diesel per Litre | Portugal Fuel Prices \| Petrol, Diesel & LPG per Litre | Meta says dated values and fuel-specific Albania comparison, without implying a fixed direction. |
| `/compare` | Compare Fuel Prices Across Countries \| Fuel Today | Preserved | Description now says “Select countries and fuel type ... dated ... EUR/L differences”; selected-fuel examples use the shared comparison model. H1 remains the working watchlist's title. |
| `/trip-cost-calculator` | Trip Fuel Cost Calculator \| Albania & Europe \| Fuel Today | Preserved | Description now names distance by country, consumption, fuel type, dated EUR/ALL estimates and sharing; working calculator and H1 preserved. |
| `/stations` | Fuel Stations Near Me \| Map, Distance & Opening Hours | Preserved | Description and first explanation distinguish mapped stations, approximate distance/listed hours from unavailable pump prices. H1 preserved. |

The exact descriptions are maintained in `src/config/countryContent.ts` and `src/config/routes.ts`. The price/date prefix is generated by one shared function for prerender and client navigation, and the build gate compares it with static HTML. Search Console's page-level totals support prioritization, but the intent hypotheses in this table are **inference**, not page-filtered query findings.

No `/sq/` URLs or hreflang were invented. English remains the indexed canonical; the Albanian switch presents the corrected interactive material in Albanian. A separate fully translated static URL pilot needs page-filtered demand evidence and its own reciprocal hreflang implementation.

The deployment build prerenders 56 routes, with 42 indexable sitemap URLs; absent-price Montenegro and North Macedonia remain outside the index. The build gate checks one intended head title, description and canonical and one H1 on priority routes, plus their sitemap entries. Country FAQ JSON-LD derives from the same visible answers. Dataset schema no longer claims the upstream source publishes daily. The site has no new local-business, offer, review or station-price schema.

## Verification and remaining checks

- `web npm ci`, 23 web unit tests, `npm run build` and build-time SEO parity pass.
- `ingest npm ci` and 5 offline parser fixtures pass, including duplicate/conflicting rows, bounded prices and missing fuels. There is no ingest `tsconfig.json`; the fixture runner compiles its changed TypeScript paths.
- `mobile npm ci`, TypeScript and Android JavaScript export pass. This is **not** device QA or a Play Store release.
- Full web lint has its **same five baseline errors** in `EuropeChoroplethMap.tsx` (3), `WatchlistCard.tsx` (1) and `NearbyStationsCard.tsx` (1); no new errors.
- Browser suite: 26 of 27 passed on the first rerun; the final failure was an outdated Portugal title assertion, corrected and passed in an isolated rerun (all 27 checks have passed). Deployment status is recorded in the final delivery after push.

Road status: [ARRSH's road-notice archive](https://www.arrsh.gov.al/informacion-i-gjendjeve-te-rrugeve.html) and [Albanian State Police](https://asp.gov.al/) were checked for current route-specific evidence. The available search results did not justify a new 20 October review for every stored route. A manual authority review remains needed before changing the 10 September timestamp or any restricted/unknown status.

Google's [title guidance](https://developers.google.com/search/docs/appearance/title-link), [snippet guidance](https://developers.google.com/search/docs/appearance/snippet), [sitemap lastmod guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) and [language-variant guidance](https://developers.google.com/search/docs/specialty/international/localized-versions) informed the metadata and date choices. Search appearance is algorithmic and no CTR or ranking increase is promised.

Review GSC **28 days after deployment** against the owner-supplied 20 September–17 October baseline with matching country, device and search-type filters. Request page-filtered Query exports for Greece, Portugal, Italy, Croatia, Albania, Compare, Calculator and Stations. First assess useful clicks and query relevance; only then test another title or first-screen hypothesis. Do not noindex useful pages merely to raise the sitewide CTR.
