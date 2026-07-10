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
import { STATIC_ROUTES as ROUTE_CONFIGS } from "../src/config/routes";
import { getPublishedArticles } from "../src/config/articles";
import {
  loadPriceContext,
  renderCountryPriceSection,
  renderHomeSnapshot,
  renderRankingsTable,
  renderComparePairs,
  priceMetaPrefix,
  type PriceContext,
} from "./priceData";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../dist");
const SITE_URL = "https://karburantisot.com";
const PUBLISHER_ID = "ca-pub-2653462201538649";
const GITHUB_URL = "https://github.com/PhoenixKola/albania-fuel-prices";

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
  content: string | ((ctx: PriceContext) => string); // visible HTML content for the page
};

const STATIC_ROUTES: RouteEntry[] = [
  {
    path: "/",
    title: "Fuel Today Albania & Europe | Petrol, Diesel and LPG Prices",
    description: "Compare today's fuel prices in Albania and Europe, understand why prices move, estimate road-trip costs, and review transparent methodology before you travel.",
    jsonLdType: "WebSite",
    datePublished: "2026-02-14",
    priceBearing: true,
    content: (ctx) => `
      <header class="contentHero">
        <h1 class="contentHeroTitle">Fuel prices in Albania and Europe, explained clearly</h1>
        <p class="contentHeroText">Karburanti Sot helps drivers compare fuel prices, estimate trip costs, and understand how pricing changes across countries. Instead of showing only raw numbers, the site adds context around price rankings, likely cost differences, exchange-rate effects, and practical travel use cases.</p>
      </header>
      <article class="contentPage">
        ${renderHomeSnapshot(ctx)}
        <section class="contentSection">
          <h2 class="contentHeading">What this site does</h2>
          <p class="contentBody">Fuel Today (Karburanti Sot) is an independent fuel price comparison website for Albania and Europe. It collects public country-level fuel price data, converts it into a consistent EUR-per-liter format, and presents it with editorial context so drivers can make informed decisions about where and when to refuel.</p>
          <p class="contentBody">The site covers petrol (gasoline 95), diesel, and LPG prices across Albania, Kosovo, Montenegro, North Macedonia, Greece, Italy, Croatia, Portugal, Switzerland, and the United Kingdom. Data is sourced from public fuel price aggregators and updated based on upstream publication schedules.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">How to interpret country-level prices</h2>
          <p class="contentBody">Country-level fuel prices represent broad reference values from available datasets. They are useful for comparison and planning, but individual station prices can vary based on competition, location, brand, and delivery timing. Use the numbers for trend and spread analysis, then validate your exact station before buying fuel.</p>
          <p class="contentBody">For Albania specifically, the displayed price is most representative of major-city stations. Rural and highway stations may differ by 2-8 ALL/L. The EUR conversion uses mid-market exchange rates from a public FX source.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Albania and Balkan context</h2>
          <p class="contentBody">Albania sits at the center of several busy cross-border driving corridors: Tirana-Pristina (Kosovo), Tirana-Podgorica (Montenegro), and Tirana-Ioannina (Greece). Fuel price differences at these borders are meaningful — ranging from negligible (Albania vs Kosovo) to substantial (Albania vs Greece, 0.20-0.40 EUR/L). Understanding these differences helps drivers plan refueling stops that can save 10-20 EUR per tank on cross-border trips.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Tools and guides</h2>
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
          <p class="contentBody">Fuel price data is sourced from publicly available European fuel price aggregators. Exchange rates come from a public FX API. All values are informational references — not guaranteed station prices. See the methodology page for full transparency about the data pipeline. The entire data pipeline and daily-updated dataset are <a href="${GITHUB_URL}" rel="noopener">open source on GitHub</a>, so anyone can verify the numbers independently.</p>
        </section>
      </article>
    `,
  },
  {
    path: "/stations",
    title: "Nearby Fuel Stations | Fuel Today",
    description: "Find nearby fuel stations and use location-based context alongside country-level fuel price comparisons for Albania and Europe.",
    jsonLdType: "WebPage",
    datePublished: "2026-04-01",
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">Nearby Fuel Stations</h1>
        <p class="contentBody">Find fuel stations near your current location using geolocation and OpenStreetMap data. This tool complements the country-level price data by showing you what stations are available nearby.</p>
        <section class="contentSection">
          <h2 class="contentHeading">How this page works</h2>
          <p class="contentBody">The nearby stations feature uses your device's geolocation (if you grant permission) to find fuel stations within a chosen radius (2 km, 5 km, or 10 km). Results show station names, approximate distances, and opening hours when available.</p>
          <p class="contentBody">This page does NOT show real-time pump prices for each station. Use the station finder as a location tool, and the country-level prices on the homepage as a reasonable estimate of what you will pay.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Why station prices differ from national averages</h2>
          <p class="contentBody">National average fuel prices are useful as a market-level reference, but the price at any individual pump depends on local factors: independent stations may price more aggressively than branded chains, city-centre locations often charge a premium due to higher property costs, and motorway stations are frequently the most expensive due to captive demand.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Privacy and location</h2>
          <p class="contentBody">Your location data is used only in your browser to calculate distances. It is never sent to our servers, stored, or shared with advertisers. If you deny location permission, the tool simply won't display results — the rest of the site works without any location data.</p>
        </section>
      </article>
    `,
  },
  {
    path: "/compare",
    title: "Compare Fuel Prices Across Countries | Fuel Today",
    description: "Build a country watchlist and compare petrol, diesel, and LPG prices across Albania and Europe for practical trip and budget planning.",
    jsonLdType: "WebPage",
    datePublished: "2026-04-01",
    priceBearing: true,
    content: (ctx) => `
      <article class="contentPage">
        <h1 class="contentPageTitle">Compare Fuel Prices</h1>
        <p class="contentBody">Build a watchlist of countries you care about and compare petrol, diesel, and LPG prices side by side for practical trip planning and cross-border refueling decisions.</p>
        ${renderComparePairs(ctx)}
        <section class="contentSection">
          <h2 class="contentHeading">How to use country comparisons effectively</h2>
          <p class="contentBody">Comparing fuel prices across countries is not just about finding the cheapest number. Exchange rates, tax structures, and data reporting schedules all affect how meaningful a direct comparison is. The watchlist feature is designed for drivers who regularly cross borders or plan multi-country road trips.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Practical comparison examples</h2>
          <p class="contentBody"><strong>Albania vs Kosovo:</strong> Prices are typically very close (within 0.02–0.05 EUR/L). The refueling decision often comes down to convenience on the Tirana-Pristina corridor.</p>
          <p class="contentBody"><strong>Albania vs Greece:</strong> One of the largest price differences in the Balkans. Greek fuel is typically 0.20–0.40 EUR/L more expensive. Fill up in Albania before crossing south.</p>
          <p class="contentBody"><strong>Albania vs Italy:</strong> Italian fuel is 0.40–0.60 EUR/L above Albanian prices. Fill up before the ferry and minimize Italian refueling.</p>
          <p class="contentBody"><strong>Albania vs Montenegro:</strong> A moderate difference (0.05–0.15 EUR/L). Albanian fuel is usually slightly cheaper.</p>
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
          <p class="contentBody">Unlike most price-comparison sites, our entire data pipeline is public: the collection scripts, the processing code, and every day of price history are published in an <a href="${GITHUB_URL}" rel="noopener">open-source repository on GitHub</a>. Anyone can inspect exactly how the numbers on this site are produced, or download the raw dataset and verify them independently. Questions and corrections reach the team directly at <a href="mailto:fenixkola@gmail.com">fenixkola@gmail.com</a>.</p>
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
          <p class="contentBody">The Service may display advertisements through Google AdSense. Google and its advertising partners may use cookies or device identifiers to serve ads. For users in regions requiring consent, controls will be presented once a certified Consent Management Platform is enabled.</p>
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
    description: "Read how Fuel Today selects, produces, and maintains fuel price content — including data sourcing standards, editorial independence, accuracy principles, and corrections policy.",
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
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">How Fuel Prices Work: From Crude Oil to the Pump</h1>
        <p class="contentBody">Fuel prices follow a chain from crude oil extraction through refining, distribution, and taxation to the final pump price. Understanding this chain helps interpret the price differences you see between countries.</p>
        <section class="contentSection">
          <h2 class="contentHeading">Crude oil: The starting point</h2>
          <p class="contentBody">Global crude oil prices set the floor for all refined fuel products. Crude is traded as Brent (European benchmark) and WTI (US benchmark). When crude rises, pump prices follow with a 1–3 week lag.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Refining</h2>
          <p class="contentBody">Crude oil is processed into petrol, diesel, kerosene, LPG, and other products. The refining margin fluctuates based on capacity, maintenance, and seasonal demand.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Taxes: The biggest variable</h2>
          <p class="contentBody">In most European countries, taxes make up 40–60% of the pump price. The two components are excise duty (fixed per liter) and VAT (percentage of final price). This is why the same fuel costs €1.30/L in one country and €1.90/L in another.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Summary</h2>
          <p class="contentBody">Pump price = crude oil + refining margin + distribution + excise duty + VAT + retail margin. Most cross-country differences come from tax. Most within-country differences come from retail margins and competition.</p>
        </section>
      </article>
    `,
  },
  {
    path: "/europe-fuel-comparison",
    title: "Europe Fuel Comparison with Albania | Fuel Today",
    description: "Compare Albania fuel prices with Kosovo, Montenegro, North Macedonia, Greece, Italy, Croatia, Portugal, Switzerland, and the United Kingdom.",
    jsonLdType: "Article",
    datePublished: "2026-04-12",
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">Fuel Prices Across Europe: A Country-by-Country Comparison Guide</h1>
        <p class="contentBody">Europe has some of the widest fuel price variation of any continent. A liter of diesel can cost nearly twice as much in Scandinavia as in parts of the Balkans. This guide explains why.</p>
        <section class="contentSection">
          <h2 class="contentHeading">Why prices vary so much</h2>
          <p class="contentBody">The base cost of fuel is broadly similar across Europe. The differences come from taxes (dominant factor), local distribution costs, and government interventions like subsidies or price caps.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Regional patterns</h2>
          <p class="contentBody">Scandinavian countries have the highest prices due to aggressive fuel taxation. Southern Europe (Spain, Portugal, Greece) falls mid-range. Central/Eastern Europe has lower prices. Balkan countries often have some of the lowest in Europe.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Diesel vs petrol</h2>
          <p class="contentBody">Historically, diesel was taxed more lightly than petrol. That trend is reversing in many countries due to environmental concerns. In some countries, diesel is now MORE expensive than petrol.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Border effects</h2>
          <p class="contentBody">Price differences at borders create refueling opportunities. Classic examples: Luxembourg (cheap fuel surrounded by expensive neighbors), Kosovo vs neighbors, Albania vs Greece. The compare tool on this site makes border strategies visible.</p>
        </section>
      </article>
    `,
  },
  {
    path: "/road-trip-fuel-guide",
    title: "Road Trip Fuel Cost Guide from Albania | Fuel Today",
    description: "Estimate road trip fuel costs from Albania with practical route examples, consumption assumptions, and cross-border petrol and diesel price context.",
    jsonLdType: "Article",
    datePublished: "2026-04-12",
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">Road Trip Fuel Cost Guide: How to Estimate and Reduce Your Fuel Expenses</h1>
        <p class="contentBody">Planning a road trip? Fuel is usually one of the biggest variable costs. This guide explains how to calculate fuel costs, factor in cross-border price differences, and keep expenses low.</p>
        <section class="contentSection">
          <h2 class="contentHeading">How to calculate trip fuel cost</h2>
          <p class="contentBody">Formula: (distance ÷ 100) × consumption (L/100km) × price per liter = estimated cost. For multi-country trips, estimate each segment separately using the relevant country's fuel price.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Real-world consumption</h2>
          <p class="contentBody">Manufacturer-stated consumption is almost always optimistic. Real-world consumption is typically 10–30% higher. Use your trip computer average, or add 15–20% to the manufacturer's combined figure.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Cross-border refueling strategy</h2>
          <p class="contentBody">Fill your tank in the cheapest country on your route. Carry minimal fuel through expensive countries. The country comparison and ranking tools on this site make this strategy easy to plan.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Example: Tirana to Thessaloniki</h2>
          <p class="contentBody">300 km drive, 7.5 L/100km consumption. Fuel needed: 22.5 liters. At Albania's diesel price (~€1.45/L), cost is about €32.60. Greek diesel (~€1.60/L) would cost €36.00 for the same distance. The €3.40 difference shows why cross-border awareness matters.</p>
        </section>
      </article>
    `,
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
          <p class="contentBody">Each question asks you to compare two European countries: which one currently has cheaper petrol or diesel? The answers are checked against the current country-level averages listed on our <a href="/rankings">rankings page</a>, so the "correct" answer genuinely reflects today's market data, not trivia written months ago. After each question you see the actual prices, which is where the learning happens — most players are surprised by at least one pair.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Why a fuel price quiz is genuinely useful</h2>
          <p class="contentBody">If you drive across borders in the Balkans — Albania to Kosovo, Greece, Montenegro, or Italy by ferry — having an accurate mental map of relative fuel prices saves real money. A wrong assumption about which side of the border is cheaper can cost 10–20 EUR on a single tank. Playing the challenge for a week builds that mental map faster than reading tables, because the surprises stick.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Where the questions come from</h2>
          <p class="contentBody">Questions are generated automatically from our daily dataset of country-level average prices, collected from public European fuel price aggregators. The same numbers are shown on the <a href="/">homepage</a> and the country pages, and the collection process is documented on the <a href="/methodology">methodology page</a>. Your score and streak are stored only in your browser — no account is needed.</p>
        </section>
      </article>
    `,
  },
  {
    path: "/fuel-quiz",
    title: "Fuel Price Quiz — Which Country Has Cheaper Fuel? | Fuel Today",
    description: "Test your knowledge of European fuel prices. Guess which country has cheaper petrol or diesel using live market data. Track your score and streak.",
    jsonLdType: "WebPage",
    datePublished: "2026-06-05",
    priceBearing: true,
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">Fuel Price Quiz: Which Country Has Cheaper Fuel?</h1>
        <p class="contentBody">This quiz shows you two European countries and asks a single question: which one has cheaper fuel right now? It runs on the same live dataset as the rest of the site, so every answer is verified against current country-level averages rather than static trivia.</p>
        <section class="contentSection">
          <h2 class="contentHeading">How to play</h2>
          <p class="contentBody">Pick petrol or diesel, then choose the country you think is cheaper. The quiz immediately reveals both prices in EUR per liter so you can see how close the pair really is. Some matchups are easy — Switzerland against Kosovo is not a fair fight — but pairs like Croatia vs Slovenia or Hungary vs Romania regularly surprise even drivers who cross those borders. Your running score and best streak are saved in your browser.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">What the quiz teaches</h2>
          <p class="contentBody">European fuel prices are driven mostly by national tax policy, which means the price map does not follow intuition about "rich" and "cheap" countries. The quiz is a fast way to internalize the real ranking: where the Balkans sit relative to the eurozone, why island and mountain states price differently, and which neighboring pairs have the biggest gaps. That knowledge feeds directly into practical decisions covered in our <a href="/road-trip-fuel-guide">road trip fuel guide</a>.</p>
        </section>
        <section class="contentSection">
          <h2 class="contentHeading">Data behind the questions</h2>
          <p class="contentBody">Prices come from our daily-updated dataset of European country averages — the same numbers on the <a href="/rankings">rankings page</a> — sourced from public aggregators and documented on the <a href="/methodology">methodology page</a>. Because the data refreshes daily, the correct answer to a matchup can genuinely change from one week to the next when markets move.</p>
        </section>
      </article>
    `,
  },
];

function buildCountryRoutes(ctx: PriceContext): RouteEntry[] {
  return COUNTRY_EDITORIAL.map((c) => {
    const faqItems = c.faqs
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
      description: priceMetaPrefix(ctx, c.dataCountryName) + c.metaDescription,
      jsonLdType: "FAQPage",
      datePublished: "2026-05-26",
      priceBearing: true,
      content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">${escapeHtml(c.label)} fuel prices today</h1>
        <p class="contentBody">This page provides a comprehensive overview of fuel prices in ${escapeHtml(c.label)}, with practical comparison context for Albanian drivers and travelers.</p>
        ${renderCountryPriceSection(ctx, c)}
        <section class="contentSection">
          <h2 class="contentHeading">${escapeHtml(c.label)} fuel market overview</h2>
          <p class="contentBody">${escapeHtml(c.marketOverview)}</p>
        </section>

        <section class="contentSection">
          <h2 class="contentHeading">How ${escapeHtml(c.label)} compares with Albania</h2>
          <p class="contentBody">${escapeHtml(c.albaniaContext)}</p>
        </section>

        <section class="contentSection">
          <h2 class="contentHeading">Travel and driving context</h2>
          <p class="contentBody">${escapeHtml(c.travelRelevance)}</p>
        </section>

        <section class="contentSection">
          <h2 class="contentHeading">Understanding petrol, diesel, and LPG prices</h2>
          <p class="contentBody">${escapeHtml(c.fuelInterpretation)}</p>
        </section>

        <section class="contentSection">
          <h2 class="contentHeading">Border crossings and refueling advice</h2>
          <p class="contentBody">${escapeHtml(c.borderAdvice)}</p>
        </section>

        <section class="contentSection">
          <h2 class="contentHeading">Data coverage and limitations</h2>
          <p class="contentBody">${escapeHtml(c.dataLimitations)}</p>
          <p class="contentBody">${escapeHtml(c.sourceTransparency)}</p>
        </section>

        <section class="contentSection">
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
    title: "Fuel Market Insights | Fuel Today",
    description:
      "Analysis and background articles on the Albanian and Balkan fuel markets — taxes, cross-border savings, market structure, and monthly price recaps.",
    jsonLdType: "WebPage",
    datePublished: "2026-07-10",
    dateModified: articles[0]?.datePublished ?? "2026-07-10",
    content: `
      <article class="contentPage">
        <h1 class="contentPageTitle">Fuel Market Insights</h1>
        <p class="contentBody">Analysis and background articles on the Albanian and Balkan fuel markets, written by the Karburanti Sot team and grounded in the same daily price dataset that powers this site.</p>
        ${indexCards}
      </article>
    `,
  };

  const articleRoutes: RouteEntry[] = articles.map((a) => ({
    path: `/insights/${a.slug}`,
    title: `${a.title} | Fuel Today`,
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
    sameAs: [GITHUB_URL],
  };

  const dateModified =
    route.priceBearing && ctx.ok ? ctx.asOf : route.dateModified ?? route.datePublished;

  const commonDates = {
    datePublished: route.datePublished,
    dateModified,
  };

  if (route.jsonLdType === "FAQPage") {
    const editorial = COUNTRY_EDITORIAL.find(
      (c) => `/fuel-prices/${c.slug}` === route.path
    );
    const mainEntity = editorial
      ? editorial.faqs.map((faq) => ({
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

    // Country pages carry an actual daily-updated dataset — say so explicitly.
    if (editorial && ctx.ok && ctx.prices.has(editorial.dataCountryName)) {
      graph.push({
        "@type": "Dataset",
        name: `Daily fuel prices in ${editorial.label}`,
        description: `Country-level average petrol (gasoline 95), diesel, and LPG prices in ${editorial.label}, in EUR per liter, updated daily from public aggregators.`,
        url: canonical,
        dateModified: ctx.asOf,
        isBasedOn: ctx.sourceUrl || undefined,
        creator: publisher,
        distribution: {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: "https://raw.githubusercontent.com/PhoenixKola/albania-fuel-prices/main/data/latest.json",
        },
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
      sameAs: [GITHUB_URL],
    };
    base.headline = route.title;
  }

  return JSON.stringify(base, null, 2);
}

function generateHead(route: RouteEntry, description: string, ctx: PriceContext): string {
  const canonical = `${SITE_URL}${route.path === "/" ? "" : route.path}`;

  return `
    <title>${escapeHtml(route.title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <link rel="canonical" href="${canonical}" />
    <meta name="google-adsense-account" content="${PUBLISHER_ID}" />
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
 * hreflang, og:*, twitter:*, adsense meta) so every prerendered page carries
 * exactly one, route-specific set. Patterns tolerate multi-line tags.
 */
function stripTemplateSeoTags(html: string): string {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/g, "")
    .replace(/<meta\s+name="(description|robots|twitter:[^"]*)"[\s\S]*?\/>\s*/g, "")
    .replace(/<meta\s+property="og:[^"]*"[\s\S]*?\/>\s*/g, "")
    .replace(/<link\s+rel="(canonical|alternate)"[^>]*\/>\s*/g, "")
    .replace(/<meta\s+name="google-adsense-account"[^>]*\/>\s*/g, "");
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

  const routes = [...STATIC_ROUTES, ...buildCountryRoutes(ctx), ...buildInsightRoutes()];

  let count = 0;
  for (const route of routes) {
    const description =
      typeof route.description === "function" ? route.description(ctx) : route.description;
    const content = typeof route.content === "function" ? route.content(ctx) : route.content;
    const head = generateHead(route, description, ctx);

    let html = template.replace("</head>", `${head}\n  </head>`);

    // Inject static content inside <div id="root">
    html = html.replace('<div id="root"></div>', `<div id="root">${content}</div>`);

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
