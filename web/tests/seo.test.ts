import { test } from "node:test";
import assert from "node:assert/strict";
import { STATIC_ROUTES } from "../src/config/routes";
import { COUNTRY_EDITORIAL } from "../src/config/countryContent";
import { normalizeCanonicalPath } from "../src/utils/canonical";

test("priority search pages have unique, intent-first metadata", () => {
  const home = STATIC_ROUTES.find((route) => route.path === "/");
  const stations = STATIC_ROUTES.find((route) => route.path === "/stations");
  const insights = STATIC_ROUTES.find((route) => route.path === "/insights");
  assert.match(home?.title ?? "", /^Fuel Prices Today in Albania/);
  assert.match(stations?.title ?? "", /^Fuel Stations Near Me/);
  assert.match(insights?.title ?? "", /^Albania Fuel Price Analysis/);

  const priorityCountries = COUNTRY_EDITORIAL.filter((country) =>
    ["albania", "kosovo", "croatia", "greece", "portugal"].includes(country.slug)
  );
  assert.equal(new Set(priorityCountries.map((country) => country.metaTitle)).size, priorityCountries.length);
  for (const country of priorityCountries) {
    assert.match(country.metaTitle, new RegExp(country.label, "i"));
    assert.match(country.metaTitle, /fuel prices/i);
    assert.ok(country.metaDescription.length >= 80 && country.metaDescription.length <= 160);
  }
});

test("canonical paths use the slashless route format", () => {
  assert.equal(normalizeCanonicalPath("/"), "/");
  assert.equal(normalizeCanonicalPath("/fuel-prices/albania"), "/fuel-prices/albania");
  assert.equal(normalizeCanonicalPath("/fuel-prices/albania/"), "/fuel-prices/albania");
  assert.equal(normalizeCanonicalPath("//insights///"), "/insights");
});
