import { test } from "node:test";
import assert from "node:assert/strict";
import type { LatestEurope } from "../src/models/fuel";
import { marketDate, describeMarketDate, marketSource } from "../src/models/marketDate";
import { renderHomeSnapshot, renderRankingsTable, renderCountryPriceSection, type PriceContext } from "../scripts/priceData";

const data: LatestEurope = {
  region: "Europe", unit: "EUR_per_liter", as_of: "2026-11-16",
  source: "cargopedia.net", source_url: "https://www.cargopedia.net/europe-fuel-prices", fetched_at_utc: "2026-11-18T15:00:00Z",
  countries: [
    { country: "Albania", gasoline95_eur: 1.828, diesel_eur: 2.327, lpg_eur: 0.787 },
    { country: "Kosovo", gasoline95_eur: 1.412, diesel_eur: 1.609, lpg_eur: null, last_observed_at: "2026-10-20", provenance: "historical-fallback" },
    { country: "Greece", gasoline95_eur: 1.974, diesel_eur: 2.043, lpg_eur: 1.241 },
    { country: "Italy", gasoline95_eur: 1.974, diesel_eur: 2.216, lpg_eur: 0.838, source_as_of: "2026-11-12" },
    { country: "Croatia", gasoline95_eur: 1.754, diesel_eur: 2.03, lpg_eur: 1.09, provenance: "date-unverified" },
  ],
};
const row = (name: string) => data.countries.find((item) => item.country === name);

test("each market gets its own date status; a fallback never inherits the feed date", () => {
  assert.deepEqual(marketDate(row("Albania"), data.as_of), { status: "verified", date: "2026-11-16" });
  assert.deepEqual(marketDate(row("Kosovo"), data.as_of), { status: "observed", date: "2026-10-20" });
  assert.deepEqual(marketDate(row("Italy"), data.as_of), { status: "verified", date: "2026-11-12" });
  assert.deepEqual(marketDate(row("Croatia"), data.as_of), { status: "unknown" });
  assert.deepEqual(marketDate(row("Albania"), undefined), { status: "unknown" });
});

test("labels distinguish observed, verified and unknown dates in EN and SQ", () => {
  const observed = describeMarketDate(marketDate(row("Kosovo"), data.as_of), "en");
  assert.equal(observed.unverified, true);
  assert.match(observed.value, /20 Oct 2026 · publication unverified/);
  assert.match(describeMarketDate(marketDate(row("Kosovo"), data.as_of), "sq").value, /publikimi i paverifikuar/);
  assert.equal(describeMarketDate({ status: "unknown" }, "sq").value, "E paverifikuar");
  assert.equal(describeMarketDate(marketDate(row("Albania"), data.as_of), "en").unverified, false);
});

test("an unverified market is not credited to the feed-wide source", () => {
  assert.equal(marketSource(row("Albania"), data, "en").name, "cargopedia.net");
  assert.equal(marketSource(row("Kosovo"), data, "en").url, null);
  assert.match(marketSource(row("Kosovo"), data, "en").name ?? "", /source unverified/);
});

function context(): PriceContext {
  const prices = new Map(data.countries.map((c) => [c.country, { petrol: c.gasoline95_eur, diesel: c.diesel_eur, lpg: c.lpg_eur }]));
  return { ok: true, latest: data, asOf: data.as_of, asOfLabel: "16 November 2026", source: data.source, sourceUrl: data.source_url, allPerEur: null, prices, trendDates: [], trends: {} };
}

test("static homepage and ranking tables qualify markets with their own date and drop 'Today's'", () => {
  const home = renderHomeSnapshot(context());
  assert.ok(!home.includes("Today's"));
  assert.match(home, /main source reading: 16 November 2026/);
  assert.match(home, /Kosovo<\/a><br><small>Observed 20 October 2026; publication unverified<\/small>/);
  assert.match(home, /Croatia<\/a><br><small>Unverified<\/small>/);
  assert.match(home, /Italy<\/a><br><small>Source date 12 November 2026<\/small>/);
  assert.ok(!/Albania<\/a><br><small>/.test(home) && !/Greece<\/a><br><small>/.test(home));
  assert.match(renderRankingsTable(context()), /Kosovo<\/a><br><small>Observed 20 October 2026/);
});

test("the country price note links the feed source only for markets that came from it", () => {
  const albania = renderCountryPriceSection(context(), { dataCountryName: "Albania", label: "Albania" });
  assert.match(albania, /<a href="https:\/\/www\.cargopedia\.net\/europe-fuel-prices"[^>]*>cargopedia\.net<\/a>/);
  const kosovo = renderCountryPriceSection(context(), { dataCountryName: "Kosovo", label: "Kosovo" });
  assert.ok(!kosovo.includes("cargopedia"));
  assert.match(kosovo, /source unverified/);
});
