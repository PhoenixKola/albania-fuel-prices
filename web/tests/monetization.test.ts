import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ADSTERRA_NATIVE, adsterraAllowed, isAdsterraRoute, readMonetizationConfig, validatedRentalUrl } from "../src/config/monetization";
import RentalReferral from "../src/components/ads/RentalReferral";
import { PrivacyChoices } from "../src/components/ads/MonetizationProvider";
import { AdContext } from "../src/components/ads/AdContext";
import { DEFAULT_PRIVACY_PREFERENCES, PRIVACY_PREFERENCES_KEY, readPrivacyPreferences, writePrivacyPreferences } from "../src/services/privacyPreferences";

test("partner links preserve attribution and placement fallbacks", () => {
  const link = "https://www.discovercars.com/albania?a_aid=test-account&a_bid=abc&chan=calculator";
  assert.equal(validatedRentalUrl(link), link);
  for (const raw of [undefined, "", "https://discovercars.com/albania", "https://discovercars.com/?a_aid=YOUR_ID", "http://discovercars.com/?a_aid=x", "javascript:alert(1)", "https://discovercars.com.evil.test/?a_aid=x", "https://user:pass@discovercars.com/?a_aid=x", "https://discovercars.com:444/?a_aid=x"]) assert.equal(validatedRentalUrl(raw), null);
  const config = readMonetizationConfig({ VITE_RENTAL_URL: link });
  for (const placement of ["calculator", "guide", "roadTrip", "albania"] as const) assert.equal(config.rentalLinks[placement], link);
  const override = "https://www.discovercars.com/albania?a_aid=test-account&chan=guide";
  assert.equal(readMonetizationConfig({ VITE_RENTAL_URL: link, VITE_RENTAL_URL_GUIDE: override }).rentalLinks.guide, override);
  const html = renderToStaticMarkup(createElement(RentalReferral, { lang: "en", placement: "guide", config }));
  assert.match(html, /rel="sponsored noopener"/);
  assert.match(html, /may earn a commission/);
  assert.match(html, /a_aid=test-account&amp;a_bid=abc&amp;chan=calculator/);
  assert.equal(renderToStaticMarkup(createElement(RentalReferral, { lang: "en", placement: "guide", config: readMonetizationConfig({}) })), "");
});

test("Adsterra requires the exact flag, production, production host and explicit consent", () => {
  const config = readMonetizationConfig({ VITE_DEPLOY_ENV: "production", VITE_ADSTERRA_ENABLED: "true" });
  assert.equal(config.adsterraEnabled, true);
  assert.equal(adsterraAllowed(config, "karburantisot.com", true), true);
  assert.equal(adsterraAllowed(config, "www.karburantisot.com", true), true);
  assert.equal(adsterraAllowed(config, "karburantisot.com", false), false);
  for (const host of ["localhost", "127.0.0.1", "preview.pages.dev", "karburantisot.com.evil.test"]) assert.equal(adsterraAllowed(config, host, true), false);
  assert.equal(adsterraAllowed(readMonetizationConfig({ VITE_DEPLOY_ENV: "production" }), "karburantisot.com", true), false);
  assert.equal(adsterraAllowed(readMonetizationConfig({ VITE_ADSTERRA_ENABLED: "true" }), "karburantisot.com", true), false);
  assert.deepEqual(ADSTERRA_NATIVE, {
    scriptUrl: "https://pl31351771.profitableratecpmnetwork.com/d3a677f82e7972dbdc5767166cde992f/invoke.js",
    containerId: "container-d3a677f82e7972dbdc5767166cde992f",
  });
  for (const path of ["/", "/fuel-prices/albania", "/albania-car-rental-guide", "/road-trip-fuel-guide", "/how-fuel-prices-work", "/europe-fuel-comparison"]) assert.equal(isAdsterraRoute(path), true);
  for (const path of ["/trip-cost-calculator", "/road-status", "/privacy", "/terms", "/fuel-quiz", "/daily-challenge", "/stations", "/contact", "/missing"]) assert.equal(isAdsterraRoute(path), false);
});

test("privacy preference storage is versioned, strict and reversible", () => {
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
  assert.deepEqual(readPrivacyPreferences(storage), DEFAULT_PRIVACY_PREFERENCES);
  assert.equal(writePrivacyPreferences(true, storage).advertising, true);
  assert.equal(readPrivacyPreferences(storage).advertising, true);
  assert.equal(writePrivacyPreferences(false, storage).advertising, false);
  assert.equal(readPrivacyPreferences(storage).advertising, false);
  values.set(PRIVACY_PREFERENCES_KEY, '{"version":2,"necessary":true,"advertising":true}');
  assert.deepEqual(readPrivacyPreferences(storage), DEFAULT_PRIVACY_PREFERENCES);
});

test("footer privacy control is provider-neutral and always available", () => {
  let opened = false;
  const value = { lang: "en" as const, enabled: false, pathname: "/", advertising: null, setAdvertising: () => undefined, openPrivacy: () => { opened = true; } };
  const html = renderToStaticMarkup(createElement(AdContext.Provider, { value }, createElement(PrivacyChoices)));
  assert.match(html, /Privacy &amp; cookies/);
  assert.doesNotMatch(html, /Google|Advertising settings are unavailable/);
  value.openPrivacy();
  assert.equal(opened, true);
});

test("active application and static head contain no AdSense runtime", () => {
  const files = ["index.html", "src/components/ads/MonetizationProvider.tsx", "src/components/ads/AdsterraNativeAd.tsx", "scripts/prerender.ts"];
  for (const file of files) assert.doesNotMatch(readFileSync(file, "utf8"), /adsbygoogle|googlefc|googlesyndication|google-adsense-account/i);
});
