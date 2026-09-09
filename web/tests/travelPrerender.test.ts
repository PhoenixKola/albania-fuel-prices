import { test } from "node:test";
import assert from "node:assert/strict";
import { travelStaticContent, travelStaticLinks } from "../scripts/travelPrerender";
import { readMonetizationConfig } from "../src/config/monetization";
import { travelCopy } from "../src/config/travelCopy";
import type { PriceContext } from "../scripts/priceData";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import TripCostCalculatorPage from "../src/pages/TripCostCalculatorPage";
import AlbaniaCarRentalGuidePage from "../src/pages/AlbaniaCarRentalGuidePage";
import { commercialCopy } from "../src/config/commercialCopy";
import { layoutCopy } from "../src/config/layoutCopy";
import { ALBANIAN_ENABLED } from "../src/config/features";
const context: PriceContext = { ok: true, asOf: "2026-09-08", asOfLabel: "8 September 2026", source: "Fixture", sourceUrl: "https://example.org", allPerEur: null,
  prices: new Map([["Albania", { petrol: 1.9, diesel: 2, lpg: null }]]), trendDates: [], trends: {} };
test("shared React prerender uses dated data, full guide content and configured referral attribution", () => {
  const config = readMonetizationConfig({ VITE_RENTAL_URL: "https://www.discovercars.com/albania?a_aid=render-fixture&chan=guide" });
  const guide = travelStaticContent("/albania-car-rental-guide", context, config);
  for (const section of travelCopy.en.guideSections) assert.ok(guide.includes(section.title), section.title);
  assert.match(guide, /€70\.00/); assert.match(guide, /2026-09-08/);
  assert.match(guide, /a_aid=render-fixture&amp;chan=guide/);
  assert.match(guide, /rel="sponsored noopener"/);
  const calculator = travelStaticContent("/trip-cost-calculator", context, readMonetizationConfig({}));
  assert.match(calculator, /€14\.00/);
  assert.match(calculator, /ALL conversion unavailable/);
  assert.match(calculator, /Enable JavaScript/);
  assert.doesNotMatch(calculator, /class="rentalReferral"/);
  assert.doesNotMatch(calculator, /adsbygoogle|<script/);
  assert.match(travelStaticLinks("albania", config), /\/trip-cost-calculator/);
});
test("prerender stays useful with missing price data", () => {
  const html = travelStaticContent("/trip-cost-calculator", { ...context, ok: false, prices: new Map() }, readMonetizationConfig({}));
  assert.match(html, /Prices could not be loaded/);
  assert.match(html, /Price unavailable/);
  assert.doesNotMatch(html, /€0\.00/);
});
test("English-only release retains complete matching Albanian travel and commercial translations", () => {
  assert.equal(ALBANIAN_ENABLED, false);
  function shape(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(shape);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
    assert.equal(typeof value, "string"); assert.ok((value as string).trim());
    return "string";
  }
  for (const copy of [travelCopy, commercialCopy, layoutCopy]) assert.deepEqual(shape(copy.sq), shape(copy.en));
  const calculator = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(TripCostCalculatorPage, { lang: "sq", data: null, fxRates: null, loading: false })));
  assert.ok(calculator.includes(travelCopy.sq.calculator));
  assert.ok(calculator.includes("Shqipëri"));
  assert.ok(calculator.includes(travelCopy.sq.noData));
  assert.ok(!calculator.includes("One-way distance"));
  const guide = renderToStaticMarkup(createElement(AlbaniaCarRentalGuidePage, { lang: "sq", data: null }));
  for (const section of travelCopy.sq.guideSections) {
    assert.ok(guide.includes(section.title));
    for (const bullet of section.bullets) assert.ok(guide.includes(bullet));
  }
});
