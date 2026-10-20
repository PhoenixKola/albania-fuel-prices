import { loadEnv } from "vite";
import { readMonetizationConfig } from "../src/config/monetization";
import { travelStaticContent, travelStaticLinks } from "./travelPrerender";
import { buildRoadRealityPrerenderRoutes } from "./roadRealityPrerender";
/**
 * Prerender script: generates static HTML for all public routes after `vite build`.
 *
 * Approach:
 * - Reads the built dist/index.html as a template
 * - For each route, injects route-specific <head> metadata and static body content
 * - Writes to dist/<path>/index.html
 * - The React app hydrates/replaces on the client
 *
 * Run: node --loader ts-node/esm scripts/prerender.ts
 * Or:  npx tsx scripts/prerender.ts
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { COUNTRY_EDITORIAL } from "../src/config/countryContent";
import { countryPageContent } from "../src/config/countryPageContent";
import { countryMetaDescription } from "../src/config/countryMetaDescription";
import { compareCountries, comparisonSentence } from "../src/models/countryComparison";
import { calculateFuelDetour, DEFAULT_DETOUR } from "../src/models/fuelDetour";
import { fuelDetourCopy } from "../src/config/fuelDetourCopy";
import { STATIC_ROUTES as ROUTE_CONFIGS } from "../src/config/routes";
import { i18n } from "../src/locales";
import { getPublishedArticles } from "../src/config/articles";
import { getCountryAnalysis } from "../src/generated/countryAnalysis";
import { HOME_SUMMARY_HTML } from "../src/generated/homeSummary";
import { MARKET_REPORT_HTML } from "../src/generated/marketReport";
import { ANALYSIS_META } from "../src/generated/analysisMeta";
import { isCountryIndexable } from "../src/generated/indexableCountries";
import { editorialCopy, type EditorialTextSection } from "../src/config/editorialCopy";
import {
  loadPriceContext,
  renderCountryPriceSection,
  renderHomeSnapshot,
  renderRankingsTable,
  renderComparePairs,
  type PriceContext,
} from "./priceData";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../dist");
const SITE_URL = "https://karburantisot.com";

// ─── Route definitions with static content ─────────────────────────────────

type RouteEntry = {
  path: string;
  title: string;
  description: string | ((ctx: PriceContext) => string);
  jsonLdType: string;
  /** Real first-publish date of the page (from git history). */
  datePublished: string;
  /** Last meaningful editorial update; price-bearing pages use data as_of instead. */
  dateModified?: string;
  /** Content changes with the daily data refresh. */
  priceBearing?: boolean;
  /** Keep out of the index (and the sitemap) — used for pages we can't fill. */
  noindex?: boolean;
  content: string | ((ctx: PriceContext) => string); // visible HTML content for the page
};

/**
 * Builds page HTML from the same locale strings the React pages render, so the
 * prerendered version and the in-app version carry identical text. Previously
 * these guides were hand-summarised in this file and shipped roughly a quarter
 * of the words the app actually shows.
 */
function localeSections(
  title: string,
  intro: string,
  sections: { title: string; paragraphs: string[] }[],
  related: { label: string; to: string }[] = []
): string {
  const body = sections
    .map(
      (s) => `
        <section class="contentSection">
          <h2 class="contentHeading">${escapeHtml(s.title)}</h2>
          ${s.paragraphs.map((p) => `<p class="contentBody">${escapeHtml(p)}</p>`).join("\n          ")}
        </section>`
    )
    .join("");

  const relatedBlock = related.length
    ? `
        <section class="contentSection">
          <h2 class="contentHeading">Related reading</h2>
          <ul class="contentList">
            ${related.map((r) => `<li><a href="${r.to}">${escapeHtml(r.label)}</a></li>`).join("\n            ")}
          </ul>
        </section>`
    : "";

  return `
      <article class="contentPage">
        <h1 class="contentPageTitle">${escapeHtml(title)}</h1>
        <p class="contentBody">${escapeHtml(intro)}</p>
        ${body}
        ${relatedBlock}
      </article>
    `;
}

/**
 * Honest freshness notice. If the deployed build is running on stale data —
 * which is what happens when the daily rebuild stops firing — say so on the
 * page rather than presenting month-old numbers as "today".
 */
function freshnessNotice(): string {
  if (!ANALYSIS_META.stale) return "";
  return `
        <p class="staleNotice" role="status">The upstream source reading is dated ${ANALYSIS_META.asOf} (${ANALYSIS_META.dataAgeDays} days ago). A recent download does not make these prices current; check pump prices before travel.</p>`;
}

function renderEditorialSections(sections: EditorialTextSection[]): string {
  return sections.map((section, index) => `
        <section class="contentSection editorialSection" id="${escapeHtml(section.id)}">
          <p class="contentBodyMuted">${String(index + 1).padStart(2, "0")}</p>
          <h2 class="contentHeading">${escapeHtml(section.title)}</h2>
          ${section.paragraphs.map((paragraph) => `<p class="contentBody">${escapeHtml(paragraph)}</p>`).join("\n          ")}
          ${section.bullets?.length ? `<ul class="contentList">${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
        </section>`).join("");
}

function redesignedStaticContent(route: RouteEntry): RouteEntry {
  const copy = editorialCopy.en;
  if (route.path === "/about") {
    return { ...route, content: `
      <article class="contentPage aboutPage">
        <header class="aboutHero"><p class="aboutEyebrow">${escapeHtml(copy.about.eyebrow)}</p><h1>${escapeHtml(copy.about.title)}</h1><p class="aboutLede">${escapeHtml(copy.about.lede)}</p><p class="aboutStatus">${escapeHtml(copy.about.status)}</p><dl class="aboutFigures"><div><dt>${escapeHtml(copy.about.metrics[0])}</dt><dd>${ANALYSIS_META.countriesAnalysed}</dd><p>European markets</p></div><div><dt>${escapeHtml(copy.about.metrics[1])}</dt><dd>${ANALYSIS_META.daysObserved}</dd><p>consecutive days recorded</p></div><div><dt>${escapeHtml(copy.about.metrics[2])}</dt><dd>None</dd><p>over rankings or conclusions</p></div></dl></header>
        ${renderEditorialSections(copy.about.sections)}
      </article>` };
  }
  if (route.path === "/contact") {
    return { ...route, content: `
      <article class="contentPage contactPage">
        <header class="contactHero"><div class="contactHeroCopy"><p class="contactEyebrow">${escapeHtml(copy.contact.eyebrow)}</p><h1>${escapeHtml(copy.contact.title)}</h1><p class="contactLede">${escapeHtml(copy.contact.lede)}</p></div><div class="contactCard"><span class="contactCardLabel">Write to us directly</span><a class="contactEmail" href="mailto:fenixkola@gmail.com">fenixkola@gmail.com</a><a class="contactMailButton" href="mailto:fenixkola@gmail.com?subject=Karburanti%20Sot%20enquiry">${escapeHtml(copy.contact.emailAction)}</a></div></header>
        ${renderEditorialSections(copy.contact.sections)}
      </article>` };
  }
  const policyKey = route.path === "/privacy" ? "privacy" : route.path === "/terms" ? "terms" : route.path === "/editorial-policy" ? "editorial" : route.path === "/disclaimer" ? "disclaimer" : null;
  if (policyKey) {
    const document = copy.policies[policyKey];
    return { ...route, content: `
      <article class="contentPage editorialExperience editorialExperience-dossier">
        <header class="contentHero editorialHero"><p class="contentHeroBadge">${escapeHtml(document.eyebrow)}</p><h1 class="contentHeroTitle">${escapeHtml(document.title)}</h1><p class="contentHeroText">${escapeHtml(document.lede)}</p><p class="contentBodyMuted">${escapeHtml(document.updated)}</p><div class="verdictBox"><strong>${escapeHtml(document.calloutLabel)}</strong><p class="contentBody">${escapeHtml(document.callout)}</p></div></header>
        ${renderEditorialSections(document.sections)}
      </article>` };
  }
  return route;
}

const revenueConfig = readMonetizationConfig({ ...loadEnv("production", resolve(__dirname, ".."), "VITE_"), ...process.env });
function fuelDetourStaticContent(ctx: PriceContext): string {
  const c = fuelDetourCopy.en;
  const result = calculateFuelDetour(DEFAULT_DETOUR, ctx.latest);
  const money = (value: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR" }).format(value);
  const decimal = (value: number) => new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }).format(value);
  const dates = result?.comparison.sourceDateA === result?.comparison.sourceDateB
    ? result?.comparison.sourceDateA : `${result?.comparison.sourceDateA ?? "?"} / ${result?.comparison.sourceDateB ?? "?"}`;
  return `<main class="contentPage detourPage">
    <header class="detourHero"><p class="travelEyebrow">${escapeHtml(c.eyebrow)}</p><h1>${escapeHtml(c.title)}</h1><p>${escapeHtml(c.lede)}</p></header>
    <p class="contentBody">Example: ${DEFAULT_DETOUR.litres} L of ${c.diesel} in ${c.Greece} versus ${c.Albania}, with ${DEFAULT_DETOUR.extraKm} extra km at ${DEFAULT_DETOUR.consumption} L/100 km. Enable JavaScript to change these inputs or restore a shared calculation.</p>
    <section class="contentSection" aria-label="${escapeHtml(c.calculate)}"><h2>${escapeHtml(c.calculate)}</h2>
    ${result ? `<p class="contentBody"><strong>${escapeHtml(c.net)}: ${money(result.netDifference)}</strong>. ${escapeHtml(result.netDifference > 0.005 ? c.positive : result.netDifference < -0.005 ? c.negative : c.equal)}.</p>
      <dl><div><dt>${escapeHtml(c.gross)}</dt><dd>${money(result.grossDifference)}</dd></div><div><dt>${escapeHtml(c.extraLitres)}</dt><dd>${decimal(result.extraLitres)} L</dd></div><div><dt>${escapeHtml(c.extraCost)}</dt><dd>${money(result.extraFuelCost)}</dd></div></dl>
      <p class="contentBody">${escapeHtml(c.date)}: ${escapeHtml(dates ?? "?")}. ${c.Albania}: ${money(result.comparison.priceA)}/L; ${c.Greece}: ${money(result.comparison.priceB)}/L.</p>
      ${result.comparison.stale ? `<p class="staleNotice">${escapeHtml(c.stale)}</p>` : ""}
      ${result.comparison.provisional ? `<p class="staleNotice">${escapeHtml(c.unverified)}</p>` : ""}` : `<p class="contentBody">${escapeHtml(ctx.latest ? c.unavailable : c.noData)}</p>`}
    </section>
    <section class="contentSection"><h2>${escapeHtml(c.methodTitle)}</h2><p class="contentBody">${escapeHtml(c.method)}</p><h2>${escapeHtml(c.limitsTitle)}</h2><p class="contentBody">${escapeHtml(c.limits)}</p><p class="contentBody">${escapeHtml(c.source)}: ${ctx.sourceUrl ? `<a href="${escapeHtml(ctx.sourceUrl)}" rel="noopener noreferrer">${escapeHtml(ctx.source)}</a>` : `<a href="/methodology">${escapeHtml(c.methodology)}</a>`}</p></section>
    <nav aria-label="Related tools"><a href="/compare">${escapeHtml(c.compare)}</a> · <a href="/trip-cost-calculator">${escapeHtml(c.trip)}</a> · <a href="/methodology">${escapeHtml(c.methodology)}</a></nav>
  </main>`;
}
const STATIC_ROUTES: RouteEntry[] = [
  ...ROUTE_CONFIGS.filter((route) => ["/trip-cost-calculator", "/albania-car-rental-guide"].includes(route.path)).map((route): RouteEntry => ({
    path: route.path, title: route.title, description: route.description, jsonLdType: route.jsonLdType,
    priceBearing: true, datePublished: "2026-09-09", dateModified: "2026-09-09",
    content: (ctx) => travelStaticContent(route.path, ctx, revenueConfig),
  })),
  {
    path: "/fuel-detour-calculator",
    title: "Fuel Detour Calculator | Extra Driving vs Price Gap | Fuel Today",
    description: "Compare dated Albania, Greece or Kosovo fuel reference prices, then subtract fuel used by a user-entered detour. See the fuel-only difference and source-date caveats.",
    jsonLdType: "WebPage", datePublished: "2026-10-20", priceBearing: true,
    content: fuelDetourStaticContent,
  },
  {
    path: "/",
    title: "Fuel Prices Today in Albania & Europe | Petrol, Diesel & LPG",
    description: "Check source-dated petrol, diesel and LPG reference prices in Albania and Europe. Compare countries, find stations and estimate a trip's fuel cost.",
    jsonLdType: "WebSite",
    datePublished: "2026-02-14",
    priceBearing: true,
    content: (ctx) => `
      <header class="contentHero" aria-labelledby="prerender-home-title">
        <p class="contentHeroBadge">Albania / Europe fuel prices</p>
        <h1 id="prerender-home-title" class="contentHeroTitle">Know the fuel cost before the road starts.</h1>
        <p class="contentHeroText">Check dated national reference prices for petrol, diesel and LPG, compare Albania with Europe, and turn the numbers into a practical trip budget.</p>
        <nav class="contentHeroActions" aria-label="Homepage tools">
          <a class="heroCta heroCtaPrimary" href="/trip-cost-calculator">Calculate a trip</a>
          <a class="heroCta heroCtaSecondary" href="/stations">Find fuel nearby</a>
        </nav>
        <nav class="contentHeroLinks" aria-label="Popular fuel tools">
          <a href="#price-tool">Albania fuel prices</a>
          <a href="/compare">Compare countries</a>
          <a href="/rankings">Europe rankings</a>
        </nav>
        <p class="heroTrustRow">Country-level reference values · Individual pump prices vary · Source and date shown with every reading</p>
      </header>
      <article class="contentPage">
        ${freshnessNotice()}
        <section class="contentSection" id="price-tool">
          <h2 class="contentHeading">One market. Three fuel prices.</h2>
          <p class="contentBody">Inspect the dated petrol, diesel, and LPG national reference values, then compare the selected market with the European range and recent movement.</p>
        </section>
        ${renderHomeSnapshot(ctx)}
        ${HOME_SUMMARY_HTML.en}
        <section class="contentSection">
          <h2 class="contentHeading">One market. Every signal.</h2>
          <p class="contentBody">Fuel Today (Karburanti Sot) is an independent fuel price comparison website for Albania and Europe. It collects public country-level fuel price data, converts it into a consistent EUR-per-litre format, and presents dated reference values for trip planning. The readings do not predict future prices or identify the cheapest pump.</p>
          <p class="contentBody">The site tracks petrol (gasoline 95), diesel, and LPG across 33 European markets, with dedicated pages for Albania, Kosovo, Greece, Italy, Croatia, Portugal, Switzerland, and the United Kingdom. We check public fuel price sources regularly and show their publication date; a new fetch does not mean a new price reading. Where our source publishes no prices for a country, we say so rather than estimating.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">How to interpret country-level prices</h2>
          <p class="contentBody">Country-level fuel prices represent broad reference values from available datasets. They are useful for comparison and planning, but individual station prices can vary based on competition, location, brand, and delivery timing. Use the numbers for trend and spread analysis, then validate your exact station before buying fuel.</p>
          <p class="contentBody">For Albania specifically, the displayed price is most representative of major-city stations. Rural and highway stations may differ by 2-8 ALL/L. The EUR conversion uses mid-market exchange rates from a public FX source.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Albania and Balkan context</h2>
          <p class="contentBody">For routes from Albania toward Kosovo, Montenegro and Greece, compare the same fuel in each market before estimating your costs. Petrol and diesel may point in opposite directions, and a country-level price gap does not guarantee a saving at a particular station. The <a href="/compare">comparison page</a> uses the dated source snapshot; the <a href="/insights/cross-border-fill-up-math">cross-border example</a> explains a 50 L difference and its limits.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Drive with context</h2>
          <ul class="contentList">
            <li><a href="/methodology">Methodology</a> — how data is collected and processed</li>
            <li><a href="/europe-fuel-comparison">Europe fuel comparison</a> — why prices vary across the continent</li>
            <li><a href="/road-trip-fuel-guide">Road trip fuel guide</a> — estimate costs for specific routes</li>
            <li><a href="/rankings">Rankings</a> — which countries are cheapest and most expensive</li>
            <li><a href="/compare">Compare</a> — build a country watchlist for quick checks</li>
          </ul>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Data source attribution</h2>
          <p class="contentBody">Fuel price data is sourced from publicly available European fuel price aggregators. Exchange rates come from a public FX API. All values are informational references — not guaranteed station prices. Our <a href="/methodology">methodology page</a> documents the full pipeline: which sources we use, how values are normalised, and exactly how every derived figure on this site is calculated.</p>
        </section>
      </article>
    `,
  },
  {
    path: "/stations",
    title: "Fuel Stations Near Me | Map, Distance & Opening Hours",
    description: "Find mapped fuel stations nearby, approximate straight-line distance and available listed opening hours. Station-level pump prices are not provided.",
    jsonLdType: "WebPage",
    datePublished: "2026-04-01",
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">Fuel stations near me</h1>
        <p class="contentBody">Find mapped fuel stations near your current location using geolocation and OpenStreetMap data. Results include approximate distance and opening hours where available, but not current station-level pump prices.</p>
        <section class="contentSection">
          <h2 class="contentHeading">How this page works</h2>
          <p class="contentBody">The nearby stations feature uses your device's geolocation (if you grant permission) to find fuel stations within a chosen radius (2 km, 5 km, or 10 km). Results show station names, approximate distances, and opening hours when available.</p>
          <p class="contentBody">This page does not show real-time pump prices for each station. Use the station finder as a location tool and the dated country-level references as a budgeting starting point.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Why station prices differ from national averages</h2>
          <p class="contentBody">National average fuel prices are useful as a market-level reference, but the price at any individual pump depends on local factors: independent stations may price more aggressively than branded chains, city-centre locations often charge a premium due to higher property costs, and motorway stations are frequently the most expensive due to captive demand.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Privacy and location</h2>
          <p class="contentBody">When you choose to search nearby, your browser sends coordinates to the station lookup service, which may query OpenStreetMap/Overpass. We do not use your location for advertising or to build a location history. If you deny permission, the rest of the site remains available.</p>
        </section>
      </article>
    `,
  },
  {
    path: "/compare",
    title: "Compare Fuel Prices Across Countries | Fuel Today",
    description: "Select countries and fuel type to compare dated petrol, diesel and LPG reference prices across Europe. See EUR/L differences; individual pump prices vary.",
    jsonLdType: "WebPage",
    datePublished: "2026-04-01",
    priceBearing: true,
    content: (ctx) => `
      <article class="contentPage">
        <h1 class="contentPageTitle">Compare Fuel Prices</h1>
        <p class="contentBody">Choose countries and a fuel type to compare source-dated national reference prices. Each market can have a different publication date; no individual pump prices are shown.</p>
        ${renderComparePairs(ctx)}
        <section class="contentSection">
          <h2 class="contentHeading">How to use country comparisons effectively</h2>
          <p class="contentBody">Compare the same fuel in EUR/L, check the market dates, then use actual station prices and route costs for a trip decision. A national price gap alone does not prove a detour saves money.</p>
          <p class="contentBody"><a href="/fuel-detour-calculator">Account for the extra fuel used by a detour</a> with your own distance and consumption.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Practical comparison examples</h2>
          ${["Kosovo", "Greece", "Italy", "Montenegro"].map((country) => `<p class="contentBody"><strong>${country} diesel:</strong> ${escapeHtml(comparisonSentence(compareCountries(ctx.latest, country, "Albania", "diesel"), country, "Albania", "diesel"))}</p>`).join("")}
        </section>
      </article>
    `,
  },
  {
    path: "/rankings",
    title: "Europe Fuel Price Rankings | Fuel Today",
    description: "Explore Europe fuel price rankings by fuel type and understand where Albania sits relative to nearby and western European markets.",
    jsonLdType: "WebPage",
    datePublished: "2026-04-01",
    priceBearing: true,
    content: (ctx) => `
      <article class="contentPage">
        <h1 class="contentPageTitle">Europe Fuel Price Rankings</h1>
        <p class="contentBody">See which European countries have the cheapest and most expensive fuel prices for petrol, diesel, and LPG. Understand how tax policy, subsidies, and exchange rates create the ranking positions you see.</p>
        ${renderRankingsTable(ctx)}
        <section class="contentSection">
          <h2 class="contentHeading">Understanding fuel price rankings</h2>
          <p class="contentBody">European fuel prices span a wide range. At the top you'll find countries with high excise duties (Netherlands, Finland, Italy), while at the bottom you'll find countries with lower taxation or subsidies (Kosovo, Poland, Bulgaria). Tax is the single biggest factor in cross-country differences.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">How rankings are calculated</h2>
          <p class="contentBody">Rankings sort all covered countries by their reported fuel price for the selected fuel type (petrol, diesel, or LPG) in EUR per liter. For non-eurozone countries, prices are converted using mid-market exchange rates. Lower EUR/L price = higher rank (cheaper).</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Why rankings change</h2>
          <p class="contentBody">Rankings shift due to crude oil price changes, government interventions (subsidies, excise adjustments), exchange-rate movements for non-Euro countries, and seasonal demand patterns. A country that introduces a temporary subsidy may jump several positions lower, only to return when the subsidy expires.</p>
        </section>
      </article>
    `,
  },
  {
    path: "/about",
    title: "About Fuel Today (Karburanti Sot)",
    description: "Learn why Fuel Today exists, who maintains it, data principles, editorial approach, and how corrections are handled for Albania and European fuel prices.",
    jsonLdType: "WebPage",
    datePublished: "2026-03-31",
    dateModified: "2026-07-10",
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">About Karburanti Sot</h1>
        <p class="contentBody">Karburanti Sot is an independent fuel price information service that collects, compares, and explains public fuel pricing data across Albania and the wider European region. The project was started to give drivers, commuters, and cross-border travelers a straightforward way to compare fuel costs without needing to visit many separate sources.</p>
        <section class="contentSection">
          <h2 class="contentHeading">Our mission</h2>
          <p class="contentBody">Fuel prices vary significantly from country to country in Europe, sometimes by more than 50 percent. Those differences matter for household budgets, road-trip plans, and cross-border commuting decisions. Karburanti Sot brings fragmented price information together in one place with editorial context.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Who maintains this project</h2>
          <p class="contentBody">Karburanti Sot is built and maintained by a small independent team based in Tirana, Albania. The project is not affiliated with any fuel company, government agency, or advertising network. The site is funded through advertising, which allows it to remain free for all users.</p>
          <p class="contentBody">Unlike most price-comparison sites, we document exactly how our numbers are produced. Our <a href="/methodology">methodology page</a> sets out every source we use, how values are normalised and converted, how our daily historical record is built, and precisely how each derived figure — ranges, percentiles, volatility — is calculated. Where we cannot stand behind a number, we say so rather than publishing it. Questions and corrections reach the team directly at <a href="mailto:fenixkola@gmail.com">fenixkola@gmail.com</a>.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Data principles</h2>
          <p class="contentBody">Accuracy first: data from established public aggregators, no manual adjustments. Transparency: every page explains sources and limitations. Original commentary: editorial text written in-house. Clear limitations: prices are references, not guarantees.</p>
        </section>
      </article>
    `,
  },
  {
    path: "/contact",
    title: "Contact Fuel Today",
    description: "Contact Fuel Today for data corrections, partnerships, or website feedback related to Albania and European fuel price comparisons.",
    jsonLdType: "ContactPage",
    datePublished: "2026-03-31",
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">Contact Us</h1>
        <p class="contentBody">Whether you have a question about the data, want to report an inaccuracy, or have a suggestion for improving the site, we welcome your message.</p>
        <section class="contentSection">
          <h2 class="contentHeading">Email</h2>
          <p class="contentBody"><a href="mailto:fenixkola@gmail.com">fenixkola@gmail.com</a></p>
          <p class="contentBody">This is the best way to reach us for data corrections, feedback, or general inquiries. Please include as much detail as possible.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">What to include in a correction request</h2>
          <p class="contentBody">Country and fuel type, the value shown on our site, the value you believe is correct, a source link, and the date you observed the discrepancy.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Response expectations</h2>
          <p class="contentBody">We aim to respond within 2–3 business days. Data correction requests are prioritized — if a displayed price is clearly wrong, we investigate within 24 hours.</p>
        </section>
      </article>
    `,
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Fuel Today",
    description: "Read the Fuel Today privacy policy, including data usage, local storage behavior, advertising disclosures, and contact details.",
    jsonLdType: "WebPage",
    datePublished: "2026-03-31",
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">Privacy Policy</h1>
        <p class="contentBody">This Privacy Policy describes how Karburanti Sot handles information when you use our website and mobile applications. We are committed to transparency about what data we collect and how it is used.</p>
        <section class="contentSection">
          <h2 class="contentHeading">What data we collect</h2>
          <p class="contentBody">We do not ask for or collect personal information such as your name, email address, phone number, or precise location. The Service works without requiring you to create an account or log in.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Advertising</h2>
          <p class="contentBody">Karburanti Sot may display advertising through Adsterra when site advertising is enabled and you have explicitly allowed optional advertising. Third-party advertising resources are not loaded before that choice. You can change the preference at any time through Privacy &amp; cookies in the footer.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Contact</h2>
          <p class="contentBody">If you have questions about this Privacy Policy, contact us at fenixkola@gmail.com.</p>
        </section>
      </article>
    `,
  },
  {
    path: "/terms",
    title: "Terms of Use | Fuel Today",
    description: "Review Fuel Today terms of use, informational data limitations, acceptable usage, and liability boundaries for fuel price guidance.",
    jsonLdType: "WebPage",
    datePublished: "2026-03-31",
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">Terms of Use</h1>
        <p class="contentBody">By accessing and using Karburanti Sot, you agree to be bound by these Terms of Use.</p>
        <section class="contentSection">
          <h2 class="contentHeading">Description of the Service</h2>
          <p class="contentBody">Karburanti Sot is a free, publicly accessible fuel price comparison service. It collects public fuel price data from third-party sources, converts it into a consistent format, and presents it with editorial context.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Data accuracy and limitations</h2>
          <p class="contentBody">Fuel prices displayed are sourced from publicly available datasets. We cannot guarantee exact pump prices at any specific station. Country-level figures represent broad reference values from available datasets.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Limitation of liability</h2>
          <p class="contentBody">The Service is provided "as is" without warranties. To the fullest extent permitted by law, Karburanti Sot shall not be liable for damages arising from use of the Service or reliance on any information provided.</p>
        </section>
      </article>
    `,
  },
  {
    path: "/editorial-policy",
    title: "Editorial Policy | Fuel Today",
    description: "How Fuel Today selects, produces and maintains its content: data sourcing standards, editorial independence, accuracy principles and corrections.",
    jsonLdType: "WebPage",
    datePublished: "2026-06-05",
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">Editorial Policy</h1>
        <p class="contentBody">Karburanti Sot publishes fuel price data and editorial context to help drivers, commuters, and travelers make informed decisions. This page explains how we select, produce, and maintain that content.</p>
        <section class="contentSection">
          <h2 class="contentHeading">Our editorial mission</h2>
          <p class="contentBody">Our goal is to present publicly available fuel price data accurately, transparently, and in a practically useful form. Every editorial comment is derived directly from the underlying data and publicly available market knowledge — not from commercial arrangements with fuel companies or advertisers.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Data sourcing standards</h2>
          <p class="contentBody">All fuel price data comes from publicly available third-party sources. We do not accept sponsored data feeds. Exchange-rate conversions use a public FX API and are labeled clearly as estimates.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Editorial independence</h2>
          <p class="contentBody">Karburanti Sot is funded through display advertising. Advertising revenue does not influence which countries are covered or what editorial commentary is written. We do not accept paid placements or sponsored articles.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Accuracy and corrections</h2>
          <p class="contentBody">We present country-level prices as public reference values, not guarantees of the exact price at any station. If you identify an error, contact us at fenixkola@gmail.com with the country, page, value shown, and your source. We verify and correct promptly.</p>
        </section>
      </article>
    `,
  },
  {
    path: "/disclaimer",
    title: "Disclaimer | Fuel Today",
    description: "Read the Fuel Today disclaimer: fuel price data is informational only, trip estimates are approximate, and no financial advice is provided.",
    jsonLdType: "WebPage",
    datePublished: "2026-06-05",
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">Disclaimer</h1>
        <p class="contentBody">The information on Karburanti Sot is provided for general informational and reference purposes only. By using this website, you acknowledge the limitations described here.</p>
        <section class="contentSection">
          <h2 class="contentHeading">Fuel price data is informational only</h2>
          <p class="contentBody">Prices displayed are country-level reference values from public datasets. They do not represent the exact price at any specific station. Local competition, brand pricing, promotions, and wholesale delivery timing can all cause station prices to differ from the displayed figures.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">No financial or commercial advice</h2>
          <p class="contentBody">Nothing on this website constitutes financial advice. Exchange-rate conversions are indicative estimates only. Trip cost calculations are approximations for planning purposes — actual fuel costs will vary.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Limitation of liability</h2>
          <p class="contentBody">To the fullest extent permitted by law, Karburanti Sot shall not be liable for any loss or damage arising from reliance on information on this site, decisions made about refueling or travel planning, or any inaccuracy in the data displayed.</p>
        </section>
      </article>
    `,
  },
  {
    path: "/methodology",
    title: "Methodology | How Fuel Today Collects and Updates Data",
    description: "Review data sources, update frequency, fuel definitions, and limitations behind Fuel Today's Albania and Europe fuel price comparison data.",
    jsonLdType: "Article",
    datePublished: "2026-04-12",
    dateModified: "2026-07-10",
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">Methodology: How Karburanti Sot Collects and Presents Fuel Price Data</h1>
        <p class="contentBody">Transparency about how data is collected, processed, and displayed is essential for any site that helps people make real-world decisions based on numbers. This page explains every step of the data pipeline.</p>
        <section class="contentSection">
          <h2 class="contentHeading">Data sources</h2>
          <p class="contentBody">Karburanti Sot pulls fuel price data from publicly available third-party fuel price sources. These sources publish data at different intervals depending on each publisher's reporting schedule.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Data processing</h2>
          <p class="contentBody">Raw data is normalized into a consistent format: fuel prices expressed per liter with EUR as the common reference currency. No manual adjustments or editorial rounding are applied to the underlying price values.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">How we build our historical record</h2>
          <p class="contentBody">Since ${ANALYSIS_META.startLabel || "February 2026"}, the site has collected public source readings into its own history. Older collection-day records did not always verify the upstream publication date; repeated values may therefore appear across days. The current snapshot separates its source date from the time our job fetched it. We calculate ranges and trends from the collected record with these limits in mind.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">How the analysis is calculated</h2>
          <p class="contentBody">Every derived figure on this site is computed from that history file at build time. None of it comes from the upstream source.</p>
          <ul class="contentList">
            <li><strong>Period low, high and average</strong> — the minimum, maximum and arithmetic mean of all daily readings we hold for that country and fuel, with the dates on which the extremes occurred.</li>
            <li><strong>Observations below (percentile)</strong> — the share of collected readings strictly cheaper than the last recorded value. Equal readings are not counted as lower.</li>
            <li><strong>Volatility</strong> — the standard deviation of day-to-day percentage price changes across the full record. Higher values mean a market that reprices frequently and unpredictably.</li>
            <li><strong>30/90-observation change</strong> — the percentage difference between the last recorded price and earlier collected readings.</li>
            <li><strong>Historical position</strong> — a description of where the last reading sits in our collected range, not a price forecast or refuelling recommendation.</li>
            <li><strong>Cross-border spread history</strong> — the daily difference between two countries' prices, tracked over time.</li>
          </ul>
          <p class="contentBody">Statistics are only produced once we hold at least 30 daily readings for a country and fuel; below that threshold we show nothing rather than something unreliable. Countries absent from the upstream feed are excluded from search indexing rather than padded with placeholder content.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Exchange rate conversions</h2>
          <p class="contentBody">When comparing prices across different currencies, mid-market indicative rates from a public FX API are used. These are close approximations, not guaranteed conversion values.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Accuracy and limitations</h2>
          <p class="contentBody">Country-level prices represent broad reference values. They do not reflect exact pump prices at any specific station. Local competition, brand markups, promotions, and delivery timing all cause variation.</p>
        </section>
      </article>
    `,
  },
  {
    path: "/how-fuel-prices-work",
    title: "How Fuel Prices Work in Albania and Europe | Fuel Today",
    description: "Understand how crude oil, refining, taxes, transport, FX rates, and local demand shape petrol, diesel, and LPG prices across the Balkans and Europe.",
    jsonLdType: "Article",
    datePublished: "2026-04-12",
    content: localeSections(
      i18n.en.howPricesTitle,
      i18n.en.howPricesIntro,
      [
        { title: i18n.en.howPricesCrudeTitle, paragraphs: [i18n.en.howPricesCrudeP1, i18n.en.howPricesCrudeP2] },
        { title: i18n.en.howPricesRefiningTitle, paragraphs: [i18n.en.howPricesRefiningP1, i18n.en.howPricesRefiningP2] },
        { title: i18n.en.howPricesDistributionTitle, paragraphs: [i18n.en.howPricesDistributionP1, i18n.en.howPricesDistributionP2] },
        { title: i18n.en.howPricesTaxTitle, paragraphs: [i18n.en.howPricesTaxP1, i18n.en.howPricesTaxP2, i18n.en.howPricesTaxP3] },
        { title: i18n.en.howPricesRetailTitle, paragraphs: [i18n.en.howPricesRetailP1, i18n.en.howPricesRetailP2] },
        { title: i18n.en.howPricesSeasonalTitle, paragraphs: [i18n.en.howPricesSeasonalP1, i18n.en.howPricesSeasonalP2] },
        { title: i18n.en.howPricesSummaryTitle, paragraphs: [i18n.en.howPricesSummaryP1] },
      ],
      [
        { label: "Europe fuel comparison", to: "/europe-fuel-comparison" },
        { label: "Daily market report", to: "/market-report" },
        { label: "Methodology", to: "/methodology" },
      ]
    ),
  },
  {
    path: "/europe-fuel-comparison",
    title: "Europe Fuel Comparison with Albania | Fuel Today",
    description: "Compare Albania's fuel prices with Kosovo, Greece, Italy, Croatia, Portugal, Switzerland and the United Kingdom, and see why European prices differ.",
    jsonLdType: "Article",
    datePublished: "2026-04-12",
    content: localeSections(
      i18n.en.europeCompTitle,
      i18n.en.europeCompIntro,
      [
        { title: i18n.en.europeCompWhyTitle, paragraphs: [i18n.en.europeCompWhyP1, i18n.en.europeCompWhyP2] },
        { title: i18n.en.europeCompRegionsTitle, paragraphs: [i18n.en.europeCompRegionsP1, i18n.en.europeCompRegionsP2, i18n.en.europeCompRegionsP3, i18n.en.europeCompRegionsP4] },
        { title: i18n.en.europeCompDieselVsPetrolTitle, paragraphs: [i18n.en.europeCompDieselVsPetrolP1, i18n.en.europeCompDieselVsPetrolP2] },
        { title: i18n.en.europeCompLpgTitle, paragraphs: [i18n.en.europeCompLpgP1] },
        { title: i18n.en.europeCompExchangeTitle, paragraphs: [i18n.en.europeCompExchangeP1] },
        { title: i18n.en.europeCompBorderTitle, paragraphs: [i18n.en.europeCompBorderP1, i18n.en.europeCompBorderP2] },
        { title: i18n.en.europeCompSummaryTitle, paragraphs: [i18n.en.europeCompSummaryP1] },
      ],
      [
        { label: "Europe fuel price rankings", to: "/rankings" },
        { label: "How fuel prices work", to: "/how-fuel-prices-work" },
        { label: "Six months of Balkan fuel prices", to: "/insights/six-months-of-balkan-fuel-prices" },
      ]
    ),
  },
  {
    path: "/road-trip-fuel-guide",
    title: "Road Trip Fuel Cost Guide from Albania | Fuel Today",
    description: "Estimate road trip fuel costs from Albania with practical route examples, consumption assumptions, and cross-border petrol and diesel price context.",
    jsonLdType: "Article",
    datePublished: "2026-04-12",
    content: localeSections(
      i18n.en.roadTripTitle,
      i18n.en.roadTripIntro,
      [
        { title: i18n.en.roadTripCalcTitle, paragraphs: [i18n.en.roadTripCalcP1, i18n.en.roadTripCalcP2] },
        { title: i18n.en.roadTripConsumptionTitle, paragraphs: [i18n.en.roadTripConsumptionP1, i18n.en.roadTripConsumptionP2, i18n.en.roadTripConsumptionP3] },
        { title: i18n.en.roadTripCrossBorderTitle, paragraphs: [i18n.en.roadTripCrossBorderP1, i18n.en.roadTripCrossBorderP2, i18n.en.roadTripCrossBorderP3] },
        { title: i18n.en.roadTripPaymentTitle, paragraphs: [i18n.en.roadTripPaymentP1, i18n.en.roadTripPaymentP2] },
        { title: i18n.en.roadTripSavingsTitle, paragraphs: [i18n.en.roadTripSavingsP1, i18n.en.roadTripSavingsP2, i18n.en.roadTripSavingsP3, i18n.en.roadTripSavingsP4, i18n.en.roadTripSavingsP5] },
        { title: i18n.en.roadTripExampleTitle, paragraphs: [i18n.en.roadTripExampleP1, i18n.en.roadTripExampleP2, i18n.en.roadTripExampleP3] },
        { title: i18n.en.roadTripSummaryTitle, paragraphs: [i18n.en.roadTripSummaryP1] },
      ],
      [
        { label: "Cross-border fill-up math", to: "/insights/cross-border-fill-up-math" },
        { label: "Compare countries", to: "/compare" },
        { label: "Methodology", to: "/methodology" },
      ]
    ),
  },
  {
    path: "/market-report",
    title: `European Fuel Market Report — ${ANALYSIS_META.endLabel || "Daily Analysis"} | Fuel Today`,
    description: `European diesel market analysis from ${ANALYSIS_META.daysObserved} days of our own observations: rankings, 30-day movers and volatility.`,
    jsonLdType: "Article",
    datePublished: "2026-08-05",
    priceBearing: true,
    content: `<article class="contentPage reportPage">${freshnessNotice()}<div class="reportBody marketReportHtml">${MARKET_REPORT_HTML}</div></article>`,
  },
  {
    path: "/daily-challenge",
    title: "Daily Challenge — 5 Fuel Price Questions | Fuel Today",
    description: "Test yourself with today's 5 fuel price questions. Same questions for everyone, refreshes daily. Compare petrol and diesel prices across Europe.",
    jsonLdType: "WebPage",
    datePublished: "2026-06-05",
    priceBearing: true,
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">Daily Challenge: 5 Fuel Price Questions</h1>
        <p class="contentBody">The Daily Challenge is a short quiz built from the same fuel price dataset that powers the rest of this site. Every day at midnight, five new questions are generated from the latest European price data — and everyone who plays that day gets exactly the same five questions, so scores are directly comparable.</p>
        <section class="contentSection">
          <h2 class="contentHeading">How the challenge works</h2>
          <p class="contentBody">Each question compares petrol or diesel reference prices in two European countries. Answers use the dated dataset shown on our <a href="/rankings">rankings page</a>. After each question you can see both recorded national values; these are not individual pump prices.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Why a fuel price quiz is genuinely useful</h2>
          <p class="contentBody">Fuel-specific price order can change between dated readings. The game helps you notice that petrol and diesel may point in different directions, but a national reference gap is not a guaranteed saving on a border journey. Use the trip calculator for your distance and consumption, then check actual pumps.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Where the questions come from</h2>
          <p class="contentBody">Questions are generated each day from the latest available country-level reference snapshot, which may be older than the day of play. The same dated values appear on the <a href="/">homepage</a> and country pages; our <a href="/methodology">methodology page</a> explains collection. Your score and streak stay in your browser.</p>
        </section>
      </article>
    `,
  },
  {
    path: "/fuel-quiz",
    title: "Fuel Price Quiz — Which Country Has Cheaper Fuel? | Fuel Today",
    description: "Test your knowledge of dated European petrol and diesel reference prices. Guess the lower country-level value and track your score and streak.",
    jsonLdType: "WebPage",
    datePublished: "2026-06-05",
    priceBearing: true,
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">Fuel Price Quiz: Which Country Has Cheaper Fuel?</h1>
        <p class="contentBody">This quiz compares two European countries using the latest available source-dated national reference prices. Choose the lower petrol or diesel value for the displayed reading; actual station prices can differ.</p>
        <section class="contentSection">
          <h2 class="contentHeading">How to play</h2>
          <p class="contentBody">Pick petrol or diesel, then choose the country with the lower dated reference price. The quiz reveals both values in EUR per litre. Different fuels can reverse a country's ranking; your running score and best streak stay in your browser.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">What the quiz teaches</h2>
          <p class="contentBody">The exercise makes it easier to see where recorded fuel-specific gaps are large, small or unavailable. Publication dates and country averages matter more than a guess based on geography. For a route estimate using distance and vehicle consumption, see the <a href="/road-trip-fuel-guide">road trip fuel guide</a>.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Data behind the questions</h2>
          <p class="contentBody">The values come from the same source-dated dataset shown on the <a href="/rankings">rankings page</a>. We check the upstream sources regularly, but they may not publish a new price each day. See the <a href="/methodology">methodology page</a> for provenance and limits.</p>
        </section>
      </article>
    `,
  },
];

function renderAlbaniaDecisionSupport(ctx: PriceContext): string {
  if (!ctx.ok) return "";
  const albania = ctx.prices.get("Albania");
  if (!albania) return "";
  const money = (value: number | null) => value == null ? "Unavailable" : `€${value.toFixed(2)}`;
  const all = (value: number | null) => value == null || ctx.allPerEur == null ? "Unavailable" : `${Math.round(value * ctx.allPerEur).toLocaleString("en-US")} ALL`;
  const fuels = [
    { label: "Petrol", value: albania.petrol },
    { label: "Diesel", value: albania.diesel },
    { label: "LPG", value: albania.lpg },
  ];
  const fillRows = fuels.map((fuel) => `<tr><th scope="row">${fuel.label}</th><td>${money(fuel.value == null ? null : fuel.value * 50)}</td><td>${all(fuel.value == null ? null : fuel.value * 50)}</td></tr>`).join("");
  const neighbors = [
    { label: "Kosovo", slug: "kosovo" },
    { label: "Greece", slug: "greece" },
  ].map((neighbor) => {
    const comparison = comparisonSentence(compareCountries(ctx.latest, neighbor.label, "Albania", "diesel"), neighbor.label, "Albania", "diesel");
    return `<li><a href="/fuel-prices/${neighbor.slug}">${neighbor.label} fuel prices</a> — ${escapeHtml(comparison)}</li>`;
  }).join("");

  return `<section class="contentSection" id="albania-fill-up-cost">
    <h2 class="contentHeading">What a 50 litre fill-up costs in Albania</h2>
    <p class="contentBody">Calculated from the country-level reference prices dated ${ctx.asOfLabel}. Actual station totals can vary.</p>
    <table class="contentTable"><thead><tr><th scope="col">Fuel</th><th scope="col">50 L in EUR</th><th scope="col">≈ 50 L in ALL</th></tr></thead><tbody>${fillRows}</tbody></table>
    <h3 class="contentHeading">Albania compared with nearby countries</h3>
    <ul class="contentList">${neighbors}</ul>
    <p class="contentBody"><a href="/trip-cost-calculator">Calculate a specific route</a> or read the <a href="/albania-car-rental-guide">Albania car rental guide</a>.</p>
  </section>`;
}

function buildCountryRoutes(ctx: PriceContext): RouteEntry[] {
  return COUNTRY_EDITORIAL.map((c) => {
    const safe = countryPageContent(c, ctx.latest, "en");
    const faqItems = safe.faqs
      .map(
        (faq) => `
        <div class="faqItem">
          <h3 class="faqQuestion">${escapeHtml(faq.question)}</h3>
          <p class="contentBody">${escapeHtml(faq.answer)}</p>
        </div>`
      )
      .join("");

    const relatedItems = c.relatedLinks
      .map((link) => `<li><a href="${link.to}">${escapeHtml(link.label)}</a></li>`)
      .join("");

    return {
      path: `/fuel-prices/${c.slug}`,
      title: c.metaTitle,
      description: countryMetaDescription(c.metaDescription, c.dataCountryName, ctx.latest),
      jsonLdType: "FAQPage",
      datePublished: "2026-05-26",
      priceBearing: true,
      noindex: !isCountryIndexable(c.slug),
      content: `
      <article class="contentPage editorialExperience editorialExperience-newsroom">
        <header class="contentHero editorialHero">
          <p class="contentHeroBadge">Country market briefing</p>
          <h1 class="contentHeroTitle">${escapeHtml(c.label)} fuel prices</h1>
          <p class="contentHeroText">Dated petrol, diesel and LPG reference prices in ${escapeHtml(c.label)}. Source reading: ${escapeHtml(ctx.asOf)}; check each market's provenance below.</p>
        </header>
        ${freshnessNotice()}
        <section id="country-prices">${renderCountryPriceSection(ctx, c)}</section>
        ${c.dataCountryName === "Albania" ? renderAlbaniaDecisionSupport(ctx) : ""}
        <section id="country-history">${getCountryAnalysis(c.slug)}</section>
        <section class="contentSection editorialSection" id="country-market">
          <h2 class="contentHeading">${escapeHtml(c.label)} fuel market overview</h2>
          <p class="contentBody">${escapeHtml(safe.marketOverview)}</p>
        </section>

        <section class="contentSection editorialSection" id="country-comparison">
          <h2 class="contentHeading">${c.dataCountryName === "Albania" ? "Albania as the reference market" : `How ${escapeHtml(c.label)} compares with Albania`}</h2>
          <p class="contentBody">${escapeHtml(safe.albaniaContext)}</p>
        </section>

        <section class="contentSection editorialSection" id="country-travel">
          <h2 class="contentHeading">Travel and driving context</h2>
          <p class="contentBody">${escapeHtml(safe.travelRelevance)}</p>
        </section>

        <section class="contentSection editorialSection" id="country-fuels">
          <h2 class="contentHeading">Understanding petrol, diesel, and LPG prices</h2>
          <p class="contentBody">${escapeHtml(safe.fuelInterpretation)}</p>
        </section>

        <section class="contentSection editorialSection" id="country-borders">
          <h2 class="contentHeading">Cross-border reference comparison</h2>
          <p class="contentBody">${escapeHtml(safe.borderAdvice)}</p>
        </section>

        <section class="contentSection editorialSection" id="country-coverage">
          <h2 class="contentHeading">Data coverage and limitations</h2>
          <p class="contentBody">${escapeHtml(safe.dataLimitations)}</p>
          <p class="contentBody">${escapeHtml(safe.sourceTransparency)}</p>
        </section>

        <section class="contentSection editorialSection" id="country-faq">
          <h2 class="contentHeading">Frequently asked questions</h2>
          ${faqItems}
        </section>

        <section class="contentSection">
          <h2 class="contentHeading">Related resources</h2>
          <ul class="contentList">
            ${relatedItems}
          </ul>
        </section>
      </article>
    `,
    };
  });
}

function buildInsightRoutes(): RouteEntry[] {
  const articles = getPublishedArticles();

  const indexCards = articles
    .map(
      (a) => `
        <section class="contentSection">
          <h2 class="contentHeading"><a href="/insights/${a.slug}">${escapeHtml(a.title)}</a></h2>
          <p class="contentBodyMuted">Published ${a.datePublished} · ${a.readMinutes} min read</p>
          <p class="contentBody">${escapeHtml(a.description)}</p>
        </section>`
    )
    .join("");

  const indexRoute: RouteEntry = {
    path: "/insights",
    title: "Albania Fuel Price Analysis & Balkan Market Insights",
    description:
      "Read data-backed analysis of Albania and Balkan fuel prices, including diesel trends, cross-border fill-up costs, taxes, LPG and the lek-euro effect.",
    jsonLdType: "WebPage",
    datePublished: "2026-07-10",
    dateModified: articles[0]?.datePublished ?? "2026-07-10",
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">Albania and Balkan fuel price analysis</h1>
        <p class="contentBody">Data-backed analysis of Albania and Balkan fuel prices: diesel and petrol trends, cross-border fill-up costs, taxes, LPG, and the lek-euro effect. Each article is written by the Karburanti Sot team and grounded in the daily price record behind this site.</p>
        <p class="contentBody">Start with <a href="/fuel-prices/albania">today's Albania fuel prices</a>, the <a href="/market-report">current European market report</a>, or the <a href="/rankings">latest fuel price rankings</a>.</p>
        ${indexCards}
      </article>
    `,
  };

  const articleRoutes: RouteEntry[] = articles.map((a) => ({
    path: `/insights/${a.slug}`,
    title: a.seoTitle ?? `${a.title} | Fuel Today`,
    description: a.description,
    jsonLdType: "Article",
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">${escapeHtml(a.title)}</h1>
        <p class="contentBodyMuted">By the Karburanti Sot team · Published ${a.datePublished} · ${a.readMinutes} min read</p>
        ${a.html}
        <section class="contentSection">
          <h2 class="contentHeading">Keep exploring</h2>
          <ul class="contentList">
            <li><a href="/insights">All insights articles</a></li>
            <li><a href="/fuel-prices/albania">Albania fuel prices today</a></li>
            <li><a href="/rankings">Europe fuel price rankings</a></li>
          </ul>
        </section>
      </article>
    `,
  }));

  return [indexRoute, ...articleRoutes];
}

// ─── HTML generation ────────────────────────────────────────────────────────

function generateJsonLd(route: RouteEntry, description: string, ctx: PriceContext): string {
  const canonical = `${SITE_URL}${route.path === "/" ? "" : route.path}`;

  const publisher = {
    "@type": "Organization",
    name: "Karburanti Sot",
    url: SITE_URL,
  };

  const dateModified = [route.dateModified, route.datePublished, route.priceBearing && ctx.ok ? ctx.asOf : undefined]
    .filter((date): date is string => typeof date === "string").sort().pop();

  const commonDates = {
    datePublished: route.datePublished,
    dateModified,
  };

  if (route.jsonLdType === "FAQPage") {
    const editorial = COUNTRY_EDITORIAL.find(
      (c) => `/fuel-prices/${c.slug}` === route.path
    );
    const mainEntity = editorial
      ? countryPageContent(editorial, ctx.latest, "en").faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        }))
      : [];

    const graph: Record<string, unknown>[] = [
      {
        "@type": "FAQPage",
        name: route.title,
        url: canonical,
        inLanguage: "en",
        description,
        publisher,
        ...commonDates,
        mainEntity,
      },
    ];

    // The crawler sees the same source-dated reference values as the visible page.
    const marketRow = editorial ? ctx.latest?.countries.find((row) => row.country === editorial.dataCountryName) : null;
    const marketDate = marketRow?.provenance === "historical-fallback" || marketRow?.provenance === "date-unverified"
      ? marketRow.source_as_of ?? null : marketRow?.source_as_of ?? ctx.asOf;
    if (editorial && ctx.ok && ctx.prices.has(editorial.dataCountryName)) {
      graph.push({
        "@type": "Dataset",
        name: `Fuel reference prices in ${editorial.label}`,
        description: `Country-level petrol (gasoline 95), diesel, and LPG reference prices in ${editorial.label}, in EUR per liter. Source date ${marketDate ?? "unverified"}; source publication schedules vary.`,
        url: canonical,
        dateModified: marketDate ?? undefined,
        isBasedOn: marketRow?.source_url ?? (marketRow?.provenance ? undefined : ctx.sourceUrl || undefined),
        creator: publisher,
        temporalCoverage: marketDate ? `${ANALYSIS_META.startDate}/${marketDate}` : undefined,
        measurementTechnique:
          "Daily capture of published country-level average fuel prices, normalised to EUR per liter",
      });
    }

    return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
  }

  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": route.jsonLdType,
    name: route.title,
    url: canonical,
    inLanguage: "en",
    description,
    publisher,
    ...commonDates,
  };

  if (route.jsonLdType === "Article") {
    base.author = {
      "@type": "Organization",
      name: "Karburanti Sot",
      url: `${SITE_URL}/about`,
      };
    base.headline = route.title;
  }

  return JSON.stringify(base, null, 2);
}

function generateHead(route: RouteEntry, description: string, ctx: PriceContext): string {
  const canonical = `${SITE_URL}${route.path === "/" ? "" : route.path}`;

  const robots = route.noindex
    ? "noindex,follow"
    : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

  return `
    <title>${escapeHtml(route.title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${canonical}" />
    <meta name="data-as-of" content="${ANALYSIS_META.asOf}" />
    <meta name="build-date" content="${new Date().toISOString().slice(0, 10)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Fuel Today" />
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE_URL}/og.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${SITE_URL}/og.png" />
    <script type="application/ld+json">
${generateJsonLd(route, description, ctx)}
    </script>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ─── Main ───────────────────────────────────────────────────────────────────

/**
 * Strip ALL template SEO tags (title, description, robots, canonical,
 * hreflang, og:* and twitter:*) so every prerendered page carries
 * exactly one, route-specific set. Patterns tolerate multi-line tags.
 */
function stripTemplateSeoTags(html: string): string {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/g, "")
    .replace(/<meta\s+name="(description|robots|twitter:[^"]*)"[\s\S]*?\/>\s*/g, "")
    .replace(/<meta\s+property="og:[^"]*"[\s\S]*?\/>\s*/g, "")
    .replace(/<link\s+rel="(canonical|alternate)"[^>]*\/>\s*/g, "");
}

async function main() {
  const templatePath = resolve(DIST, "index.html");
  if (!existsSync(templatePath)) {
    console.error("dist/index.html not found. Run `vite build` first.");
    process.exit(1);
  }

  const ctx = await loadPriceContext();
  if (ctx.ok) {
    console.log(`✓ Loaded price data as of ${ctx.asOf} (${ctx.prices.size} countries)`);
  }

  const template = stripTemplateSeoTags(readFileSync(templatePath, "utf-8"));

  // Prerendering overwrites dist/index.html (the "/" route), so this script
  // can only run against a fresh `vite build` output — never twice in a row.
  if (!template.includes('<div id="root"></div>')) {
    console.error(
      "dist/index.html has no empty root div — it was already prerendered. Run `vite build` first."
    );
    process.exit(1);
  }

  const routes = [...STATIC_ROUTES.map(redesignedStaticContent).map((route) => ({ ...route, dateModified: ROUTE_CONFIGS.find((config) => config.path === route.path)?.lastmod ?? route.dateModified })), ...buildRoadRealityPrerenderRoutes(), ...buildCountryRoutes(ctx), ...buildInsightRoutes()];

  let count = 0;
  for (const route of routes) {
    const description =
      typeof route.description === "function" ? route.description(ctx) : route.description;
    let content = typeof route.content === "function" ? route.content(ctx) : route.content;
    if (["/", "/road-trip-fuel-guide", "/fuel-prices/albania"].includes(route.path)) {
      content += travelStaticLinks(route.path === "/" ? null : route.path === "/fuel-prices/albania" ? "albania" : "roadTrip", revenueConfig);
    }
    if (["/", "/trip-cost-calculator", "/albania-car-rental-guide", "/road-trip-fuel-guide", "/fuel-prices/albania", "/stations"].includes(route.path)) {
      content += `<aside class="contentSection"><h2 class="contentHeading">Check the road before you drive</h2><p class="contentBody">Review sourced closures, restrictions and verification dates for important routes in Albania.</p><p><a href="/road-status">Road conditions →</a></p></aside>`;
    }
    const head = generateHead(route, description, ctx);

    let html = template.replace("</head>", `${head}\n  </head>`);

    // Keep the first paint close to the SPA shell so the navbar does not push
    // the entire prerendered article down when React takes over.
    const shell = `<div class="page"><div class="container"><nav class="prerenderNav" aria-label="Primary navigation"><a class="prerenderBrand" href="/">Fuel Today</a><div class="prerenderNavLinks"><a href="/">Home</a><a href="/market-report">Market report</a><a href="/compare">Compare</a><a href="/rankings">Rankings</a><a href="/stations">Stations</a></div></nav>${content}</div></div>`;
    html = html.replace('<div id="root"></div>', `<div id="root">${shell}</div>`);

    // Flat .html output: Cloudflare Pages serves /foo from foo.html with a
    // direct 200 (and 308s /foo/ -> /foo), matching the slashless canonicals.
    const outFile =
      route.path === "/"
        ? resolve(DIST, "index.html")
        : resolve(DIST, `${route.path.slice(1)}.html`);
    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(outFile, html, "utf-8");
    count++;
  }

  // Guard against route-list drift: every indexable route in the app config
  // must have prerendered output, otherwise the sitemap would point at 404s.
  const rendered = new Set(routes.map((r) => r.path));
  const missing = ROUTE_CONFIGS.filter((r) => !r.noindex && !rendered.has(r.path));
  if (missing.length) {
    console.error(
      `✗ Prerender is missing routes declared in src/config/routes.ts: ${missing
        .map((r) => r.path)
        .join(", ")}`
    );
    process.exit(1);
  }

  console.log(`✓ Prerendered ${count} routes to ${DIST}`);
}

await main();
