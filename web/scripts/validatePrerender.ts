/** Build gate: source-dated country copy must agree with crawlable HTML and FAQ JSON-LD. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { COUNTRY_EDITORIAL } from "../src/config/countryContent";
import { countryPageContent } from "../src/config/countryPageContent";
import { countryMetaDescription } from "../src/config/countryMetaDescription";
import { isCountryIndexable } from "../src/generated/indexableCountries";
import type { LatestEurope } from "../src/models/fuel";
import { calculateFuelDetour, DEFAULT_DETOUR } from "../src/models/fuelDetour";
import { fuelDetourCopy } from "../src/config/fuelDetourCopy";
import { SQ_ALBANIA_PATH, EN_ALBANIA_PATH, albaniaAlternates, albaniaSqModel, sqAlbaniaSchema } from "../src/config/localizedAlbania";

const dist = resolve(import.meta.dirname, "../dist");
const data = JSON.parse(readFileSync(resolve(import.meta.dirname, "../../data/latest.json"), "utf8")) as LatestEurope;
const sitemap = readFileSync(resolve(dist, "sitemap.xml"), "utf8");
const required = [
  SQ_ALBANIA_PATH,
  "/", "/fuel-prices/albania", "/fuel-prices/kosovo", "/fuel-prices/greece",
  "/fuel-prices/italy", "/fuel-prices/croatia", "/fuel-prices/portugal",
  "/compare", "/trip-cost-calculator", "/fuel-detour-calculator", "/stations", "/road-status",
  "/insights/cross-border-fill-up-math", "/insights/six-months-of-balkan-fuel-prices",
];
const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

for (const route of required) {
  const path = route === "/" ? resolve(dist, "index.html") : resolve(dist, `${route.slice(1)}.html`);
  const html = readFileSync(path, "utf8");
  if (route === "/fuel-prices/albania" || route === "/fuel-prices/kosovo") {
    const market = data.countries.find(row => row.country.toLowerCase() === route.split("/").at(-1))!;
    for (const value of [market.gasoline95_eur, market.diesel_eur]) if (value != null) assert.ok(html.includes(value.toFixed(3)), `${route}: accepted price`);
    const date = market.source_as_of ?? (market.provenance ? market.last_observed_at : data.as_of);
    if (date) assert.ok(html.includes(date), `${route}: market date`);
    for (const target of ["/compare", "/trip-cost-calculator", "/fuel-detour-calculator"]) assert.ok(html.includes(`href="${target}"`), `${route}: crawlable ${target}`);
  }
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
  const count = (pattern: RegExp) => [...head.matchAll(pattern)].length;
  assert.equal(count(/<title>/g), 1, `${route}: title`);
  assert.equal(count(/<meta name="description"/g), 1, `${route}: description`);
  assert.equal(count(/<link rel="canonical"/g), 1, `${route}: canonical`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${route}: H1`);
  assert.match(html, route === SQ_ALBANIA_PATH ? /<html[^>]+lang="sq"/ : /<html[^>]+lang="en"/, `${route}: language`);
  assert.match(html, /<meta name="robots" content="index,follow/, `${route}: robots`);
  const canonical = `https://karburantisot.com${route === "/" ? "" : route}`;
  assert.ok(html.includes(`<link rel="canonical" href="${canonical}"`), `${route}: canonical destination`);
  assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), `${route}: sitemap`);
  for (const alternate of albaniaAlternates(route)) assert.ok(head.includes(`<link rel="alternate" hreflang="${alternate.lang}" href="https://karburantisot.com${alternate.path}"`), `${route}: reciprocal ${alternate.lang}`);
  if (route === EN_ALBANIA_PATH) assert.ok(html.includes(`href="${SQ_ALBANIA_PATH}"`), "English page links to its Albanian counterpart");
  if (route === SQ_ALBANIA_PATH) {
    const model = albaniaSqModel(data);
    assert.ok(html.includes(escapeHtml(model.answer)), "Albanian page: accepted source-dated first answer");
    for (const fuel of model.fuels) assert.ok(html.includes(escapeHtml(model.price(fuel.eur))), "Albanian page: accepted per-litre prices");
    for (const target of [EN_ALBANIA_PATH, "/methodology", "/stations", "/trip-cost-calculator", "/fuel-prices/kosovo", "/fuel-prices/greece"]) assert.ok(html.includes(`href="${target}"`), `Albanian crawlable link: ${target}`);
    const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(json);
    assert.deepEqual(JSON.parse(json[1]), sqAlbaniaSchema(data));
    for (const faq of model.faqs.filter((_, i) => i !== 3)) assert.ok(html.includes(escapeHtml(faq.answer)), "Albanian visible/schema FAQ parity");
    assert.ok(!html.includes("Country market briefing"), "Albanian page has no English editorial shell");
  }
  if (route === "/fuel-detour-calculator") {
    const copy = fuelDetourCopy.en;
    const result = calculateFuelDetour(DEFAULT_DETOUR, data);
    for (const phrase of [copy.title, copy.lede, copy.method, copy.limits,
      ...(result ? [
        ...(result.comparison.stale ? [copy.stale] : []),
        new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR" }).format(result.netDifference),
      ] : [copy.unavailable])]) {
      assert.ok(html.includes(escapeHtml(phrase)), `detour: visible shared content: ${phrase.slice(0, 24)}`);
    }
    assert.ok(readFileSync(resolve(dist, "compare.html"), "utf8").includes("/fuel-detour-calculator"), "detour: discoverable from Compare");
  }
  if (!route.startsWith("/fuel-prices/")) continue;
  const editorial = COUNTRY_EDITORIAL.find((country) => route.endsWith(`/${country.slug}`));
  assert.ok(editorial);
  assert.ok(isCountryIndexable(editorial.slug));
  const expectedDescription = countryMetaDescription(editorial.metaDescription, editorial.dataCountryName, data);
  assert.ok(head.includes(`<meta name="description" content="${escapeHtml(expectedDescription)}"`), `${route}: shared meta description`);
  const safe = countryPageContent(editorial, data, "en");
  for (const sentence of [safe.marketOverview, safe.borderAdvice, safe.sourceTransparency, ...safe.faqs.map((faq) => faq.answer)]) {
    assert.ok(html.includes(escapeHtml(sentence)), `${route}: shared visible copy`);
  }
  const script = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(script, `${route}: JSON-LD`);
  const parsed = JSON.parse(script[1]) as { "@graph"?: Array<{ "@type": string; mainEntity?: Array<{ name: string; acceptedAnswer: { text: string } }> }> };
  const faq = parsed["@graph"]?.find((node) => node["@type"] === "FAQPage");
  assert.deepEqual(faq?.mainEntity?.map((question) => ({ question: question.name, answer: question.acceptedAnswer.text })), safe.faqs);
}
console.log(`Validated ${required.length} indexable prerendered routes, sitemap entries and country FAQ parity.`);
