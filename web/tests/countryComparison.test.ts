import { test } from "node:test";
import assert from "node:assert/strict";
import type { LatestEurope } from "../src/models/fuel";
import { compareCountries, comparisonSentence } from "../src/models/countryComparison";
import { countryPageContent } from "../src/config/countryPageContent";
import { getCountryEditorial } from "../src/config/countryContent";
import { ROAD_ROUTES, ROAD_DATA_CHECKED_AT } from "../src/data/roadRoutes";
import { renderRoadRealityStatic } from "../scripts/roadRealityPrerender";

const now = new Date("2026-10-20T12:00:00Z");
const fixture: LatestEurope = {
  region: "Europe", unit: "EUR_per_liter", as_of: "2026-10-20",
  source: "test source", source_url: "https://example.com/prices", fetched_at_utc: now.toISOString(),
  countries: [
    { country: "Albania", gasoline95_eur: 2.143, diesel_eur: 2.394, lpg_eur: 0.76 },
    { country: "Greece", gasoline95_eur: 2.195, diesel_eur: 2.115, lpg_eur: null },
    { country: "Kosovo", gasoline95_eur: 1.412, diesel_eur: 1.609, lpg_eur: null },
  ],
};

test("opposing petrol and diesel directions use the same precise 50 L arithmetic", () => {
  const petrol = compareCountries(fixture, "Greece", "Albania", "gasoline95", 50, now)!;
  const diesel = compareCountries(fixture, "Greece", "Albania", "diesel", 50, now)!;
  assert.equal(petrol.direction, "a-higher");
  assert.equal(petrol.differencePerLitre, 0.052);
  assert.equal(petrol.differenceForTank, 2.6);
  assert.equal(diesel.direction, "a-lower");
  assert.equal(diesel.differencePerLitre, -0.279);
  assert.equal(diesel.differenceForTank, -13.95);
  assert.match(comparisonSentence(petrol, "Greece", "Albania", "gasoline95"), /more in Greece/);
  assert.match(comparisonSentence(diesel, "Greece", "Albania", "diesel"), /less in Greece/);
  assert.equal(compareCountries(fixture, "Albania", "Kosovo", "diesel", 50, now)?.differenceForTank, 39.25);
});

test("ties, absent fuels, invalid prices and future dates cannot invent a direction", () => {
  const equal = structuredClone(fixture);
  equal.countries[1].diesel_eur = 2.3944;
  assert.equal(compareCountries(equal, "Greece", "Albania", "diesel", 50, now)?.direction, "equal");
  assert.equal(compareCountries(fixture, "Greece", "Albania", "lpg", 50, now), null);
  assert.equal(compareCountries(fixture, "Atlantis", "Albania", "diesel", 50, now), null);
  assert.equal(compareCountries(fixture, "Albania", "Greece", "diesel", 0, now), null);
  equal.countries[1].diesel_eur = -1;
  assert.equal(compareCountries(equal, "Greece", "Albania", "diesel", 50, now), null);
  equal.as_of = "2026-10-21";
  assert.equal(compareCountries(equal, "Albania", "Greece", "gasoline95", 50, now), null);
});

test("source dates, staleness and Kosovo fallback provenance remain visible in shared editorial", () => {
  const stale = structuredClone(fixture);
  stale.as_of = "2026-10-12";
  stale.countries[2].provenance = "date-unverified";
  const result = compareCountries(stale, "Kosovo", "Albania", "diesel", 50, now)!;
  assert.equal(result.stale, true);
  assert.equal(result.provisional, true);
  assert.equal(result.sourceDateA, null);
  const greece = countryPageContent(getCountryEditorial("greece")!, stale, "en");
  assert.match(greece.borderAdvice, /diesel costs €0.279\/L less in Greece/);
  assert.match(greece.borderAdvice, /petrol 95 costs €0.052\/L more in Greece/);
  assert.equal(greece.faqs[1].answer, comparisonSentence(compareCountries(stale, "Greece", "Albania", "diesel"), "Greece", "Albania", "diesel"));
  assert.match(countryPageContent(getCountryEditorial("kosovo")!, stale, "sq").sourceTransparency, /datë e paverifikuar/);
});

test("rendering a stored road review cannot advance its review timestamp", () => {
  const route = ROAD_ROUTES[0];
  const before = route.lastCheckedAt;
  renderRoadRealityStatic(route);
  assert.equal(route.lastCheckedAt, before);
  assert.equal(before, ROAD_DATA_CHECKED_AT);
});
