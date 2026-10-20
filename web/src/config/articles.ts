/**
 * Dated editorial, shared by the client, prerenderer and sitemap.
 * Historical readings are collection-day observations; the old archive did
 * not consistently verify the upstream publication date.
 */
export type InsightArticle = {
  slug: string;
  title: string;
  seoTitle?: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  published: boolean;
  readMinutes: number;
  html: string;
};

const archiveNote = `<p class="contentBodyMuted">Historical values below are dated collection records, not a claim about the price available at every pump on that date. Older records did not separately verify the upstream publication date. For a newer source-dated reference, use the <a href="/fuel-prices/albania">Albania page</a> and check its displayed source date.</p>`;

export const INSIGHT_ARTICLES: InsightArticle[] = [
  {
    slug: "six-months-of-balkan-fuel-prices",
    title: "Balkan Fuel Prices: What the February–August 2026 Record Shows",
    seoTitle: "Balkan Fuel Price History, February–August 2026",
    description: "A dated look at Albania and nearby fuel-price observations collected between February and August 2026, with limits of the source record.",
    datePublished: "2026-08-05", dateModified: "2026-10-20", published: true, readMinutes: 4,
    html: `
      <section class="contentSection"><h2 class="contentHeading">What was recorded</h2>
        <p class="contentBody">Our archive starts on 14 February 2026. It stores country-level petrol, diesel and LPG reference readings collected from public sources. A collection-day entry is not proof that a source published a new price that day; unchanged readings may recur. The <a href="/methodology">methodology</a> explains how the record and its statistics are assembled.</p></section>
      <section class="contentSection"><h2 class="contentHeading">Albania in the dated sample</h2>
        <p class="contentBody">In the 14 February record, Albanian diesel was €1.801/L; the 5 August record shows €2.207/L, a 22.5% increase between those two collected readings. Petrol moved from €1.801 to €2.025/L, and LPG from €0.594 to €0.740/L. These are reference values, not individual station quotes or a forecast.</p>
        <p class="contentBody">The 5 August diesel readings were €2.068/L for Greece, €2.105/L for Italy and €1.465/L for Kosovo. Fuel types differed: Albania and Greece both showed €2.025/L for petrol in that archived record. A border conclusion based on diesel must therefore never be applied automatically to petrol or LPG.</p></section>
      <section class="contentSection"><h2 class="contentHeading">How to use the history</h2>
        <p class="contentBody">Historical ranges describe the values in this sample. They cannot predict the next price or explain tax, wholesale and retail causes by themselves. For a trip, compare the same fuel in each country using the <a href="/compare">comparison tool</a>, then account for the actual pump, route and consumption in the <a href="/trip-cost-calculator">trip calculator</a>.</p></section>
      ${archiveNote}`,
  },
  {
    slug: "why-albanian-fuel-costs-more-than-the-balkans",
    title: "Albanian Diesel in the 5 August 2026 Regional Snapshot",
    seoTitle: "Albania Diesel vs Nearby Markets: August 2026",
    description: "An archived fuel-specific comparison of Albania, Greece, Italy and Kosovo, with clear limits on what price data can explain.",
    datePublished: "2026-07-10", dateModified: "2026-10-20", published: true, readMinutes: 3,
    html: `
      <section class="contentSection"><h2 class="contentHeading">The dated diesel comparison</h2>
        <p class="contentBody">On the 5 August 2026 collection date, Albanian diesel was €2.207/L, compared with Greece at €2.068/L, Italy at €2.105/L and Kosovo at €1.465/L. For an illustrative 50 litres, the Albania–Greece gap was €6.95 and the Albania–Kosovo gap €37.10. Those amounts compare national references; they exclude detours, tolls and actual station prices.</p>
        <p class="contentBody">Petrol did not have the same direction: the Albania and Greece readings were both €2.025/L. The dated snapshot cannot support a rule that every fuel is dearer or cheaper on one side of a border.</p></section>
      <section class="contentSection"><h2 class="contentHeading">What the figures cannot establish</h2>
        <p class="contentBody">Country price data alone cannot isolate the contribution of taxation, imports, exchange rates, distribution or retail competition. Those mechanisms may affect prices, but the reference-price gap is not evidence of any one cause. Check the <a href="/fuel-prices/greece">Greece</a> and <a href="/fuel-prices/kosovo">Kosovo</a> pages for newer readings and their provenance.</p></section>
      ${archiveNote}`,
  },
  {
    slug: "diesel-petrol-lpg-real-cost-albania",
    title: "Petrol, Diesel or LPG: An Illustrative Albania Fuel Budget",
    seoTitle: "Albania Petrol, Diesel and LPG Cost Example",
    description: "Compare fuel spending using explicit distance and consumption assumptions with archived 5 August 2026 reference prices.",
    datePublished: "2026-08-05", dateModified: "2026-10-20", published: true, readMinutes: 3,
    html: `
      <section class="contentSection"><h2 class="contentHeading">Set the assumptions first</h2>
        <p class="contentBody">This example uses 15,000 km per year and the 5 August 2026 Albania collection reading: petrol €2.025/L, diesel €2.207/L and LPG €0.740/L. These vehicle consumption assumptions are examples, not measured averages: petrol 7.0 L/100 km, diesel 5.5 L/100 km and LPG 8.4 L/100 km.</p>
        <ul class="contentList"><li>Petrol: 1,050 L × €2.025 = €2,126.25.</li><li>Diesel: 825 L × €2.207 = €1,820.78.</li><li>LPG: 1,260 L × €0.740 = €932.40.</li></ul></section>
      <section class="contentSection"><h2 class="contentHeading">Why this is not a vehicle recommendation</h2>
        <p class="contentBody">Real consumption, maintenance, conversion cost, fuel availability and resale value vary by vehicle and route. A cheaper reference price per litre does not settle total ownership cost. Enter your own kilometres and consumption into the <a href="/trip-cost-calculator">trip fuel cost calculator</a> and check the source date before planning.</p></section>
      ${archiveNote}`,
  },
  {
    slug: "cross-border-fill-up-math",
    title: "Cross-Border Fuel Math: A Dated 50 L Example",
    seoTitle: "Albania Border Fuel Price Comparison Example",
    description: "Archived August 2026 diesel and petrol comparisons for Kosovo, Greece and Italy; see what a 50 L reference-price gap does and does not mean.",
    datePublished: "2026-08-05", dateModified: "2026-10-20", published: true, readMinutes: 3,
    html: `
      <section class="contentSection"><h2 class="contentHeading">The 5 August diesel example</h2>
        <p class="contentBody">Albania's archived diesel reference was €2.207/L. Kosovo was €1.465/L, Greece €2.068/L and Italy €2.105/L. Multiplying the differences by 50 litres gives €37.10, €6.95 and €5.10 respectively. This is arithmetic on national references, not the saving available at a particular border station.</p></section>
      <section class="contentSection"><h2 class="contentHeading">Fuel type and route change the answer</h2>
        <p class="contentBody">In the same collection record, Albania and Greece petrol were both €2.025/L, while Italian petrol was €2.008/L. LPG was unavailable for Kosovo in that record. Avoid a single “cheaper country” rule across fuels. For any actual journey, check current dated readings, the pumps you can reach, the fuel already in your tank, detours and tolls. The <a href="/compare">country comparison</a> and <a href="/trip-cost-calculator">route calculator</a> help separate these questions.</p></section>
      ${archiveNote}`,
  },
  {
    slug: "lek-euro-fuel-prices",
    title: "The Lek, the Euro and a Fuel Price Comparison",
    description: "How a EUR/L reference can be converted into an indicative lek amount, and why an FX conversion is not a pump quote.",
    datePublished: "2026-08-05", dateModified: "2026-10-20", published: true, readMinutes: 3,
    html: `
      <section class="contentSection"><h2 class="contentHeading">Two different readings</h2>
        <p class="contentBody">Fuel prices here are stored as EUR per litre so markets can be compared on one unit. The displayed ALL value is an indicative conversion using the available exchange rate. It is not an independently verified Albanian pump quote; bank rates, rounding and local retail pricing can differ.</p>
        <p class="contentBody">For example, at a purely hypothetical 100 ALL per EUR, a €2.000/L reference converts to 200 ALL/L. If that hypothetical rate changes to 98, the conversion becomes 196 ALL/L even when the EUR reference is unchanged. The example explains the arithmetic, not a historic or current exchange rate.</p></section>
      <section class="contentSection"><h2 class="contentHeading">Check both timestamps</h2>
        <p class="contentBody">A fuel source date and an exchange-rate date describe different observations. If the rate is unavailable, rely on the EUR value rather than inventing a local price. See the <a href="/fuel-prices/albania">Albania reading</a> and <a href="/methodology">methodology</a> for source details.</p></section>`,
  },
  {
    slug: "how-albania-fuel-retail-market-works",
    title: "Reading Albania Fuel Prices: Source and Station Limits",
    description: "What country-level reference prices can reveal about Albania's fuel market, and what requires separate station or regulatory evidence.",
    datePublished: "2026-08-05", dateModified: "2026-10-20", published: true, readMinutes: 3,
    html: `
      <section class="contentSection"><h2 class="contentHeading">A country reference is not a pump survey</h2>
        <p class="contentBody">This site's Albania price is a national reference from an upstream aggregator. The <a href="/stations">station finder</a> uses mapped locations and any listed opening hours; it does not collect each station's current retail price. A visible difference between two country references cannot establish the spread among stations in Tirana or identify the cheapest retailer.</p></section>
      <section class="contentSection"><h2 class="contentHeading">What can and cannot be inferred</h2>
        <p class="contentBody">Fuel supply can involve import, distribution, taxation and retail pricing, but our price dataset does not measure the contribution of each factor or prove market concentration. Collection-day price movements also cannot establish why retailers changed a price. We therefore use the record to describe price changes, not to assign a cause.</p>
        <p class="contentBody">For a practical decision, inspect the source date on the <a href="/fuel-prices/albania">Albania page</a>, compare the same fuel in another market on <a href="/compare">Compare</a>, and verify actual station prices before a special trip.</p></section>`,
  },
];

export function getPublishedArticles(): InsightArticle[] {
  return INSIGHT_ARTICLES.filter((article) => article.published).sort((a, b) =>
    (b.dateModified ?? b.datePublished).localeCompare(a.dateModified ?? a.datePublished)
  );
}

export function getArticle(slug: string): InsightArticle | undefined {
  return INSIGHT_ARTICLES.find((article) => article.slug === slug && article.published);
}
