/**
 * Insights articles — dated, authored editorial pieces.
 *
 * Single source of truth consumed by BOTH the React pages
 * (InsightsIndexPage / InsightArticlePage) and the prerender + sitemap
 * scripts, so crawlers and client navigation always agree.
 *
 * Publishing workflow:
 *  1. Review/edit a draft below (they are drafts until YOU approve the facts).
 *  2. Set `published: true` and set `datePublished` to the real publish date.
 *  3. Build + deploy. Publish staggered (1–2 per week), not all at once.
 *
 * Body HTML uses the same content classes as the rest of the site
 * (contentSection / contentHeading / contentBody / contentList).
 */

export type InsightArticle = {
  slug: string;
  title: string;
  /** Meta description + index-card teaser. */
  description: string;
  datePublished: string;
  dateModified?: string;
  published: boolean;
  /** Approximate reading time in minutes, shown on the index. */
  readMinutes: number;
  html: string;
};

export const INSIGHT_ARTICLES: InsightArticle[] = [
  {
    slug: "why-albanian-fuel-costs-more-than-the-balkans",
    title: "Why Albanian Fuel Costs More Than Almost Anywhere in the Balkans",
    description:
      "Albania has no meaningful domestic refining, imports nearly every liter by sea, and taxes fuel heavily relative to income. Here is the full breakdown of why Albanian pump prices sit near the top of the Balkan table.",
    datePublished: "2026-07-10",
    published: true,
    readMinutes: 6,
    html: `
      <section class="contentSection">
        <h2 class="contentHeading">The uncomfortable ranking</h2>
        <p class="contentBody">Compare pump prices across the Western Balkans on any given week and Albania almost always lands at or near the top. In early July 2026, petrol in Albania averaged around €1.76 per liter and diesel around €1.87 — higher than Bosnia and Herzegovina (≈€1.46 petrol), Bulgaria (≈€1.48), Serbia (≈€1.64), and dramatically higher than Kosovo (≈€1.30). Only the EU heavyweights — Italy, Greece on petrol, Croatia on some weeks — consistently price above Albania in the neighborhood. For a country with among the lowest average wages in Europe, that inversion deserves an explanation.</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">Reason 1: Everything is imported, by sea</h2>
        <p class="contentBody">Albania has crude oil in the ground — the Patos-Marinza field is one of the largest onshore oilfields in continental Europe — but almost no capacity to turn it into usable fuel. The Ballsh refinery has been idle or operating far below capacity for most of the past decade. In practice, virtually every liter of petrol and diesel sold at Albanian pumps is imported as a refined product, mostly by tanker into the ports of Durrës and Vlorë from Mediterranean refineries in Italy and Greece.</p>
        <p class="contentBody">That import chain adds real cost: sea freight, port handling, storage, inland distribution over difficult terrain, and the margin of import intermediaries. Neighboring Serbia, by contrast, has domestic refining (Pančevo), and Bosnia is supplied overland through cheaper Danube-basin logistics.</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">Reason 2: Taxes are high relative to the region</h2>
        <p class="contentBody">Albanian fuel carries a stack of levies: excise duty, a circulation tax, a carbon tax, and 20% VAT applied on top of everything, including the other taxes. Depending on the crude price, roughly half of what an Albanian driver pays at the pump is tax. That structure resembles EU fuel taxation — but Kosovo, the region's cheapest market, applies a far lighter burden, which is the single biggest reason fuel in Pristina costs €0.40–0.50 per liter less than in Tirana despite nearly identical import logistics.</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">Reason 3: A concentrated retail market</h2>
        <p class="contentBody">Fuel retail in Albania is dominated by a small number of vertically integrated groups — Kastrati above all, which controls import terminals as well as the largest station network. Concentration at both the wholesale and retail layer means less price competition than the station count suggests. The competition authority has investigated fuel pricing multiple times over the years, and the spread between the cheapest independents and the big brands within Tirana is usually just a few lek.</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">What the strong lek gives, the pump takes</h2>
        <p class="contentBody">One force has actually worked in Albanian drivers' favor: the lek's multi-year appreciation against the euro. Fuel is bought abroad in euros, so a stronger lek makes each imported liter cheaper in local terms. Without that currency effect, lek-denominated pump prices would be noticeably higher than they are today. The flip side: if the lek ever weakens, Albanian drivers will feel it at the pump within weeks.</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">What this means in practice</h2>
        <ul class="contentList">
          <li>If you regularly drive the Tirana–Pristina corridor, refueling in Kosovo is the single biggest fuel saving available to an Albanian driver — currently around €20 on a full 50L tank of diesel.</li>
          <li>Greek petrol is more expensive than Albanian petrol, but Greek diesel is often cheaper — check the <a href="/fuel-prices/greece">Greece page</a> before a southern trip rather than assuming.</li>
          <li>Within Albania, price differences between stations are small; convenience usually beats hunting for the cheapest pump.</li>
        </ul>
        <p class="contentBody">Live numbers for every claim in this article are on the <a href="/rankings">rankings page</a> and the <a href="/fuel-prices/albania">Albania price page</a>, updated daily.</p>
      </section>
    `,
  },
  {
    slug: "diesel-petrol-lpg-real-cost-albania",
    title: "Diesel, Petrol, or LPG in Albania: What a Driver Actually Pays Per Year",
    description:
      "LPG costs less than half the price of diesel per liter in Albania. We run the real annual numbers for a typical 15,000 km driver across all three fuels — including the catches the per-liter price hides.",
    datePublished: "2026-07-10",
    published: true,
    readMinutes: 7,
    html: `
      <section class="contentSection">
        <h2 class="contentHeading">The per-liter gap is enormous</h2>
        <p class="contentBody">As of early July 2026, Albanian country-level averages sit around €1.76/L for petrol (gasoline 95), €1.87/L for diesel, and €0.69/L for LPG (autogas). That last number is not a typo: LPG in Albania costs roughly 37% of the diesel price per liter. Gaps this large change the math of what car is cheap to run — but per-liter price alone is misleading, because the three fuels differ in consumption, vehicle cost, and practicality.</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">The honest annual comparison</h2>
        <p class="contentBody">Take a typical Albanian passenger car driving 15,000 km per year, and use realistic (not brochure) consumption figures for a compact car:</p>
        <ul class="contentList">
          <li><strong>Petrol:</strong> ~7.0 L/100km → 1,050 L/year → about <strong>€1,850/year</strong> at €1.76/L.</li>
          <li><strong>Diesel:</strong> ~5.5 L/100km → 825 L/year → about <strong>€1,540/year</strong> at €1.87/L.</li>
          <li><strong>LPG:</strong> ~8.4 L/100km (LPG burns ~20% more volume than petrol) → 1,260 L/year → about <strong>€870/year</strong> at €0.69/L.</li>
        </ul>
        <p class="contentBody">Diesel beats petrol by roughly €300 a year on fuel alone despite the higher per-liter price, because the consumption advantage more than compensates. LPG beats everything by a wide margin — roughly half the annual fuel cost of petrol — even after accounting for its higher volumetric consumption.</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">The catches the pump price hides</h2>
        <p class="contentBody"><strong>LPG:</strong> a factory-fit or professionally converted system costs €800–1,500 up front, which the fuel savings repay in roughly one to two years of average driving. Refueling infrastructure is decent in Tirana and along main corridors but thin in rural areas and across some borders — Kosovo, for instance, reports no reliable LPG average in our dataset at all. Boot space, slightly reduced power, and periodic tank certification are real costs of ownership.</p>
        <p class="contentBody"><strong>Diesel:</strong> modern diesels carry expensive emissions hardware (DPF, EGR, AdBlue on newer models) that dislikes short urban trips. For a Tirana city commuter doing 8,000 km a year, a diesel's maintenance risk can eat the fuel saving. Diesel's case strengthens with mileage — at 25,000+ km/year it is clearly the economical choice among the two conventional fuels.</p>
        <p class="contentBody"><strong>Petrol:</strong> the highest running cost of the three at current prices, but the cheapest vehicles, the simplest maintenance, and no conversion or fuel-availability compromises.</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">Rules of thumb</h2>
        <ul class="contentList">
          <li>Under ~10,000 km/year, mostly urban: petrol — simplicity wins, fuel spend is small anyway.</li>
          <li>15,000+ km/year with highway driving: diesel — the classic Albanian choice for a reason.</li>
          <li>High-mileage, cost-focused, mostly domestic driving: LPG conversion has the fastest payback of any fuel decision available in Albania today.</li>
        </ul>
        <p class="contentBody">Prices move — recheck the current gap on the <a href="/fuel-prices/albania">Albania page</a> (updated daily) before committing to a conversion or a purchase. For cross-border implications of your fuel choice, see the <a href="/road-trip-fuel-guide">road trip fuel guide</a>.</p>
      </section>
    `,
  },
  {
    slug: "cross-border-fill-up-math",
    title: "Cross-Border Fill-Up Math: Pristina, Thessaloniki, and the Bari Ferry",
    description:
      "Exactly how much you save (or lose) by refueling on the other side of the border on the three most common routes out of Albania — with a simple rule for each crossing.",
    datePublished: "2026-07-17",
    published: false, // REVIEW DRAFT, set real date when publishing
    readMinutes: 6,
    html: `
      <section class="contentSection">
        <h2 class="contentHeading">The method</h2>
        <p class="contentBody">For each route we assume a 50-liter usable tank and current country-level averages from our daily dataset (see the <a href="/compare">compare tool</a> for today's exact numbers). The question is always the same: given where you're driving, on which side of the border should the tank be full?</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">Tirana → Pristina: fill in Kosovo, always</h2>
        <p class="contentBody">Kosovo is the cheapest fuel market in the region — diesel recently around €1.49/L against Albania's €1.87. On a 50L fill that is a saving of roughly €19. The A1 highway makes this the easiest arbitrage in the Balkans: arrive in Kosovo with a near-empty tank, leave with a full one. For regular commuters, doing this twice a month is worth €400+ per year.</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">Tirana → Thessaloniki: it depends on your fuel</h2>
        <p class="contentBody">Greece breaks the intuition that "EU fuel is expensive" — for diesel. Greek diesel has recently traded around €1.60/L, clearly below Albania's €1.87, while Greek petrol (≈€1.92) is above Albania's €1.76. The rule: <strong>diesel drivers fill in Greece, petrol drivers fill in Albania before the border.</strong> On 50L, a diesel driver saves about €13 by waiting for a Greek station; a petrol driver saves about €8 by not doing so.</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">Durrës → Bari: arrive in Italy full</h2>
        <p class="contentBody">Italian fuel is expensive in both flavors — petrol ≈€1.81, diesel ≈€1.89, plus motorway-station premiums that regularly add 10–15 cents. Board the ferry with a full tank and, for a typical one-week Italian holiday of ~1,000 km, plan one unavoidable Italian fill mid-trip. Avoid autostrada stations where possible; in-town prices are meaningfully lower.</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">The general rule</h2>
        <p class="contentBody">Fuel where it's cheap, transit where it's expensive: Kosovo beats everyone, Albania beats Italy and beats Greece on petrol, Greece beats Albania on diesel. Montenegro sits close enough to Albania that convenience should decide. Check the <a href="/rankings">live rankings</a> the day you travel — these gaps move with tax changes and market swings.</p>
      </section>
    `,
  },
  {
    slug: "lek-euro-fuel-prices",
    title: "The Lek, the Euro, and Your Fuel Bill",
    description:
      "Every liter of fuel Albania consumes is bought abroad in euros or dollars. Here is how the lek's strength quietly sets the price you pay at the pump — and what happens if it reverses.",
    datePublished: "2026-07-24",
    published: false, // REVIEW DRAFT, set real date when publishing
    readMinutes: 5,
    html: `
      <section class="contentSection">
        <h2 class="contentHeading">A currency story hiding in the pump price</h2>
        <p class="contentBody">Albanian fuel importers pay for cargoes in hard currency; Albanian drivers pay in lek. Between those two transactions sits the exchange rate, and over the past several years it has been the Albanian driver's best friend: the lek appreciated from around 122 per euro in 2021 to under 100 in recent years — one of the strongest currency runs in Europe.</p>
        <p class="contentBody">Arithmetic makes the effect concrete: a wholesale liter costing €1.00 was ~122 lek of import cost in 2021 but under ~100 lek today. That appreciation absorbed a large share of the post-2022 energy shock. Without it, every crude-oil spike of the past years would have hit Albanian pumps significantly harder.</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">Why the lek strengthened</h2>
        <p class="contentBody">Record tourism inflows, strong remittances, and euro-denominated property investment all push euros into the Albanian economy, bidding up the lek. These flows are structural but not guaranteed — they are exactly the kind of flows that can slow when regional conditions change.</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">The asymmetry drivers should understand</h2>
        <p class="contentBody">Pump prices in Albania respond to two independent variables: the Mediterranean wholesale fuel price (in euros) and the ALL/EUR rate. They can offset or compound. A 5% rise in wholesale prices with a 5% lek appreciation leaves lek pump prices flat. But the dangerous scenario is the compound one: a weaker lek during an oil rally would deliver a double hit with no domestic refining buffer to soften it.</p>
        <p class="contentBody">This is also why our site shows prices in EUR per liter as the common reference: it strips out the currency layer so Albania can be compared fairly against euro-priced neighbors. When you see Albanian prices "stable" in EUR terms but moving in lek terms, you are watching the exchange rate work. Both views are available on the <a href="/fuel-prices/albania">Albania page</a>.</p>
      </section>
    `,
  },
  {
    slug: "how-albania-fuel-retail-market-works",
    title: "How Albania's Fuel Retail Market Actually Works",
    description:
      "From the tanker at Durrës to the pump in your neighborhood: who imports Albania's fuel, who sets the prices, and why the gap between stations is smaller than you'd expect.",
    datePublished: "2026-07-31",
    published: false, // REVIEW DRAFT, set real date when publishing
    readMinutes: 6,
    html: `
      <section class="contentSection">
        <h2 class="contentHeading">Three layers between the ship and your tank</h2>
        <p class="contentBody">Albania's fuel supply chain has three distinct layers: importers with coastal storage terminals, wholesale distributors, and retail station networks. The defining feature of the Albanian market is that its biggest players operate in all three layers at once — vertical integration that shapes everything about how prices behave.</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">The players</h2>
        <p class="contentBody"><strong>Kastrati Group</strong> is the dominant force — the largest fuel importer with terminal capacity at the ports, and the largest branded station network. <strong>KFG (Kuid)</strong> and a handful of other import-distributors supply both their own stations and hundreds of independents. Independent single-site stations still exist across the country, but most buy from the same few importers — which is why their prices rarely undercut the majors by much: their input cost is set by the very companies they compete against.</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">Why prices barely differ between stations</h2>
        <p class="contentBody">In markets like Germany or the UK, supermarket fuel and aggressive discounters create spreads of 10+ cents between stations in one city. In Albania the typical spread within Tirana is a few lek per liter. Concentrated wholesale supply, no supermarket fuel channel, and thin retail margins on a heavily taxed product all compress the room to discount. It also means "shopping around" for fuel inside Albania has limited value — the meaningful price decisions are cross-border ones (see our <a href="/insights/cross-border-fill-up-math">cross-border fill-up guide</a>).</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">Where oversight comes in</h2>
        <p class="contentBody">The Competition Authority has repeatedly examined the fuel sector, including formal investigations into possible price coordination during the 2022 energy crisis, when the government briefly operated a Transparency Board setting maximum margins for fuel. The board was a crisis instrument, not a permanent fixture, but its existence tells you how politically sensitive pump prices are in a country where fuel costs consume a large share of household income.</p>
        <p class="contentBody">Our <a href="/fuel-prices/albania">Albania page</a> tracks the resulting national average daily. For how those numbers are collected and their limitations, see the <a href="/methodology">methodology</a>.</p>
      </section>
    `,
  },
  {
    slug: "balkan-fuel-prices-monthly-recap",
    title: "Balkan Fuel Prices: The Monthly Recap Format",
    description:
      "A recurring look at what moved in the regional fuel market over the past month — biggest risers, biggest fallers, and what it means for Albanian drivers.",
    datePublished: "2026-08-01",
    published: false, // TEMPLATE — regenerate numbers from trends.json each month before publishing
    readMinutes: 4,
    html: `
      <section class="contentSection">
        <h2 class="contentHeading">What moved this month</h2>
        <p class="contentBody">[TEMPLATE — refresh every figure from the live data before publishing. Example based on June–July 2026:] Albanian fuel prices ended the month lower across the board: diesel fell from €1.94 to €1.87 (−3.7%), petrol from €1.81 to €1.76 (−2.8%), and LPG eased to €0.69. The sharpest single move came in the fourth week of June, when Mediterranean wholesale prices dropped and most Balkan markets repriced within days of each other.</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">Around the region</h2>
        <p class="contentBody">[Fill from trends: which neighbors moved most, any tax changes, notable divergences — e.g. Kosovo's administered stability vs market-driven swings elsewhere.]</p>
      </section>
      <section class="contentSection">
        <h2 class="contentHeading">What it means for drivers</h2>
        <p class="contentBody">[One practical takeaway: has any border arbitrage changed sign this month? Link the <a href="/compare">compare tool</a> and relevant country pages.]</p>
      </section>
    `,
  },
];

export function getPublishedArticles(): InsightArticle[] {
  return INSIGHT_ARTICLES.filter((a) => a.published).sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished)
  );
}

export function getArticle(slug: string): InsightArticle | undefined {
  return INSIGHT_ARTICLES.find((a) => a.slug === slug && a.published);
}
