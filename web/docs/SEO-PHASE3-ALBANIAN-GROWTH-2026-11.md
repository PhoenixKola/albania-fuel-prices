# Phase 3 — Albanian search pilot

Research and implementation: **15 November 2026**, Europe/Berlin. Branch `main`; starting checkout and synchronized remote `fffe8fa`. Implementation commit: **`2478683cb0943734aa6bbb105fe2ce1431e3a740`**, pushed normally to `origin/main`. A documentation-only follow-up records this verification; the final handoff identifies that follow-up commit.

## Evidence and decision

The owner-supplied GSC baseline is 16 October–12 November 2026: 164 clicks, 10,841 impressions, 1.51% CTR, position 7.6. Homepage: 91 clicks; English Albania: 3/627 impressions; Kosovo: 39/1,557. Albania and Kosovo users supplied 116 clicks. These are supplied aggregate/page figures, not independently downloaded account data. The visible query export is incomplete because of anonymization; its 860 rows cannot explain every sitewide click. No search-volume or ranking forecast was inferred.

Selective searches on **2026-11-15** included `çmimi i naftës sot në Shqipëri`, `çmimi i benzinës`, `çmimi i gazit`, and ministry/customs searches for November Board decisions. Results indicate demand for a direct fuel-specific answer, lek units, dates, and a distinction between reference values and ceiling decisions. This is qualitative intent research, not a full Google rank audit or page-filtered GSC analysis.

Pages actually opened on that date:

- [Digital Help fuel page](https://digitalhelp.al/cmimi-i-karburantit/): Albanian fuel labels, lek orientation and local FAQ; its fetched text also contained a loading-tool message. We wrote original source-dated content and render the usable answer without JS.
- [Polikum petrol](https://polikum.al/cmimet/karburanti/benzina) and [LPG](https://polikum.al/cmimet/karburanti/gazi): compact fuel-specific headings and dates, with separate reference/ceiling labels. Search snippets and fetched snapshots differed in dates, so no competitor number was treated as authoritative or copied.
- [Ministry homepage](https://financa.gov.al/) and [5 November decision page](https://financa.gov.al/newsroom/vendim-i-bordit-te-transparences-date-5-nentor-2026/); [Customs notices](https://www.dogana.gov.al/c/172/njoftime).
- [RTSH report](https://rtsh.al/bordi-i-transparences-ndryshon-cmimet-e-karburanteve-ulen-lehte-nafta-dhe-benzina/) was opened. A [later Panorama report](https://www.panorama.com.al/rritet-cmimi-i-naftes-ne-shqiperi-bordi-i-transparences-vendos-cmimet-e-reja-per-karburantet/) appeared in search as a ceiling-decision lead, but a direct open returned HTTP 403. The available official record did not prove the latest effective status against later November reporting. **No ceiling number or automatic ceiling feed shipped.**
- Existing [English Albania](https://karburantisot.com/fuel-prices/albania) and [Kosovo](https://karburantisot.com/fuel-prices/kosovo) output were inspected. Search retrievals can be cached; final direct requests are the deployment authority.

Google guidance read: [reciprocal localized URLs](https://developers.google.com/search/docs/specialty/international/localized-versions), [people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [titles](https://developers.google.com/search/docs/appearance/title-link), [snippets](https://developers.google.com/search/docs/appearance/snippet), [FAQ restrictions](https://developers.google.com/search/blog/2023/08/howto-faq-changes). The implementation uses self/reciprocal language links, actual translated body content and source honesty. FAQ markup is not a promise of rich results.

## Shipped scope

One new indexable URL: **`/sq/cmimet-e-karburanteve-ne-shqiperi`**, paired only with `/fuel-prices/albania`. No `/sq/` homepage, localized Kosovo page, additional languages or city/station price pages.

| Item | Before | After |
| --- | --- | --- |
| Albanian destination | Local-storage toggle on English URLs | Independent SQ URL, self-canonical and useful prerendered HTML |
| SQ title | No route-specific title | `Çmimet e karburanteve në Shqipëri \| Naftë, benzinë, gaz` |
| SQ H1 | No independent document | `Çmimet e karburanteve në Shqipëri` |
| SQ description | No independent description | Fuel labels, source-dated reference, EUR/L, 50 L and pump-price limit |
| Language | Indexed English shell | `html lang="sq"`; complete SQ body, status, date/number formatting, links, navigation/footer labels |
| Alternates | No genuine paired destination | EN and SQ each list themselves and the counterpart; no unrelated SQ alternates |
| English Albania | Generic first paragraph | Fuel-specific accepted diesel/petrol answer, date, pump caveat, visible SQ link; title/H1/self-canonical preserved |
| Kosovo | Intro inherited global source date | Short opening answer describes its independent publication/observation status; title/URL preserved |
| Sitemap | No localized route | SQ URL included; editorial lastmod 2026-11-15 or later accepted source date, never merely build time |

The new shared model/component (`src/config/localizedAlbania.ts`, `src/pages/AlbaniaSqPage.tsx`) feeds both React and prerendering. It reads accepted `data/latest.json`; no production price values were hardcoded or edited. The current publication is 2026-11-09. The initial client render uses the build snapshot until the normal live feed arrives. Language derives from the paired URL, overriding conflicting stored preferences there; the existing preference model remains on other routes. The paired toggle navigates to the real counterpart. Hreflang, canonical, OG/Twitter and schema are route-aware.

Price cards show EUR/L and `50 × EUR/L` with the same input precision. Converted ALL/L appears only with a plausible, dated rate no older than seven days; otherwise the missing conversion is explicit. The rate date is distinct from the fuel date and the conversion is never described as a pump observation. Verified dates require source provenance; collection-only readings remain observed/unverified. A reading older than three days visibly warns that it does not verify today's pump price. Fuel-specific Greece comparisons show dated petrol/diesel and 50 L differences only with traceable sources and usable dates; Kosovo's collection-only snapshot instead gets a clear explanation without a numerical comparison. Mismatched verified dates are disclosed. The shared component has no injected English history/analysis blocks.

The existing English titles/H1s/canonicals for the homepage and Albania/Kosovo are protected. No Greece/Italy title experiment shipped: their existing snippets already describe dated reference prices, and no page-filtered query evidence justified changing them in this pilot. Links point to Compare, Trip, Detour, listed Stations, methodology, Kosovo/Greece and the English counterpart, explaining each destination's actual capability.

Technical files: route configuration, `App` language selection, `RouteSeo`/`Seo`, country first-answer copy and discovery link, navigation/footer formatting, the shared localized component/model/styles, `scripts/prerender.ts`, `priceData.ts` (retain FX date), sitemap and SEO validator. Tests: localized model, static output/FAQ parity, reciprocal alternates, source-date guards, FX absence, language-switch and headless viewport smoke. No dependencies, mobile files, ingestion, historical values, ads/consent configuration, infrastructure or secrets changed.

## Checks and release

- TypeScript and standard production build, including generation, prerender, sitemap and SEO validator.
- 39 web unit tests; 15 required indexable routes validated, including the new SQ route, EN Albania, Kosovo and homepage.
- Focused lint on touched files.
- Headless browser: no-JS direct 200 and Albanian answer, desktop/mobile, both themes, URL language-switch round trip despite stored English, 200% text, keyboard link focus and runtime errors. Screenshots reviewed; this is not physical-device or screen-reader certification.
- Existing large-chunk build warning remains; no dependency was added. Generated build-timestamp-only differences are excluded from the commit.

Release status: implementation [Deploy web run 43701206722](https://github.com/PhoenixKola/albania-fuel-prices/actions/runs/43701206722) **succeeded**. Direct no-cache HTTP source requests on **2026-11-15** verified status 200, one H1 and the implementation build SHA on the [live Albanian URL](https://karburantisot.com/sq/cmimet-e-karburanteve-ne-shqiperi), English Albania, Kosovo and homepage. SQ is `lang="sq"`, with its self-canonical and reciprocal EN/SQ links; accepted diesel appears as `2,309 €` and its structured data parses with `inLanguage: "sq"`. English Albania retains its original title/H1/canonical and links back. Kosovo retains its title/URL and its own observation date; homepage title/H1/canonical are unchanged. The public sitemap includes the SQ URL. No EAS or Play action was run. This proves deployment, not Google indexing or search growth.

## Measurement and next decisions

Record the actual successful deployment date below. Compare the first **full 28 days after deployment** with the preceding 28 full days (exclude deployment day); if deployment is November 15, compare November 16–December 13 with October 18–November 14. Keep the owner-supplied October 16–November 12 export as a separate historical baseline, not a mismatched experiment control.

Use GSC URL Inspection/Indexing for the new URL, request indexing once if useful, and inspect Google-selected canonical. Track crawl/index state, time to first impressions, relevant query visibility, qualified clicks and CTR alongside impressions/position. Request **page-filtered Queries** for SQ Albania, EN Albania, Kosovo and Greece. Segment brand/non-brand, country and device; retain a documented brand regex such as `karburanti\s*sot|karburantisot|fuel\s*today`. Anonymized queries remain missing; visible query totals do not equal site totals. Check whether EN Albania/Kosovo lose traffic before attributing SQ gains to growth rather than redistribution. Sitewide CTR alone is not the success metric. No increase is claimed before measurement.

Defer further localized pages and Italian/German experiments until this complete pilot is indexed and query demand supports expansion. A future ceiling module requires a manual official-document review that records decision ID, publication/effective time, source URL, exact fuel definitions and a supersession search. If the latest effective decision cannot be established, do not publish a number; a reviewed historical record must explicitly say validity is unconfirmed and must never enter the Europe reference feed, alerts or calculators. Assign an owner before maintaining such a module.

Existing external needs remain: Android real-device notification/GPS testing and Play release, Worker availability, Road Reality authority review, upstream publication freshness and page-filtered GSC access. They were not expanded into this web release.
