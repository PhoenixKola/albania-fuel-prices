# Web revenue setup and measurement

The website is prepared to earn through manually placed AdSense units and disclosed DiscoverCars referrals once accounts and configuration are ready. The trip calculator and Albania rental guide are useful, indexable landing pages for that traffic. Core tools remain free; no subscription, sales inbox or booking backend is required. See [GROWTH.md](GROWTH.md) for distribution ideas and alternatives to AdSense.

The public release is **English only**. `src/config/features.ts` keeps `ALBANIAN_ENABLED=false`, hides both language controls and overrides old saved Albanian preferences. Matching Albanian travel content, commercial disclosures and navigation translations remain in source. After approval, explicitly review the language/ad policy before changing the flag; the ad guard independently suppresses Albanian ad units. Do not treat enabling a language as an account approval workaround.

## Activate the production configuration

Deployment is a **GitHub Actions build followed by Cloudflare Pages Direct Upload**. Set the public values below in the GitHub repository's **Settings → Secrets and variables → Actions → Variables**, then run **Deploy web**. Adding variables only in Cloudflare's dashboard will not feed this build. No private credential belongs in a `VITE_` variable.

1. Join the [direct DiscoverCars affiliate program](https://www.discovercars.com/affiliate). Complete its application, eligibility and payout setup. We cannot create a paying affiliate identity from a website code change. Generate a link to Albania in your approved account and paste the **entire tracking URL** into `VITE_RENTAL_URL`. Accepted URLs use HTTPS on `discovercars.com` or `www.discovercars.com` and contain a non-placeholder `a_aid`. Keep all campaign parameters supplied by the provider. Plain listing URLs cannot earn referral commissions and are deliberately hidden as promotional cards.
2. Optionally generate separate account campaign links for the calculator, rental guide, road-trip guide and Albania price page. Set the corresponding variables below. A blank override uses the main link. This lets the affiliate dashboard distinguish placements without a custom tracking service. Verify each link with the provider's tracking tools; do not make a self-referral booking to test it.
3. In AdSense, create three **responsive display ad units** for `home`, `content` and `articleEnd`. Supply their numeric slot IDs. The publisher ID remains `ca-pub-2653462201538649`; `public/ads.txt` already names it. The previous slot was `5789581249`; it can be reused for a matching manual placement, but separate units give clearer reporting.
4. In AdSense **Privacy & messaging**, publish Google's European regulations message for `karburantisot.com`, including **Consent**, **Do not consent** and **Manage options**, and the site's `/privacy` URL. Configure the applicable regional messages and ad partners. Google's message loads via its AdSense script; **do not add another CMP or duplicate AdSense script**. Confirm the message works before setting `VITE_ADS_CMP_PUBLISHED=true`.
5. Turn **Auto ads off for this site** in AdSense. Otherwise account-level placements can bypass this release's layout controls. Set `VITE_ADS_ENABLED=true` once the units and message are ready. Missing or malformed slot IDs suppress that placement. Ads are restricted to the actual production domains and English content. Albanian is not currently supported by AdSense; bilingual referral cards still work.
6. Create a [Cloudflare Web Analytics site](https://developers.cloudflare.com/web-analytics/get-started/) and set its public 32-character token. Use **manual installation** and turn off any automatic Pages/zone beacon injection for this site: the app installs one beacon and enables the default SPA navigation measurement.

| Repository variable | Value / behavior |
| --- | --- |
| `VITE_ADS_ENABLED` | `true` enables configured manual placements; otherwise off |
| `VITE_ADS_CMP_PUBLISHED` | `true` confirms the Google message is published; otherwise ads stay off |
| `VITE_AD_SLOT_HOME` | Ten-digit responsive display slot ID |
| `VITE_AD_SLOT_CONTENT` | Ten-digit responsive display slot ID |
| `VITE_AD_SLOT_ARTICLE_END` | Ten-digit responsive display slot ID |
| `VITE_RENTAL_URL` | Approved, complete Albania affiliate URL |
| `VITE_RENTAL_URL_CALCULATOR` | Optional calculator campaign URL |
| `VITE_RENTAL_URL_GUIDE` | Optional rental-guide campaign URL |
| `VITE_RENTAL_URL_ROAD_TRIP` | Optional road-trip-guide campaign URL |
| `VITE_RENTAL_URL_ALBANIA` | Optional Albania price-page campaign URL |
| `VITE_CF_ANALYTICS_TOKEN` | Public Cloudflare Web Analytics site token |

The workflow sets `VITE_DEPLOY_ENV=production`. Other build pipelines must set that explicitly for live activation. Copy `.env.example` to `.env.local` for local values. Localhost and preview domains never request live ads or analytics, even with production flags. Affiliate links are ordinary links; avoid clicking configured production links during repeated testing.

## What the integration does

- Loads Google's script once, then waits for `CONSENT_DATA_READY` and script readiness before initializing visible manual units. This callback means choices are available, **not that the visitor consented**; Google applies the actual consent signals and determines eligible ad types. The code does not fabricate consent or override refusal.
- Provides Google's `showRevocationMessage()` control in the footer. When unavailable, shows an explanation and a privacy-policy link. Ads can be absent when the user blocks scripts; the tools still work.
- Uses one homepage placement after the primary price content, and no more than two units on long eligible pages. No ad units on games, policy pages, station controls, errors or unsupported-language views. Country pages require actual price content.
- Reserves space and initializes each DOM slot once. Editing trip inputs does not refresh an ad. Unfilled or blocked slots retain their reserved area to prevent content jumping.
- Labels referral cards, preserves the supplied URL and uses `rel="sponsored noopener"`. Missing configuration renders no card. Referral links and disclosures are included in prerendered pages when configured.
- Uses country reference prices for each trip leg. A missing leg price suppresses the full cost instead of presenting a partial total as complete. ALL conversion is omitted when a usable rate is unavailable. A return trip doubles every leg. Shared URLs carry public inputs, not live location.

## Verify before enabling live earnings

```sh
npm ci
npm test
npm run build
npx playwright install chromium
npm run test:browser
npm run lint
```

Browser tests create a separate `.test-dist` build with fake IDs. All external requests are intercepted, including the production-host simulation; no real ads are requested. The default `dist` build and deployment do not receive test configuration. Tests cover calculations, failure states, sharing, the English-only release gate, consent-ready/decline signals, repeat navigation, ad blocking, unfilled units, narrow and wide layouts, and HTML without JavaScript. Unit/render tests check matching Albanian content structure and actual translated output. Screenshots are in `test-results/`.

Private Albanian HTML fixtures are built only in `.test-dist` for narrow/wide browser layout checks; they are never included in the production output and do not enable the public toggle.

The initial repository lint baseline has five existing errors in the map, watchlist and nearby-stations components. Monetization changes must add none.

After deployment, verify direct 200 responses and canonical URLs for `/trip-cost-calculator` and `/albania-car-rental-guide`, both sitemap entries, the price timestamp, and the footer's privacy control. Use Google's documented message-testing facilities to check applicable regions, consent, refusal and reopening. Confirm one analytics beacon and no Auto ads. Real account approval, eligible ad fill, affiliate credit and payouts require account-side verification; mocked tests cannot prove earnings.

Rollback: set `VITE_ADS_ENABLED=false`, clear the referral URLs or analytics token as needed, and rebuild with **Deploy web**. Public tools and guides remain available.

## First 30 days

Record the activation date and use the same date range in each dashboard:

| Metric | Source | Action |
| --- | --- | --- |
| Search impressions, clicks and landing-page queries | Google Search Console | Submit `/sitemap.xml`; inspect both new URLs. Improve their titles and content using actual queries. |
| Visits, page views, referrers, countries and page performance | Cloudflare Web Analytics | Check that new traffic reaches the calculator and guide and that performance remains usable. |
| Ad earnings, page RPM, coverage and Active View | AdSense | Compare the named placements. Investigate unfilled inventory before adding more ads. |
| Referral clicks, completed rentals, confirmed commissions | DiscoverCars dashboard | Compare configured campaign links and allow for future rental dates and cancellations. |
| Revenue per 1,000 visits | `(ad earnings + confirmed affiliate commissions) / visits × 1000` | Convert currencies consistently and disclose the reporting lag. |

Establish a baseline in week one; check broken links, indexing and configuration weekly. At day 30, improve the two existing landing pages before adding destinations. Low traffic or a handful of bookings is insufficient evidence for an A/B winner. Track AdSense estimated earnings separately from finalized payouts, and booked rentals separately from confirmed commissions. These systems use different attribution windows, sampling and blocking, so counts will not reconcile exactly.

No paid acquisition is included. The direct partner's [terms](https://www.discovercars.com/affiliate-conditions) prohibit PPC and social-media-ad referrals. Organic search, useful internal links and voluntary trip sharing are the initial acquisition channels.

## Revenue model and sources

Ad earnings = page views / 1,000 × measured page RPM. Affiliate earnings = referred clicks × eligible completed-rental conversion rate × average commission. A scenario with 10,000 monthly visits, 1.5 pages/visit, $5 RPM, 5% referral click-through, 3% completed-rental conversion and $20 commission yields $75 ads + $300 referrals. These are assumptions for planning, not a forecast. DiscoverCars advertises an average commission near $20; actual account terms and completed bookings determine earnings.

References checked 9 September 2026:

- [DiscoverCars affiliate program](https://www.discovercars.com/affiliate) and [terms](https://www.discovercars.com/affiliate-conditions)
- [AdSense page RPM](https://support.google.com/adsense/answer/112030?hl=en), [placement policy](https://support.google.com/adsense/answer/1346295?hl=en), and [supported languages](https://support.google.com/adsense/answer/9727?hl=en)
- [Google CMP requirements](https://support.google.com/adsense/answer/13554116?hl=en) and [Privacy & messaging API](https://developers.google.com/funding-choices/fc-api-docs)
- [Cloudflare SPA analytics](https://developers.cloudflare.com/web-analytics/get-started/web-analytics-spa/)
- [Google helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
