/**
 * Insights articles — dated, authored editorial pieces.
 *
 * Single source of truth consumed by BOTH the React pages
 * (InsightsIndexPage / InsightArticlePage) and the prerender + sitemap
 * scripts, so crawlers and client navigation always agree.
 *
 * House rules for these pieces:
 *  - Every price quoted carries an explicit "as of" date, because prices move.
 *  - Claims about ranges, records and percentages come from our own dataset
 *    (data/history.json) and can be reproduced from the public repo.
 *  - Market-structure background is framed as context, not as a scoop.
 *
 * When prices move materially, refresh the figures and bump `dateModified`.
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
    slug: "six-months-of-balkan-fuel-prices",
    title: "Six Months of Balkan Fuel Prices: What 173 Days of Our Own Data Show",
    description:
      "We have recorded European fuel prices every single day since 14 February 2026. Albanian diesel is up 22.5% over that period, Albania has overtaken Greece and Italy on price, and the Kosovo gap has widened to €0.74 a liter. Here is the full analysis.",
    datePublished: "2026-08-05",
    published: true,
    readMinutes: 8,
    html: `
      <section class="contentSection">
        <h2 class="contentHeading">What this dataset is</h2>
        <p class="contentBody">Since 14 February 2026 this site has recorded country-level petrol, diesel and LPG prices across Europe once a day, every day, and appended each reading to a public file. As of 5 August 2026 that record holds 173 consecutive daily observations covering 42 markets, with no gaps. The raw prices come from public aggregators; the historical record, and everything we derive from it below, is ours — and it is <a href="https://github.com/PhoenixKola/albania-fuel-prices" rel="noopener">published openly</a> so anyone can check our arithmetic.</p>
        <p class="contentBody">Six months is long enough for patterns to appear that a daily price snapshot simply cannot show. Here is what ours shows.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">Finding 1: Albanian fuel has become dramatically more expensive</h2>
        <p class="contentBody">On 14 February 2026 Albanian diesel sat at €1.801 per liter. On 5 August 2026 it was €2.207 — a rise of 22.5% in under six months. Petrol went from €1.801 to €2.025 (+12.4%), and LPG from €0.594 to €0.740 (+24.6%). Diesel touched its floor of €1.794 on 28 February and its peak of €2.325 on 29 July.</p>
        <p class="contentBody">Two things stand out. First, diesel rose almost twice as fast as petrol, which is unusual — the two normally track each other closely because they come off the same barrel. Second, LPG, usually the sleepiest of the three, posted the largest percentage increase of all. A driver who converted to LPG in February to escape rising costs has watched the cheap option get proportionally more expensive than the thing they were escaping.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">Finding 2: Albania has quietly become one of the most expensive markets in the region</h2>
        <p class="contentBody">This is the finding that surprised us most, because it inverts the advice that circulated for years. As of 5 August 2026, Albanian diesel at €2.207 is more expensive than <strong>Greece</strong> (€2.068), more expensive than <strong>Italy</strong> (€2.105), and far more expensive than every other Balkan neighbour we track:</p>
        <ul class="contentList">
          <li>Kosovo — €1.465 (€0.742 cheaper than Albania)</li>
          <li>Bosnia and Herzegovina — €1.696</li>
          <li>Bulgaria — €1.713</li>
          <li>Croatia — €1.775</li>
          <li>Serbia — €1.930</li>
          <li>Greece — €2.068</li>
          <li>Italy — €2.105</li>
          <li><strong>Albania — €2.207</strong></li>
        </ul>
        <p class="contentBody">Only Switzerland (€2.326) and the Netherlands (€2.380) sit meaningfully above Albania among the markets in our set. For a country whose average wage is a fraction of the Swiss or Dutch equivalent, that is a striking position to occupy — and it is a recent development, not a longstanding fact.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">Finding 3: The old cross-border advice is now wrong</h2>
        <p class="contentBody">For years the standard guidance for Albanian drivers was: fill up at home before driving to Greece or Italy, because fuel there is dearer. On today's numbers that advice loses you money.</p>
        <p class="contentBody">Diesel in Greece is €0.139 per liter <em>cheaper</em> than in Albania — about €7 on a 50-litre tank in favour of waiting until you cross. Italian diesel is €0.102 cheaper, roughly €5 a tank. Petrol between Albania and Greece is, as of this reading, exactly level at €2.025. The one piece of old advice that still holds — and holds more strongly than ever — is Kosovo: at €1.465 for diesel, a full 50-litre tank costs about €37 less there than in Albania.</p>
        <p class="contentBody">We keep the live version of this comparison on the <a href="/compare">compare page</a>, because a gap this volatile can invert again. That is precisely the point: cross-border refuelling advice written once and left alone becomes wrong, quietly.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">Finding 4: Some markets barely move, others lurch daily</h2>
        <p class="contentBody">Measuring the standard deviation of daily percentage price moves across all 173 days gives a clean read on how jumpy each market is. Kosovo is by far the most stable in our set at 0.21% — its retail prices change rarely and in visible steps, consistent with a market where pricing is administered or slow to pass through. Serbia (0.57%) and Belarus (0.67%) are similarly placid.</p>
        <p class="contentBody">At the other end, Luxembourg (2.78%), Moldova (2.64%) and Poland (2.60%) reprice almost continuously, tracking wholesale costs closely. For a driver, volatility is practical information: in a stable market there is no point timing your fill-up, while in a volatile one waiting a few days genuinely can change what you pay. Current figures for every market are in the <a href="/market-report">daily market report</a>.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">What we cannot tell you</h2>
        <p class="contentBody">Being straight about the limits matters. Our dataset records country-level averages, not individual stations, so it cannot tell you which pump in Tirana is cheapest today. It began in February 2026, so it cannot speak to multi-year trends. And it records prices, not causes — we can show you that Albanian diesel rose 22.5%, but attributing that split between crude costs, exchange rates, excise changes and retail margins would require data we do not hold.</p>
        <p class="contentBody">What it does do is turn a daily snapshot into a record, and a record into context: whether today is expensive or cheap by recent standards, which way things have been moving, and where it pays to fill up. Every country page now carries that analysis — see <a href="/fuel-prices/albania">Albania</a> or <a href="/fuel-prices/greece">Greece</a> — and the underlying method is documented in our <a href="/methodology">methodology</a>.</p>
      </section>
    `,
  },
  {
    slug: "why-albanian-fuel-costs-more-than-the-balkans",
    title: "Why Albanian Fuel Now Costs More Than Greece, Italy and Every Balkan Neighbour",
    description:
      "Albania imports nearly every liter it burns, taxes it heavily, and buys it through a concentrated retail market. As of August 2026 that combination has pushed Albanian diesel above Greece and Italy. Here is the breakdown.",
    datePublished: "2026-07-10",
    dateModified: "2026-08-05",
    published: true,
    readMinutes: 6,
    html: `
      <section class="contentSection">
        <h2 class="contentHeading">The uncomfortable ranking</h2>
        <p class="contentBody">As of 5 August 2026, diesel in Albania costs €2.207 per liter. That is more than Greece (€2.068), more than Italy (€2.105), and far more than Bosnia (€1.696), Bulgaria (€1.713), Croatia (€1.775) or Serbia (€1.930). Kosovo, next door, charges €1.465. Among the markets we track, only Switzerland and the Netherlands are meaningfully more expensive.</p>
        <p class="contentBody">For a country with among the lowest average wages in Europe, that inversion deserves an explanation. Three structural factors do most of the work.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">Reason 1: Everything is imported, by sea</h2>
        <p class="contentBody">Albania has crude oil in the ground — the Patos-Marinza field is one of the largest onshore oilfields in continental Europe — but very little capacity to turn it into usable fuel. The Ballsh refinery has been idle or running far below capacity for most of the past decade. In practice virtually every liter of petrol and diesel sold at Albanian pumps arrives as a refined import, largely by tanker into Durrës and Vlorë from Mediterranean refineries.</p>
        <p class="contentBody">That chain adds cost at every link: sea freight, port handling, storage, inland distribution across difficult terrain, and the margin of import intermediaries. Serbia, by contrast, has domestic refining capacity at Pančevo, and Bosnia is supplied overland through cheaper Danube-basin logistics. Both sit well below Albania on price.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">Reason 2: Tax</h2>
        <p class="contentBody">Albanian fuel carries excise duty, a circulation tax, a carbon tax, and 20% VAT applied on top of the other levies. Depending on the underlying crude price, roughly half of what a driver pays at the pump is tax — a structure that broadly resembles EU fuel taxation without the EU-level incomes.</p>
        <p class="contentBody">Kosovo is the clearest natural experiment. It faces nearly identical import logistics to Albania — same region, same sea routes, similar scale — yet charges €0.742 per liter less for diesel. The difference is not geology or shipping; it is overwhelmingly fiscal.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">Reason 3: A concentrated retail market</h2>
        <p class="contentBody">Fuel retail in Albania is dominated by a small number of vertically integrated groups that control import terminals as well as station networks. Concentration at both the wholesale and retail layer means less price competition than the raw station count suggests, and Albania's competition authority has examined the sector more than once. Our own data offers indirect corroboration: Albanian prices move in relatively few discrete steps rather than drifting continuously, which is what you would expect where a handful of players reprice together.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">The currency cushion is thinning</h2>
        <p class="contentBody">One force has worked in Albanian drivers' favour for years: the lek's appreciation against the euro. Fuel is bought abroad in hard currency, so a stronger lek makes each imported liter cheaper in local terms, and that absorbed much of the post-2022 energy shock.</p>
        <p class="contentBody">What our 2026 record shows is what happens when that cushion stops expanding while input costs rise: diesel up 22.5% between February and August. The currency can soften an import shock; it cannot cancel one indefinitely.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">What this means in practice</h2>
        <ul class="contentList">
          <li>If you drive the Tirana–Pristina corridor, refuelling in Kosovo is now worth about €37 on a 50-litre tank of diesel — the single largest saving available to an Albanian driver.</li>
          <li>The old rule of "fill up before Greece" no longer applies to diesel: Greek diesel is currently cheaper. Check the <a href="/fuel-prices/greece">Greece page</a> before assuming.</li>
          <li>Within Albania, differences between stations are small. Convenience beats hunting for a cheaper pump.</li>
        </ul>
        <p class="contentBody">Every figure here is dated because every figure moves. Live numbers are on the <a href="/market-report">daily market report</a> and the <a href="/fuel-prices/albania">Albania page</a>.</p>
      </section>
    `,
  },
  {
    slug: "diesel-petrol-lpg-real-cost-albania",
    title: "Diesel, Petrol or LPG in Albania: What Each Actually Costs You Per Year",
    description:
      "LPG costs a third of what diesel costs per liter in Albania. We run the real annual numbers for a 15,000 km driver at August 2026 prices — including the catches the per-liter price hides.",
    datePublished: "2026-07-10",
    dateModified: "2026-08-05",
    published: true,
    readMinutes: 7,
    html: `
      <section class="contentSection">
        <h2 class="contentHeading">The per-liter gap is enormous</h2>
        <p class="contentBody">As of 5 August 2026, Albanian country-level averages stand at €2.025 per liter for petrol, €2.207 for diesel, and €0.740 for LPG. That last number is not a typo: LPG costs about a third of the diesel price per liter. Gaps this wide change which car is cheap to run — but the per-liter price alone is misleading, because the three fuels differ in consumption, vehicle cost and practicality.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">The honest annual comparison</h2>
        <p class="contentBody">Take a typical Albanian passenger car driving 15,000 km a year, using realistic rather than brochure consumption figures for a compact car:</p>
        <ul class="contentList">
          <li><strong>Petrol:</strong> ~7.0 L/100km → 1,050 L/year → about <strong>€2,125/year</strong> at €2.025/L.</li>
          <li><strong>Diesel:</strong> ~5.5 L/100km → 825 L/year → about <strong>€1,820/year</strong> at €2.207/L.</li>
          <li><strong>LPG:</strong> ~8.4 L/100km (LPG burns roughly 20% more volume than petrol) → 1,260 L/year → about <strong>€930/year</strong> at €0.740/L.</li>
        </ul>
        <p class="contentBody">Diesel still beats petrol by roughly €300 a year despite costing more per liter, because the consumption advantage more than compensates. LPG beats both by a wide margin — under half the annual fuel bill of petrol — even after accounting for its higher volumetric consumption.</p>
        <p class="contentBody">One caveat our own data adds: LPG was the fastest-rising of the three fuels between February and August 2026, up 24.6% against diesel's 22.5% and petrol's 12.4%. The LPG advantage is large, but it has been narrowing in relative terms, not widening.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">The catches the pump price hides</h2>
        <p class="contentBody"><strong>LPG:</strong> a factory-fit or professionally installed conversion costs roughly €800–1,500 up front. At the savings above — close to €1,200 a year against petrol — that pays back inside a year and a half of average driving. The real constraints are practical: refuelling infrastructure is good in Tirana and along main corridors but thin in rural areas and across some borders (our dataset has no reliable LPG average for Kosovo at all), plus lost boot space, slightly reduced power, and periodic tank certification.</p>
        <p class="contentBody"><strong>Diesel:</strong> modern diesels carry expensive emissions hardware — DPF, EGR, AdBlue on newer models — that dislikes short urban trips. For a Tirana commuter doing 8,000 km a year, one repair can erase several years of fuel savings. Diesel's case strengthens with mileage; above roughly 20,000 km a year it is clearly the better of the two conventional fuels.</p>
        <p class="contentBody"><strong>Petrol:</strong> the highest running cost of the three at current prices, but the cheapest vehicles, the simplest maintenance, and no conversion or fuel-availability compromises.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">Rules of thumb</h2>
        <ul class="contentList">
          <li>Under ~10,000 km/year, mostly urban: petrol. Simplicity wins and the total fuel spend is modest anyway.</li>
          <li>15,000+ km/year with highway driving: diesel remains the conventional choice.</li>
          <li>High-mileage, cost-focused, mostly domestic driving: LPG has the fastest payback of any fuel decision available in Albania today.</li>
        </ul>
        <p class="contentBody">Prices move — and as our six-month record shows, they can move a lot. Recheck the current gap on the <a href="/fuel-prices/albania">Albania page</a> before committing to a conversion or a purchase.</p>
      </section>
    `,
  },
  {
    slug: "cross-border-fill-up-math",
    title: "Cross-Border Fill-Up Math: Pristina, Thessaloniki and the Bari Ferry",
    description:
      "What you actually save by refuelling across the border on the three most common routes out of Albania — recalculated at August 2026 prices, where two of the three answers have flipped.",
    datePublished: "2026-08-05",
    published: true,
    readMinutes: 6,
    html: `
      <section class="contentSection">
        <h2 class="contentHeading">The method</h2>
        <p class="contentBody">For each route we assume a 50-litre usable tank and country-level average diesel prices as of 5 August 2026. The question is always the same: given where you are driving, on which side of the border should the tank be full? Two of these three answers have reversed since the spring, which is the whole reason this article needs a date on it.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">Tirana → Pristina: fill in Kosovo, emphatically</h2>
        <p class="contentBody">Kosovo remains the cheapest market in the region and the gap has widened sharply. Diesel there is €1.465 against Albania's €2.207 — a difference of €0.742 per liter, or about <strong>€37 on a 50-litre fill</strong>. The A1 makes this the easiest arbitrage in the Balkans: arrive in Kosovo with a low tank, leave with a full one. A commuter doing this twice a month saves on the order of €900 a year.</p>
        <p class="contentBody">Kosovo is also the most stable market in our entire dataset — daily volatility of 0.21% — so unlike most cross-border advice, this one is unlikely to invert next month.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">Tirana → Thessaloniki: the advice has flipped</h2>
        <p class="contentBody">The long-standing rule was to fill up in Albania before heading south. For diesel that is now wrong. Greek diesel sits at €2.068 against Albania's €2.207 — €0.139 per liter <em>cheaper</em>, worth about €7 on a tank in favour of waiting until you cross.</p>
        <p class="contentBody">Petrol is a different story: at €2.025 in both markets, the two are currently identical, so for petrol drivers it genuinely makes no difference and convenience should decide. Check the <a href="/fuel-prices/greece">Greece page</a> before you travel — this pair is close enough that it can swap back.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">Durrës → Bari: also flipped, but mind the motorways</h2>
        <p class="contentBody">Italian diesel at €2.105 is now €0.102 cheaper than Albanian diesel — about €5 a tank in Italy's favour, reversing the old "board the ferry full" rule. Italian petrol (€2.008) is likewise marginally below Albania's €2.025.</p>
        <p class="contentBody">One important caveat: those are national averages, and Italian <em>autostrada</em> stations routinely price 10–15 cents above them. The refined advice is to cross with a comfortable tank, then refuel at in-town stations rather than motorway service areas, where the headline advantage disappears entirely.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">The general rule, updated</h2>
        <p class="contentBody">Kosovo beats everyone by a wide margin. Greece and Italy have both moved marginally below Albania on diesel. Montenegro and North Macedonia are not covered by our upstream data source, so we make no claim about them. The honest summary for August 2026: Albania is no longer the cheap side of any border it shares except, arguably, none at all.</p>
        <p class="contentBody">Because these gaps move, check the <a href="/compare">live comparison tool</a> on the day you travel rather than trusting any article — including this one.</p>
      </section>
    `,
  },
  {
    slug: "lek-euro-fuel-prices",
    title: "The Lek, the Euro, and Your Fuel Bill",
    description:
      "Every liter of fuel Albania consumes is bought abroad in hard currency. Here is how the exchange rate quietly sets the price you pay at the pump — and what our 2026 data shows about what happens when the cushion stops growing.",
    datePublished: "2026-08-05",
    published: true,
    readMinutes: 5,
    html: `
      <section class="contentSection">
        <h2 class="contentHeading">A currency story hiding in the pump price</h2>
        <p class="contentBody">Albanian fuel importers pay for cargoes in hard currency; Albanian drivers pay in lek. Between those two transactions sits the exchange rate, and for several years it worked in the driver's favour: the lek appreciated substantially against the euro, one of the stronger currency runs in Europe.</p>
        <p class="contentBody">The arithmetic is direct. A wholesale liter costing €1.00 represented roughly 122 lek of import cost at 2021 exchange rates, but under 100 lek at recent ones. That appreciation absorbed a large share of the post-2022 energy shock. Without it, every crude rally of the past few years would have hit Albanian pumps considerably harder.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">Why the lek strengthened</h2>
        <p class="contentBody">Record tourism receipts, sustained remittances, and euro-denominated property investment all push foreign currency into the Albanian economy, bidding up the lek. These flows are structural rather than accidental — but they are not guaranteed, and they are exactly the kind of flows that soften when regional conditions change.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">The asymmetry drivers should understand</h2>
        <p class="contentBody">Albanian pump prices respond to two largely independent variables: the Mediterranean wholesale fuel price, denominated in euros, and the ALL/EUR rate. They can offset each other or compound. A 5% rise in wholesale costs paired with 5% lek appreciation leaves lek pump prices roughly flat — which is what "stable" years actually looked like.</p>
        <p class="contentBody">The dangerous case is the compound one: rising input costs with no currency offset. Our own 2026 record is a mild version of exactly that — Albanian diesel up 22.5% between 14 February and 5 August, with no domestic refining buffer to soften the pass-through. A genuinely weakening lek during a crude rally would be considerably worse.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">Why we quote prices in euros</h2>
        <p class="contentBody">This is also why our tables use EUR per liter as the common reference: it strips out the currency layer so Albania can be compared fairly against euro-priced neighbours. When you see Albanian prices flat in euro terms but moving in lek terms, you are watching the exchange rate do its work. Both views are available on the <a href="/fuel-prices/albania">Albania page</a>, and the conversion method is described in our <a href="/methodology">methodology</a>.</p>
      </section>
    `,
  },
  {
    slug: "how-albania-fuel-retail-market-works",
    title: "How Albania's Fuel Retail Market Actually Works",
    description:
      "From the tanker at Durrës to the pump in your neighbourhood: who imports Albania's fuel, how prices are set, and why the gap between competing stations is far smaller than you would expect.",
    datePublished: "2026-08-05",
    published: true,
    readMinutes: 6,
    html: `
      <section class="contentSection">
        <h2 class="contentHeading">Three layers between the ship and your tank</h2>
        <p class="contentBody">Albania's fuel supply chain has three distinct layers: importers with coastal storage terminals, wholesale distributors, and retail station networks. The defining feature of the Albanian market is that its largest players operate across all three at once. That vertical integration shapes everything about how prices behave.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">The players</h2>
        <p class="contentBody">A small number of large groups dominate both import terminal capacity and branded retail networks, supplying not only their own stations but many of the independents that appear to compete with them. Independent single-site stations remain common across the country, but most buy their product from the same handful of importers — which is why their prices rarely undercut the majors by much. Their input cost is set by the very companies they compete against.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">Why prices barely differ between stations</h2>
        <p class="contentBody">In markets like Germany or the UK, supermarket fuel and aggressive discounters produce spreads of ten cents or more between stations in a single city. In Albania the typical spread within Tirana is a few lek per liter. Concentrated wholesale supply, no supermarket fuel channel, and thin retail margins on a heavily taxed product all compress the room to discount.</p>
        <p class="contentBody">The practical consequence is that "shopping around" inside Albania has limited value. The meaningful price decisions are cross-border ones — see our <a href="/insights/cross-border-fill-up-math">cross-border fill-up math</a>, where a single crossing into Kosovo is currently worth around €37 a tank.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">What our data suggests about pricing behaviour</h2>
        <p class="contentBody">Our daily record offers indirect evidence about how the market prices. Across 173 days of observations, Albanian diesel took only a limited number of distinct values — prices move in visible steps rather than drifting continuously, and those steps tend to arrive across the market at once. That is the signature of a market where a few large players reprice periodically, rather than one where hundreds of retailers adjust independently against wholesale costs. Compare that with Luxembourg or Poland, whose daily volatility is more than ten times Kosovo's in our <a href="/market-report">market report</a>.</p>
      </section>

      <section class="contentSection">
        <h2 class="contentHeading">Where oversight comes in</h2>
        <p class="contentBody">Fuel pricing is politically sensitive in a country where transport costs consume a large share of household income, and Albania's competition authority has examined the sector on more than one occasion. During the 2022 energy crisis the government briefly operated a transparency board setting maximum margins — a crisis instrument rather than a permanent fixture, but a telling one.</p>
        <p class="contentBody">We track the resulting national average daily on the <a href="/fuel-prices/albania">Albania page</a>. For how those numbers are collected, normalised and analysed, see the <a href="/methodology">methodology</a>.</p>
      </section>
    `,
  },
];

export function getPublishedArticles(): InsightArticle[] {
  return INSIGHT_ARTICLES.filter((a) => a.published).sort((a, b) =>
    (b.dateModified ?? b.datePublished).localeCompare(a.dateModified ?? a.datePublished)
  );
}

export function getArticle(slug: string): InsightArticle | undefined {
  return INSIGHT_ARTICLES.find((a) => a.slug === slug && a.published);
}
