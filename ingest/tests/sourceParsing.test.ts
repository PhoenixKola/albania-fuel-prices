import { test } from "node:test";
import assert from "node:assert/strict";
import { parseDateFromText, validSourceDate } from "../sourceDate";
import { getLastCountryFromHistory, parseCargopediaEurope, parseKosovoFromFuelo, upsertCountry } from "../run";

const now = new Date("2026-10-20T12:00:00Z");
const rows = Array.from({ length: 22 }, (_, index) =>
  `<tr><td>${index === 0 ? "Albania" : `Market ${index}`}</td> <td>2.143</td> <td>2.394</td> <td>-</td></tr>`
).join("");

test("publication date parser accepts the actual undotted source label but never the fetch day", () => {
  assert.equal(parseDateFromText("European fuel prices 12 October 2026", now), "2026-10-12");
  assert.equal(parseDateFromText("Prices 12. October 2026", now), "2026-10-12");
  assert.equal(parseDateFromText("Average prices of 1 litre of fuel in Europe as of 12. October 2026", now), "2026-10-12");
  assert.equal(parseDateFromText("Fuel prices", now), null);
  assert.equal(parseDateFromText("12 Foober 2026", now), null);
  assert.equal(parseDateFromText("21 October 2026", now), null);
  assert.equal(parseDateFromText("31 February 2026", now), null);
  assert.equal(validSourceDate("2026-10-12", now), true);
});

test("Europe parser fails closed without a valid source date", () => {
  assert.throws(() => parseCargopediaEurope(`<html><body>Fuel prices<table>${rows}</table></body></html>`), /publication date/);
  assert.throws(() => parseCargopediaEurope(`<html><body>21 October 2026<table>${rows}</table></body></html>`), /publication date/);
  assert.throws(() => parseCargopediaEurope(`<html><body><table>${rows}</table><footer>12 October 2026</footer></body></html>`), /publication date/);
  const parsed = parseCargopediaEurope(`<html><body><h6>12 October 2026</h6> <table>${rows}</table></body></html>`);
  assert.equal(parsed.as_of, "2026-10-12");
  assert.equal(parsed.countries.find((row) => row.country === "Albania")?.lpg_eur, null);
});

test("source rows reject conflicting duplicates and invalid prices without inventing values", () => {
  const row = "<tr><td>Albania</td> <td>2.143</td> <td>2.394</td> <td>-</td></tr>";
  const page = (table: string) => `<html><body><h6>12 October 2026</h6> <table>${table}</table></body></html>`;
  assert.equal(parseCargopediaEurope(page(row + row)).countries.length, 1);
  assert.throws(() => parseCargopediaEurope(page(row + row.replace("2.394", "2.500"))), /Conflicting source rows/);
  const partial = parseCargopediaEurope(page("<tr><td>Albania</td> <td>15.000</td> <td>2,394</td> <td>-</td></tr>"));
  assert.equal(partial.countries[0].gasoline95_eur, null);
  assert.equal(partial.countries[0].diesel_eur, 2.394);
  assert.equal(partial.countries[0].lpg_eur, null);
});

test("Kosovo fallback records its observation age instead of claiming the main source date", () => {
  const observed = getLastCountryFromHistory({
    region: "Europe", unit: "EUR_per_liter",
    series: [{ as_of: "2026-09-01", source: "archive", countries: [{
      country: "Kosovo", gasoline95_eur: 1.4, diesel_eur: 1.6, lpg_eur: null,
    }] }],
  }, "Kosovo");
  assert.equal(observed?.provenance, "historical-fallback");
  assert.equal(observed?.last_observed_at, "2026-09-01");
  assert.equal(observed?.source_as_of, undefined);
  assert.equal(upsertCountry([observed!], { country: "kosovo", gasoline95_eur: 1.5, diesel_eur: 1.7, lpg_eur: null }).length, 1);
});

test("dated Kosovo provider rows are selected by date and invalid rows ignored", () => {
  const html = `<table>
    <tr><td>10.10.2026</td><td>1.400</td><td>1.600</td><td>-</td></tr>
    <tr><td>12.10.2026</td><td>1.412</td><td>1.609</td><td>-</td></tr>
    <tr><td>30.02.2026</td><td>1.900</td><td>1.900</td><td>-</td></tr>
  </table>`;
  assert.equal(parseKosovoFromFuelo(html)?.source_as_of, "2026-10-12");
  assert.equal(parseKosovoFromFuelo(html)?.diesel_eur, 1.609);
});
