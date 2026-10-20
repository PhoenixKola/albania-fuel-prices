/** Build gate: source-dated country copy must agree with crawlable HTML and FAQ JSON-LD. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { COUNTRY_EDITORIAL } from "../src/config/countryContent";
import { countryPageContent } from "../src/config/countryPageContent";
import { countryMetaDescription } from "../src/config/countryMetaDescription";
import { isCountryIndexable } from "../src/generated/indexableCountries";
import type { LatestEurope } from "../src/models/fuel";

const dist = resolve(import.meta.dirname, "../dist");
const data = JSON.parse(readFileSync(resolve(import.meta.dirname, "../../data/latest.json"), "utf8")) as LatestEurope;
const sitemap = readFileSync(resolve(dist, "sitemap.xml"), "utf8");
const required = [
  "/", "/fuel-prices/albania", "/fuel-prices/kosovo", "/fuel-prices/greece",
  "/fuel-prices/italy", "/fuel-prices/croatia", "/fuel-prices/portugal",
  "/compare", "/trip-cost-calculator", "/stations", "/road-status",
  "/insights/cross-border-fill-up-math", "/insights/six-months-of-balkan-fuel-prices",
];
const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

for (const route of required) {
  const path = route === "/" ? resolve(dist, "index.html") : resolve(dist, `${route.slice(1)}.html`);
  const html = readFileSync(path, "utf8");
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
  const count = (pattern: RegExp) => [...head.matchAll(pattern)].length;
  assert.equal(count(/<title>/g), 1, `${route}: title`);
  assert.equal(count(/<meta name="description"/g), 1, `${route}: description`);
  assert.equal(count(/<link rel="canonical"/g), 1, `${route}: canonical`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${route}: H1`);
  assert.match(html, /<html[^>]+lang="en"/, `${route}: language`);
  assert.match(html, /<meta name="robots" content="index,follow/, `${route}: robots`);
  const canonical = `https://karburantisot.com${route === "/" ? "" : route}`;
  assert.ok(html.includes(`<link rel="canonical" href="${canonical}"`), `${route}: canonical destination`);
  assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), `${route}: sitemap`);
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
